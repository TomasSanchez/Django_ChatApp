from rest_framework import serializers
from .models import PrivateChat, Message


fields = ('id', 'email', 'first_name', 'last_name', 'user_name', 'start_date', 'about', 'password')
extra_kwargs = {'password': {'write_only': True}}







class PrivateChatSerializer(serializers.ModelSerializer):

    users = serializers.SerializerMethodField()
    messages = serializers.SerializerMethodField()


    class Meta:
        model = PrivateChat
        fields = ('id', 'group_name', 'users', 'created_at', 'messages')

    def get_users(self, obj):
        users = obj.users.all()
        return [{'user_id': user.id, 'user_name': user.user_name, 'first_name': user.first_name, 'last_name': user.last_name} for user in users]   

    def get_messages(self, obj):
        # if not(length(obj.private_chat_message.all()) > 0):
        #     return 
        return obj.private_chat_message.all().values() #[0]to get last message and not get all of them



class PrivateChatSmallSerializer(serializers.ModelSerializer):

    class Meta:
        model = PrivateChat
        fields = ('id', 'group_name', 'created_at')


class MessageSerializer(serializers.ModelSerializer):
    
    author = serializers.SerializerMethodField()
    private_chat = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ('id', 'author', 'created_at', 'content', 'private_chat')

    def get_author(self, obj):
        user_name = obj.author.user_name
        user_id = obj.author.id
        first_name = obj.author.first_name
        last_name = obj.author.last_name
        return {'user_id':user_id, 'user_name': user_name, 'first_name':first_name, 'last_name': last_name}


    def get_private_chat(self, obj):
        return PrivateChatSmallSerializer(obj.chat_private, many=False).data

# Probably not needed, maybe only id TEST FIX
    # def get_private_chat(self, obj):
    #     chat_id = obj.chat_private.id
    #     chat_name = obj.chat_private.group_name
    #     created_at = obj.chat_private.created_at
    #     # users = obj.chat_private.users.values()
    #     return {'chat_id': chat_id, 'chat_name':chat_name, 'created_at':created_at} #, 'users':users}

