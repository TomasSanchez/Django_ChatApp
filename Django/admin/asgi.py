import os

import apps.chat.routing

from django.urls.conf import re_path
from django.core.asgi import get_asgi_application

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.sessions import SessionMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'admin.settings')

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            apps.chat.routing.websocket_urlpatterns
            # re_path(r"^front(end)/$", consumers.AsyncChatConsumer.as_asgi()),
        )
    ),
})



