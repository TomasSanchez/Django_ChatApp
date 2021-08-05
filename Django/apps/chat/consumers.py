import json

from .models import PrivateChat, Message
from .serializers import MessageSerializer

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from channels.auth import get_user

from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model

User = get_user_model()

class AsyncPrivateChatConsumer(AsyncWebsocketConsumer):
    """ Main Consumer which handles saving incoming messages and retrieving chat group """


    @database_sync_to_async
    def get_channel(self, room):
        succes = False
        try:
            channel = PrivateChat.objects.get(id=room)
            succes = True
        except PrivateChat.DoesNotExist:
            channel = ''
        return channel, succes


    @database_sync_to_async
    def get_user_obj(self, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            user = AnonymousUser()
        return user

    @database_sync_to_async
    def save_message(self, author, content):
        chat = PrivateChat.objects.get(group_name=self.channel)
        saved_message = Message.objects.create(author=author, content=content, chat_private=chat)
        serialized_m = MessageSerializer(saved_message)
        return serialized_m.data


    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        
        # print(f"------------------------------------------ \n << User:  {self.scope['user']} >> \n------------------------------------------")
        # gets channel object or closes connection
        self.channel, succes = await self.get_channel(room=self.room_name)

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        # accept connection
        await self.accept()

        # Closes connection as no chat exist with current room_name url
        if not succes:
            await self.send(text_data=json.dumps('No chat found'))
            await self.close()


    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        # get user
        user = await self.get_user_obj(user_id=data['user']['id'])
        
        # as of scope['user'] not working, semi solution is to check if the user is authenticated when sending a message
        if not user.is_authenticated:
            await self.send(text_data=json.dumps('User not authenticated'))
            await self.close()
        # save message to db
        serialized_data = await self.save_message(author=user, content=message)
        
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': serialized_data
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'data': message
        }))


    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )



class AsyncPublicChatConsumer(AsyncWebsocketConsumer):
    """ Basic Consumer wich recievies and relays messages to group """


    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        # accept connection
        await self.accept()

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        user = data['from']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'from': user
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        user = event['from']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'from': user
        }))


    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )



"""
class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        print(f"------------------------------------------ \n << roomname:  {self.room_name} >> \n------------------------------------------")
        self.room_group_name = 'chat_%s' % self.room_name

        print(f"------------------------------------------ \n << User from Connect:  {self.scope['user']} >> \n------------------------------------------")
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()
        message = json.dumps({
            "type": "websocket.send",
            "text": "HELLO"
        })
        self.send(message)

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        print(f"------------------------------------------ \n << User from Receive:  {self.scope['user']} >> \n------------------------------------------")
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))

"""