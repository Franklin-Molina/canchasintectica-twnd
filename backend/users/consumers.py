import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from urllib.parse import parse_qs

User = get_user_model()

class UserConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_string = self.scope['query_string'].decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [None])[0]

        if not token:
            await self.close()
            return

        try:
            UntypedToken(token)
            self.room_group_name = 'users_admin'
            
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            await self.accept()
         #   print(f"✅ Users WebSocket connected: {self.channel_name}")
            
        except (InvalidToken, TokenError) as e:
            print(f"❌ Users WebSocket invalid token: {e}")
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        print(f"🔌 Users WebSocket disconnected: {self.channel_name}")

    async def user_updated(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_updated',
            'user': event['user']
        }))

    async def user_created(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_created',
            'user': event['user']
        }))

    async def user_deleted(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_deleted',
            'user_id': event['user_id']
        }))
