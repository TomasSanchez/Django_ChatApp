import json

from .models import PrivateChat, Message
from .serializers import MessageSerializer

from asgiref.sync import async_to_sync, sync_to_async

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from channels.layers import get_channel_layer
from channels.auth import get_user
from channels.auth import login as channels_login
from django.contrib.sessions.backends.db import SessionStore
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model

User = get_user_model()

class AsyncPrivateChatConsumer(AsyncWebsocketConsumer):
    """ Main Consumer which handles saving incoming messages and retrieving chat group """


    @database_sync_to_async
    def get_chatGroup(self, room):
        succes = False
        try:
            chatGroup = PrivateChat.objects.get(id=room)
            succes = True
        except PrivateChat.DoesNotExist:
            chatGroup = ''
        return chatGroup, succes


    @database_sync_to_async
    def get_user_obj(self, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            user = AnonymousUser()
        return user

    @database_sync_to_async
    def save_message(self, author, content):
        chat = PrivateChat.objects.get(group_name=self.chatGroup)
        saved_message = Message.objects.create(author=author, content=content, chat_private=chat)
        serialized_m = MessageSerializer(saved_message)
        return serialized_m.data


    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        # gets channel object or closes connection
        self.chatGroup, succes = await self.get_chatGroup(room=self.room_name)

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



class AsyncPrivateChatConsumerWnotifications(AsyncWebsocketConsumer):
    """ Consumer which handles saving incoming messages and opening connection per user instead of per chat """


    @database_sync_to_async
    def get_threads(self, user):
        all_threads = PrivateChat.objects.filter(users=user)
        print(f"------------------------------------------ \n << all_threads:  {all_threads} >> \n------------------------------------------")        
        return all_threads.values()

    @database_sync_to_async
    def get_chatGroup(self, room):
        succes = False
        try:
            chatGroup = PrivateChat.objects.get(id=room)
            succes = True
        except PrivateChat.DoesNotExist:
            chatGroup = ''
        return chatGroup, succes


    @database_sync_to_async
    def get_user_obj(self, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            user = AnonymousUser()
        return user

    @database_sync_to_async
    def save_message(self, author, content):
        chat = PrivateChat.objects.get(group_name=self.chatGroup)
        saved_message = Message.objects.create(author=author, content=content, chat_private=chat)
        serialized_m = MessageSerializer(saved_message)
        return serialized_m.data


    def something(self, all_threads):
        for thread in all_threads:
            print(f"------------------------------------------ \n << Thread:  {thread} >> \n------------------------------------------")
            print(f"------------------------------------------ \n << Thread.id:  {thread.id} >> \n------------------------------------------")
            print(f"------------------------------------------ \n << channel_name:  {self.channel_name} >> \n------------------------------------------")
            self.channel_layer.group_add(thread.id, self.channel_name)
            print(f"------------------------------------------ \n <<>> \n------------------------------------------")


    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        # gets channel object or closes connection
        self.chatGroup, succes = await self.get_chatGroup(room=self.room_name)
        # print(f"------------------------------------------ \n << scope:  {self.scope} >> \n------------------------------------------")
        # print(f"------------------------------------------ \n << scope.url.kwargs:  {self.scope['url_route']['kwargs']} >> \n------------------------------------------")
        # Join room group
        # await self.channel_layer.group_add(
        #     self.room_group_name,
        #     self.channel_name
        # )
        # accept connection
        await self.accept()

        # Closes connection as no chat exist with current room_name url
        if not succes:
            await self.send(text_data=json.dumps('No chat found'))
            await self.close()


    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        user = await self.get_user_obj(user_id=data['user']['id'])
        if 'message' in data:
            message = data['message']
            if not user.is_authenticated:
                await self.send(text_data=json.dumps('User not authenticated'))
                await self.close()
            serialized_data = await self.save_message(author=user, content=message)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': serialized_data
                }
            )
        else:
            all_threads = await self.get_threads(user)
            print(f"------------------------------------------ \n << data:  {data} >> \n------------------------------------------")
            sync_to_async(self.something)(all_threads)
            # store client channel name in the user session
            print(f"------------------------------------------ \n self.scope.session after << {self.scope['session']} >> \n------------------------------------------")
            # print(f"------------------------------------------ \n self.scope.session.channel_name before << {self.scope['session']['channel_name']} >> \n------------------------------------------")
            self.scope['session']['channel_name'] = self.channel_name
            print(f"------------------------------------------ \n self.scope.session after << {self.scope['session']} >> \n------------------------------------------")
            print(f"------------------------------------------ \n self.scope.session.channel_name after << {self.scope['session']['channel_name']} >> \n------------------------------------------")
            self.scope['session'].save()

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'data': message
        }))



class PrivateChatConsumerWnotifications(WebsocketConsumer):

    def get_user_obj(self, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            user = AnonymousUser()
        return user

    def save_message(self, author, content, group_id):
        # TODO Add error handling
        chat = PrivateChat.objects.get(id=group_id)
        saved_message = Message.objects.create(author=author, content=content, chat_private=chat)
        serialized_m = MessageSerializer(saved_message)
        return serialized_m.data

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        # Join room group
        # async_to_sync(self.channel_layer.group_add)(
        #     self.room_group_name,
        #     self.channel_name
        # )

        self.accept()

    # Receive message from WebSocket
    def receive(self, text_data):

        data = json.loads(text_data)
        user = self.get_user_obj(user_id=data['user']['id'])
        if 'message' in data:
            print(f"------------------------------------------ \n << 1 data:  {data} >> \n------------------------------------------")
            print(f"------------------------------------------ \n << 1 data[\'group\']:  {data['group']} >> \n------------------------------------------")
            message = data['message']
            if not user.is_authenticated:
                self.send(text_data=json.dumps('User not authenticated'))
                self.close()
            print(f"------------------------------------------ \n << 1 before >> \n------------------------------------------")
            serialized_data = self.save_message(author=user, content=message, group_id=data['group'])
            print(f"------------------------------------------ \n << 1 after >> \n------------------------------------------")
            print(f"------------------------------------------ \n << 1 serialized_data:  {serialized_data} >> \n------------------------------------------")
            async_to_sync(self.channel_layer.group_send)(
                str(data['group']),
                {
                    'type': 'chat_message',
                    'message': serialized_data
                }
            )
        else:
            all_threads = PrivateChat.objects.filter(users=user)
            for thread in all_threads:
                async_to_sync(self.channel_layer.group_add)(str(thread.id), self.channel_name)
            print(f"------------------------------------------ \n <<<<<<  user:  {user} >>>>>> \n------------------------------------------")
            # store client channel name in the user session
            self.scope['session']['channel_name'] = self.channel_name
            self.scope['session'].save()


    # Receive message from room group
    def chat_message(self, event):
        message = event['message']
        # private_chat = event['private_chat']
        print(f"------------------------------------------ \n << chat_message event:  {event} >> \n------------------------------------------")
        print(f"------------------------------------------ \n << chat_message message:  {message} >> \n------------------------------------------")

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'data': message,
            # 'group': private_chat
        }))


    def disconnect(self, close_code):
        # Leave room group
        if 'channel_name' in self.scope['session']:
            del self.scope['session']['channel_name']
            self.scope['session'].save()
        async_to_sync(self.channel_layer.group_discard)(self.scope['user'].id, self.channel_name)