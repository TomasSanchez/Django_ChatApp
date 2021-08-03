from rest_framework import serializers
from .models import PrivateChat, Message


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
        if len(obj.private_chat_message.all()) > 0 :
            return MessageSerializer(obj.private_chat_message.all()[0], many=False).data
        return {'id': -1}
            

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