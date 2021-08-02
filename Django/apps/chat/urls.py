from django.urls import path
from .views import AllChatsTEST, AllMessages, AllPrivateChat, ChatMessages

app_name = 'chat'

urlpatterns = [
    path('messages/<int:pk>', ChatMessages.as_view(), name='messages'),
    path('chats', AllPrivateChat.as_view(), name='chats'),
    path('chats/all', AllChatsTEST.as_view(), name='chats'),
]