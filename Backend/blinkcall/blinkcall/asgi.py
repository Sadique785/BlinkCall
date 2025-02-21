import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blinkcall.settings')
django.setup()
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from room.websocket.routing import websocket_urlpatterns  # we'll create this next

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blinkcall.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})