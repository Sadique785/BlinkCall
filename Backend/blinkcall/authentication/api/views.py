from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import LoginSerializer, UserRegistrationSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.middleware import csrf
from django.contrib.auth import logout
from django.contrib.sessions.models import Session
from rest_framework_simplejwt.views import TokenRefreshView




# Create your views here.

def generate_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegisterView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        
        # First check if the data is valid
        if serializer.is_valid():
            # Only save if data is valid
            user = serializer.save()
            return Response({
                "user": UserSerializer(user).data,
                "message": "User Created Successfully"
            }, status=status.HTTP_201_CREATED)
        
        # Return validation errors if data is invalid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.validated_data['user']
                tokens = generate_tokens(user)  # Assuming this returns a dict with access & refresh tokens
                csrf_token = csrf.get_token(request)

                response_data = {
                    "success": True,
                    "message": "Login successful",
                    "data": {
                        "access": tokens["access"],
                        "username": user.username,
                        "user_id": user.id
                    }
                }

                response = Response(response_data)

                # Set CSRF token in cookie
                response.set_cookie(
                    key='csrftoken',
                    value=csrf_token,
                    httponly=False,
                    samesite='Lax'
                )

                # Set Refresh token as an HTTP-only cookie
                response.set_cookie(
                    key='refresh_token',
                    value=tokens["refresh"],
                    httponly=True,
                    secure=True,  # Set to True in production (only allows HTTPS)
                    samesite='Lax',  # Adjust as per frontend/backend interaction
                    max_age=7 * 24 * 60 * 60  # 7 days expiration (adjust as needed)
                )

                return response
            
            # Handle validation errors
            error_messages = {}
            for field, errors in serializer.errors.items():
                error_messages[field] = errors[0]  # Get the first error message for each field
            
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": error_messages
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Handle unexpected errors
            return Response({
                "success": False,
                "message": "An unexpected error occurred",
                "errors": {
                    "detail": str(e)
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class LogoutView(APIView):
    authentication_classes = []  # Consider using authentication for security
    permission_classes = []      # Consider using permission for security

    def post(self, request):
        try:
            # Get refresh token from cookies instead of headers
            refresh_token = request.COOKIES.get('refresh_token')
            if refresh_token:
                try:
                    token = RefreshToken(refresh_token)
                    token.blacklist()
                except TokenError:
                    pass  # Continue even if token is invalid or expired

            # Django logout to clear session
            logout(request)

            # Delete session if it exists
            session_key = request.session.session_key
            if session_key:
                try:
                    Session.objects.get(session_key=session_key).delete()
                except Session.DoesNotExist:
                    pass

            # Prepare response and delete cookies
            response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

            # Delete CSRF token cookie
            response.delete_cookie('csrftoken', path='/')

            # Delete session ID cookie
            response.delete_cookie('sessionid', path='/')

            # Delete refresh token cookie
            response.delete_cookie('refresh_token', path='/')

            return response

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class CustomTokenRefreshView(TokenRefreshView):

    
    def post(self, request, *args, **kwargs):
        # Try to get refresh token from header first
        refresh_token = request.headers.get('X-Refresh-Token')
        print('Refresh from the header', refresh_token)
        
        # If not in header, try cookies
        if not refresh_token:

            refresh_token = request.COOKIES.get('refresh_token')
            print('Refresh from the cookie', refresh_token)
            
        if not refresh_token:
            print('Cant find any refresh token')
            return Response(
                {"error": "Refresh token is missing"},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        try:
            # Verify the refresh token
            refresh = RefreshToken(refresh_token)
            
            # Verify token type
            token_data = refresh.payload
            if token_data.get('token_type') != 'refresh':
                return Response(
                    {"error": "Invalid token type"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Add refresh token to request data for parent class
            request.data['refresh'] = refresh_token
            
            # Get new access token
            response = super().post(request, *args, **kwargs)
            
            return response
            
        except TokenError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response(
                {"error": "Invalid refresh token"},
                status=status.HTTP_401_UNAUTHORIZED
            )


class TestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print('Authenticated', request.user)

        return Response({'message': 'Its working', 'username':request.user.username }, status=status.HTTP_200_OK)
