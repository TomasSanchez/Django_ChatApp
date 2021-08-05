from django.urls import path
from .views import AllChatsTEST, AllMessages, UserPrivateChats, ChatMessages, CreateGroupChat, JoinOrLeaveGroupChat, DeleteGroupChat

app_name = 'chat'

urlpatterns = [
    path('chats', UserPrivateChats.as_view(), name='chats'),
    path('chat/create', CreateGroupChat.as_view(), name='create_chats'), # Without pk make a group 
    path('chat/create/<int:pk>', CreateGroupChat.as_view(), name='create_chats'), # With pk create group including another person
    path('messages/<int:pk>', ChatMessages.as_view(), name='messages'),
    path('join/<str:group_name>', JoinOrLeaveGroupChat.as_view(), name='join_group'),
    path('delete/<int:pk>', DeleteGroupChat.as_view(), name='join_group'),

    # REMOVE
    path('chats/all', AllChatsTEST.as_view(), name='chats'),

]