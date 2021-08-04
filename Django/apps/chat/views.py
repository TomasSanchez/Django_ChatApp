from django.contrib.auth import get_user_model
from django.db.models.query import QuerySet
from django.http.response import JsonResponse

from rest_framework import generics, serializers, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated, SAFE_METHODS

from .models import Message, PrivateChat
from .serializers import MessageSerializer, PrivateChatSerializer

User = get_user_model()

def get_authenticated_user_chats(queryset, user):
    """ returns chats if users is in them """
    return [chat for chat in queryset if user in chat.users.all()]


class PostUserWritePermission(BasePermission):
    message = 'Editing posts is restricted to post owner'

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        return obj.author == request.user 


class ChatMessages(generics.ListAPIView):
    """ Returns all messages from a given chat/group"""

    permission_classes = [IsAuthenticated]
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        chat_private = PrivateChat.objects.get(id=pk)
        queryset = self.queryset
        if isinstance(queryset, QuerySet):
            queryset = queryset.filter(chat_private=chat_private).order_by('-created_at')
        return queryset


class UserPrivateChats(generics.ListAPIView):
    """ Returns all chats the current user """

    permission_classes = [IsAuthenticated]
    queryset = PrivateChat.objects.all()
    serializer_class = PrivateChatSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = self.queryset
        if isinstance(queryset, QuerySet):
            queryset = queryset.all()
            queryset = get_authenticated_user_chats(queryset=queryset, user=user)
        return queryset


class CreateGroupChat(generics.CreateAPIView):

    permission_classes = [IsAuthenticated]
    queryset = PrivateChat.objects.all()
    serializer_class = PrivateChatSerializer

    def create(self, request, *args, **kwargs):
        user = self.request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        instance.users.add(user)
        if 'pk' in self.kwargs:
            pk = self.kwargs['pk']
            second_user = User.objects.get(id=pk)
            instance.users.add(second_user)
        instance.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class JoinGroupChat(generics.GenericAPIView):
    """ Joins user to a chat, or adds another user to chat """
    
    permission_classes = [IsAuthenticated]
    queryset = PrivateChat.objects.all()
    serializer_class = PrivateChatSerializer

    def put(self, request, *args, **kwargs):
        print("I GOT HIS FAR")
        group_name = kwargs['group_name']
        try:
            instance = self.queryset.get(group_name=group_name)
        except PrivateChat.DoesNotExist:
            return Response({'error': 'Group With that name does not exists.'},status=status.HTTP_404_NOT_FOUND)
        user = self.request.user
        if user in instance.users.all():
            print('user already in group!')
            instance.users.remove(user.id)
            print(f'{user} has left the group')
            response = f"{user.user_name} has left the group"
        else:
            print('user not in group')    
            instance.users.add(user)
            print(f'{user} has joined the group')
            response = f"{user.user_name} has joined the group"
        return Response(response, status.HTTP_202_ACCEPTED)


class DeleteGroupChat(generics.DestroyAPIView):
    """ Delete a chat """
    
    permission_classes = [IsAuthenticated]
    queryset = PrivateChat.objects.all()
    serializer_class = PrivateChatSerializer

    def destroy(self, request, *args, **kwargs):
        user = self.request.user
        instance = self.get_object()
        if user in instance.users.all():
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"Error": "Cannot delete a chat which you are not from"}, status=status.HTTP_403_FORBIDDEN)

    def perform_destroy(self, instance):
        instance.delete()






# REMOVE
class AllChatsTEST(generics.ListAPIView):

    permission_classes = [AllowAny]
    queryset = PrivateChat.objects.all()
    serializer_class = PrivateChatSerializer

# REMOVE
class AllMessages(generics.ListAPIView):
    """ returns all messages from current user """
    
    permission_classes = [IsAuthenticated]
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = self.queryset
        chats = PrivateChat.objects.all()

        if isinstance(queryset, QuerySet):
            query = []
            chat_query = get_authenticated_user_chats(queryset=chats, user=user)
            queryset = queryset.all()
            for chat in chat_query:
                chat.private_chat_message.all()

        return queryset