import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blinkcall.settings')
django.setup()
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from room.websocket.middleware.jwt_middleware import JWTAuthMiddleware
from room.websocket.routing import websocket_urlpatterns  # we'll create this next

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blinkcall.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddleware(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})