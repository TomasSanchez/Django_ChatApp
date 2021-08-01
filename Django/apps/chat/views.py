from django.contrib.auth import get_user_model
from django.shortcuts import render, get_object_or_404
from .models import Chat

User = get_user_model()

# View for all chats of current user
# View for all messages of current user on a specific chat
# 


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