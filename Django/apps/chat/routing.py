from django.urls import re_path

from .consumers import AsyncPrivateChatConsumer

websocket_urlpatterns = [
    # re_path(r'ws/chat/group/(?P<room_name>\w+)/$', ChatConsumerAsync.as_asgi()),
    re_path(r'ws/chat/private/(?P<room_name>\w+)/$', AsyncPrivateChatConsumer.as_asgi()),
]