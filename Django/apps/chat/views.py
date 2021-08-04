from django.contrib.auth import get_user_model
from django.db.models.query import QuerySet
from django.http.response import JsonResponse

from rest_framework import generics, serializers, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated, SAFE_METHODS

from .models import Message, PrivateChat
from .serializers import MessageSerializer, PrivateChatSerializer

User = get_user_model()

# View for all messages of current user on a specific chat

def get_authenticated_user_chats(queryset, user):
    query = []
    for chat in queryset:
        if user in chat.users.all():
            query.append(chat)
    return query


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
        instance.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class JoinGroupChat(generics.UpdateAPIView):
    """ Joins user to a chat, or adds another user to chat """
    
    permission_classes = [IsAuthenticated]
    queryset = PrivateChat.objects.all()
    serializer_class = PrivateChatSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        user = self.request.user
        if user in instance.users.all():
            print('user already in group!')
            instance.users.remove(user.id)
            print(f'{user} has joined the group')
            response = f"{user.user_name} has joined the group"
        else:
            print('user not in group')    
            instance.likes.add(user.id)
            instance.users.add(user)
            print(f'{user} has left the group')
            response = f"{user.user_name} has left the group"
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}
        return Response({"data":serializer.data,  "Info": response})

    def perform_update(self, serializer):
        serializer.save()





# REMOVE
class AllChatsTEST(generics.ListAPIView):

    permission_classes = [AllowAny]
    queryset = PrivateChat.objects.all()
    serializer_class = PrivateChatSerializer


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


"""

Group1 = GroupChat.objects.first()
Group1.members.add(Obby)
Group1.members.values()
<QuerySet [
    {'id': 1, 'password': 'pbkdf2_sha256$260000$jHh4JSxyB3XmOwviLuCuXh$MV3rKe59OPuzX+laKrXNopDUCTknheSufat0p6aSfk8=', 'last_login': datetime.datetime(2021, 7, 30, 19, 42, 24, 381126, tzinfo=<UTC>), 
'is_superuser': True, 'email': 't@t.com', 'user_name': 'Tomas', 'first_name': 'Tomas', 'last_name': 'Sanchez', 'start_date': datetime.datetime(2021, 7, 28, 22, 7, 31, 245467, tzinfo=<UTC>), 'about': None, 
'is_staff': True, 'is_active': True},
 {'id': 2, 'password': '', 'last_login': None, 'is_superuser': False, 'email': 'o@o.com', 'user_name': 'obby', 'first_name': 'obby', 'last_name': 'obby', 'start_date': 
datetime.datetime(2021, 7, 30, 19, 52, 40, 785711, tzinfo=<UTC>), 'about': None, 'is_staff': False, 'is_active': True}
]>


>>> Group1.group_chat_message.values()
<QuerySet [{'id': 1, 'author_id': 1, 'created_at': datetime.time(19, 49, 46, 161604), 'content': 'First!', 'chat_group_id': 1, 'chat_private_id': None}]>
>>> 


"""