from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import User
from rest_framework.permissions import AllowAny
from .serializers import LoginSerializer, UserRegistrationSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.middleware import csrf
from django.contrib.auth import logout

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
                tokens = generate_tokens(user)
                csrf_token = csrf.get_token(request)

                response_data = {
                    "success": True,
                    "message": "Login successful",
                    "data": {
                        "access": tokens["access"],
                        "refresh": tokens["refresh"],
                        "username": user.username,
                        "user_id": user.id
                    }
                }

                response = Response(response_data)
                response.set_cookie(
                    key='csrftoken',
                    value=csrf_token,
                    httponly=False,
                    samesite='Lax'
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
    authentication_classes = []  # You might want to add authentication for security
    permission_classes = []      # You might want to add permissions for security

    def post(self, request):
        try:
            # Get refresh token from headers
            refresh_token = request.headers.get('X-Refresh-Token')
            
            # Blacklist the token if it exists
            if refresh_token:
                try:
                    token = RefreshToken(refresh_token)
                    token.blacklist()
                except TokenError:
                    # Continue even if token is invalid or expired
                    pass

            # Django logout to clear session
            logout(request)

            # Delete the session if it exists
            session_key = request.session.session_key
            if session_key:
                from django.contrib.sessions.models import Session
                try:
                    Session.objects.get(session_key=session_key).delete()
                except Session.DoesNotExist:
                    pass

            # Prepare response and delete cookies
            response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
            
            # Delete CSRF token cookie
            response.delete_cookie(
                key='csrftoken', 
                path='/',
            )

            # Delete session ID cookie
            response.delete_cookie(
                key='sessionid', 
                path='/',
            )

            # If you're using JWT cookies, uncomment these lines
            # response.delete_cookie(key='access_token', path='/')
            # response.delete_cookie(key='refresh_token', path='/')

            return response
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)