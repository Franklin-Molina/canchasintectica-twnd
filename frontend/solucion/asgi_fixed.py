# your_project/asgi.py - VERSIÓN CORREGIDA

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

# Configurar Django ANTES de importar las rutas
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project.settings')

# Obtener la aplicación ASGI de Django para HTTP
django_asgi_app = get_asgi_application()

# Ahora SÍ importar las rutas (después de configurar Django)
from matches.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    # HTTP normal usa Django ASGI (no WebSocket)
    "http": django_asgi_app,
    
    # Solo WebSocket usa el routing especial
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
