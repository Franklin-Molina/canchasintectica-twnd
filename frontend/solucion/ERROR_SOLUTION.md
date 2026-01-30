# 🔧 SOLUCIÓN AL ERROR "took too long to shut down and was killed"

## 🎯 CAUSA DEL PROBLEMA

El error ocurre porque:
1. ❌ Estás usando `asyncio.run()` dentro de views síncronos
2. ❌ ASGI está manejando peticiones HTTP normales cuando solo debería manejar WebSockets
3. ❌ Se están bloqueando los event loops

## ✅ SOLUCIÓN PASO A PASO

### PASO 1: Reemplazar tus Use Cases por lógica directa

**ANTES (MALO):**
```python
use_case = CreateOpenMatchUseCase(self.get_repository())
match = asyncio.run(use_case.execute(validated_data))  # ❌ ESTO CAUSA EL ERROR
```

**DESPUÉS (BUENO):**
```python
# Crear directamente sin asyncio
match = serializer.save(creator=request.user)  # ✅ Síncrono, sin bloqueos
```

### PASO 2: Actualizar asgi.py

Reemplaza tu `asgi.py` con el contenido de `asgi_fixed.py`:

```python
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project.settings')

# ⚠️ IMPORTANTE: Obtener django_asgi_app ANTES de importar rutas
django_asgi_app = get_asgi_application()

# Ahora sí importar
from matches.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": django_asgi_app,  # HTTP normal
    "websocket": AuthMiddlewareStack(  # Solo WebSocket
        URLRouter(websocket_urlpatterns)
    ),
})
```

### PASO 3: Actualizar views.py

Reemplaza tu `views.py` con el contenido de `views_fixed.py`.

Cambios principales:
- ✅ Eliminar todos los `asyncio.run()`
- ✅ Usar operaciones síncronas de Django ORM
- ✅ Mantener las notificaciones WebSocket

### PASO 4: Verificar settings.py

Asegúrate de tener esto en tu `settings.py`:

```python
INSTALLED_APPS = [
    'daphne',  # ⚠️ ANTES de staticfiles
    'django.contrib.admin',
    # ... resto
    'channels',
]

ASGI_APPLICATION = 'your_project.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}
```

### PASO 5: Instalar dependencias correctas

```bash
pip install channels==4.0.0
pip install channels-redis==4.1.0
pip install daphne==4.0.0
```

### PASO 6: Iniciar Redis

```bash
# MacOS
brew services start redis

# Ubuntu/Linux
sudo systemctl start redis

# Windows (WSL o instalación manual)
redis-server
```

### PASO 7: Reiniciar el servidor

```bash
# Detener el servidor actual (Ctrl+C)

# Limpiar procesos anteriores (si es necesario)
pkill -9 python

# Iniciar de nuevo
python manage.py runserver
```

## 🧪 VERIFICAR QUE FUNCIONA

1. **Probar API REST normal:**
```bash
curl http://localhost:8000/api/matches/open-matches/
```
Debería responder rápidamente sin errores.

2. **Probar WebSocket:**
Abrir el navegador, ir a tu app y verificar en consola:
```
✅ WebSocket connected to matches
```

3. **Probar tiempo real:**
- Abre dos pestañas/navegadores
- Únete a un partido en una
- Debería actualizarse en la otra

## 🚨 SI SIGUES TENIENDO PROBLEMAS

### Opción 1: Usar solo HTTP (sin WebSocket)

Si WebSocket es demasiado complejo, puedes usar **polling simple**:

```javascript
// En tu componente React
useEffect(() => {
  const interval = setInterval(() => {
    loadMatches(); // Recargar cada 3 segundos
  }, 3000);
  
  return () => clearInterval(interval);
}, []);
```

### Opción 2: Usar WSGI en lugar de ASGI para HTTP

En `settings.py`, comenta temporalmente:
```python
# ASGI_APPLICATION = 'your_project.asgi.application'
```

Y corre con:
```bash
python manage.py runserver
```

Esto usará WSGI (síncrono) y no tendrás el error. Pero NO tendrás WebSockets.

### Opción 3: Separar servidores

- Servidor 1 (puerto 8000): Django REST API con WSGI
- Servidor 2 (puerto 8001): Django Channels con ASGI solo para WebSocket

## 📝 RESUMEN DE ARCHIVOS A ACTUALIZAR

1. ✅ `asgi.py` → Usar `asgi_fixed.py`
2. ✅ `views.py` → Usar `views_fixed.py`
3. ✅ `settings.py` → Agregar configuración de Channels
4. ✅ Mantener `consumers.py`, `routing.py`, `websocket_notifier.py`

## 🎯 RESULTADO ESPERADO

Después de estos cambios:
- ✅ Las peticiones HTTP responden rápido
- ✅ No hay errores de "took too long to shut down"
- ✅ WebSockets funcionan correctamente
- ✅ Actualizaciones en tiempo real funcionan
