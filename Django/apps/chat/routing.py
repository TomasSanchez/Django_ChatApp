from django.urls import re_path

from .consumers import AsyncPrivateChatConsumer, AsyncPrivateChatConsumerWnotifications, AsyncPublicChatConsumer, PrivateChatConsumerWnotifications

websocket_urlpatterns = [
    re_path(r'ws/chat/public/(?P<room_name>\w+)/$', AsyncPublicChatConsumer.as_asgi()),
    re_path(r'ws/chat/private/(?P<room_name>\w+)/$', AsyncPrivateChatConsumer.as_asgi()),
    re_path(r'ws/chat/privatewn/(?P<room_name>\w+)/$', PrivateChatConsumerWnotifications.as_asgi()),
]