from django.contrib.auth import get_user_model
from django.db.models import query
from django.shortcuts import render, get_object_or_404
from django.http.response import JsonResponse
from django.db.models.query import QuerySet

from rest_framework import generics, filters
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
            print(f"True {user} is in {chat}")
            query.append(chat)
    return query


class PostUserWritePermission(BasePermission):
    message = 'Editing posts is restricted to post owner'

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        return obj.author == request.user 


class AllMessages(generics.ListAPIView):
    """ returns all messages from current user """
    
    permission_classes = [IsAuthenticated]
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def get_queryset(self):
        user = self.request.user
        assert self.queryset is not None, (
            "'%s' should either include a `queryset` attribute, "
            "or override the `get_queryset()` method."
            % self.__class__.__name__
        )
        queryset = self.queryset
        chats = PrivateChat.objects.all()

        if isinstance(queryset, QuerySet):
            query = []
            chat_query = get_authenticated_user_chats(queryset=chats, user=user)
            queryset = queryset.all()
            print(f"------------------------------------------ \n << chat_query: \n{chat_query} \n >> \n------------------------------------------")
            print(f"------------------------------------------ \n << queryset: \n{queryset} \n >> \n------------------------------------------")
            for chat in chat_query:
                chat.private_chat_message.all()

        return queryset


class ChatMessages(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def get_queryset(self):
        pk = self.kwargs['pk']
        chat_private = PrivateChat.objects.get(id=pk)
        queryset = self.queryset
        if isinstance(queryset, QuerySet):
            # Ensure queryset is re-evaluated on each request.
            queryset = queryset.filter(chat_private=chat_private)
        return queryset


class AllPrivateChat(generics.ListAPIView):
    """ returns all chats from the logged user """
    
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

# REMOVE
class AllChatsTEST(generics.ListAPIView):

    permission_classes = [AllowAny]
    queryset = PrivateChat.objects.all()
    serializer_class = PrivateChatSerializer


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

# 





"""
@database_sync_to_async
def get_user(scope):
    
    Return the user model instance associated with the given scope.
    If no user is retrieved, return an instance of `AnonymousUser`.
    
    # postpone model import to avoid ImproperlyConfigured error before Django
    # setup is complete.
    from django.contrib.auth.models import AnonymousUser

    if "session" not in scope:
        raise ValueError(
            "Cannot find session in scope. You should wrap your consumer in "
            "SessionMiddleware."
        )
    session = scope["session"]
    user = None
    try:
        user_id = _get_user_session_key(session)
        backend_path = session[BACKEND_SESSION_KEY]
    except KeyError:
        pass
    else:
        if backend_path in settings.AUTHENTICATION_BACKENDS:
            backend = load_backend(backend_path)
            user = backend.get_user(user_id)
            # Verify the session
            if hasattr(user, "get_session_auth_hash"):
                session_hash = session.get(HASH_SESSION_KEY)
                session_hash_verified = session_hash and constant_time_compare(
                    session_hash, user.get_session_auth_hash()
                )
                if not session_hash_verified:
                    session.flush()
                    user = None
    return user or AnonymousUser()

"""