# INSTALACIÓN Y CONFIGURACIÓN DE WEBSOCKETS EN TIEMPO REAL

## 📦 1. INSTALAR DEPENDENCIAS (Backend)

```bash
pip install channels channels-redis daphne
```

## ⚙️ 2. CONFIGURACIÓN DE DJANGO

### settings.py

```python
INSTALLED_APPS = [
    # ... otras apps
    'daphne',  # ⬅️ Debe estar ANTES de 'django.contrib.staticfiles'
    'channels',
    # ... resto de apps
]

# ASGI Configuration
ASGI_APPLICATION = 'your_project.asgi.application'

# Channels Configuration
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}

# Si no tienes Redis, puedes usar InMemoryChannelLayer (solo para desarrollo)
# CHANNEL_LAYERS = {
#     "default": {
#         "BACKEND": "channels.layers.InMemoryChannelLayer"
#     }
# }
```

### your_project/asgi.py

```python
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from matches.routing import websocket_urlpatterns  # Importar rutas WebSocket

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
```

## 🔧 3. ESTRUCTURA DE ARCHIVOS

```
matches/
├── consumers.py              # ⬅️ WebSocket consumer
├── routing.py                # ⬅️ WebSocket routes
├── utils/
│   └── websocket_notifier.py # ⬅️ Helper para notificaciones
└── views.py                  # ⬅️ Actualizado con notificaciones
```

## 🚀 4. INICIAR EL SERVIDOR

### Opción A: Con Daphne (Producción)
```bash
daphne -b 0.0.0.0 -p 8000 your_project.asgi:application
```

### Opción B: Con Runserver (Desarrollo)
```bash
python manage.py runserver
```

Django 3.0+ ya soporta ASGI con runserver, pero Daphne es mejor para producción.

## 📡 5. INSTALAR REDIS (Si usas RedisChannelLayer)

### MacOS
```bash
brew install redis
brew services start redis
```

### Ubuntu/Debian
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

### Windows
Descargar desde: https://redis.io/download

O usar WSL con Ubuntu.

## 🎨 6. FRONTEND

### Copiar archivos:
- `matchesWebSocket.js` → `src/infrastructure/websocket/`
- `useMatchesRealtime.js` → `src/hooks/`
- Actualizar tu componente con el ejemplo de `OpenMatches.jsx`

## ✅ 7. VERIFICAR QUE FUNCIONA

1. Abre el navegador y ve a la consola (F12)
2. Deberías ver: `✅ WebSocket connected to matches`
3. Abre otra pestaña/navegador
4. Únete a un partido en una pestaña
5. Deberías ver la actualización en tiempo real en la otra pestaña

## 🐛 8. TROUBLESHOOTING

### Error: "Cannot import name 'RedisChannelLayer'"
```bash
pip install channels-redis
```

### Error: "Connection refused" al conectar WebSocket
- Verifica que Redis esté corriendo: `redis-cli ping` (debe responder PONG)
- Verifica que el servidor ASGI esté corriendo

### Error: "WebSocket is closed before the connection is established"
- Verifica que el token JWT esté en localStorage
- Verifica la URL del WebSocket (debe ser ws:// o wss://)

## 📝 9. NOTAS IMPORTANTES

1. **Producción**: Usa `channels-redis` con Redis real
2. **Desarrollo**: Puedes usar `InMemoryChannelLayer` (pero no funciona con múltiples workers)
3. **HTTPS**: Si usas HTTPS, cambia `ws://` por `wss://` en el frontend
4. **CORS**: Asegúrate de configurar CORS para WebSockets

## 🎯 10. ALTERNATIVA SIN WEBSOCKETS (Polling)

Si WebSockets es demasiado complejo, puedes usar polling simple:

```javascript
// En tu componente
useEffect(() => {
  const interval = setInterval(() => {
    loadMatches(); // Recargar cada 5 segundos
  }, 5000);
  
  return () => clearInterval(interval);
}, []);
```

Pero WebSockets es MUCHO mejor para tiempo real! 🚀
