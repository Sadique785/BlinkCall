from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from urllib.parse import parse_qs
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken



class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope.get('query_string', b'').decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [None])[0]
        print('Token from ws middleware ', token)


        if not token:
            print("No token provided")
            scope['error'] = 'No authorization token provided'
            return await super().__call__(scope, receive, send)

        # Validate token and get user
        user_data = await self.get_user_from_token(token)
        if not user_data:
            print("Invalid token")
            scope['error'] = 'Invalid or expired token'
            return await super().__call__(scope, receive, send)

        # Add user data to scope
        scope['user_id'] = user_data['user_id']
        scope['user'] = user_data['user']

        return await super().__call__(scope, receive, send)

        
    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            User = get_user_model()
            user = User.objects.get(id=user_id)
            return {
                'user_id': user_id,
                'user': user
            }
        except TokenError:
            print("Token has expired")
            return None
        except InvalidToken:
            print("Token is invalid")
            return None
        except Exception as e:
            print(f"Other error: {str(e)}")
            return None

    async def close_connection(self, send, message):
        # First send a rejection message
        await send({
            "type": "websocket.reject",
            "code": 4003,
            "text": message
        })
        
        # Optional: Log the rejection
        print(f"Rejecting connection: code={4003}, message={message}")
        
        return None  # This ensures the middleware chain stops here