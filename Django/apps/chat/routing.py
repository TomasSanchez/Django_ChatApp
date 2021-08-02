from django.urls import re_path

from .consumers import AsyncPrivateChatConsumer, AsyncPublicChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/public/(?P<room_name>\w+)/$', AsyncPublicChatConsumer.as_asgi()),
    re_path(r'ws/chat/private/(?P<room_name>\w+)/$', AsyncPrivateChatConsumer.as_asgi()),
]