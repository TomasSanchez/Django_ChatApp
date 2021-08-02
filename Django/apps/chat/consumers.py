import json

from .models import PrivateChat, Message, GroupChat

from asgiref.sync import async_to_sync, sync_to_async
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model


User = get_user_model()

class AsyncPrivateChatConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def get_channel(self, room):
        succes = False
        try:
            channel = PrivateChat.objects.get(group_name=room)
            succes = True
        except PrivateChat.DoesNotExist:
            channel = ''
        return channel, succes


    @database_sync_to_async
    def get_user(self, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            user = AnonymousUser()
        return user


    # def send_message(self, message):
    #     self.send(text_data=json.dumps(message))

    @database_sync_to_async
    def save_message(self, author, content):
        chat = PrivateChat.objects.get(group_name=self.channel)
        Message.objects.create(author=author, content=content, chat_private=chat)


    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        
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
            print('this ran')
            await self.send(text_data=json.dumps('No chat found'))
            await self.close()


    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        # get user
        user = await self.get_user(user_id=data['user']['id'])
        # save message to db
        await self.save_message(author=user, content=message)
        print(f"------------------------------------------ \n << data: \n{data} \n >> \n------------------------------------------")

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))


    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )




class AsyncPublicChatConsumer(AsyncWebsocketConsumer):

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