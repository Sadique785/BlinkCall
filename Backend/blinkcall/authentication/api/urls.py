from django.urls import path
from rest_framework_simplejwt.views import   TokenObtainPairView
from .views import RegisterView, LoginView, LogoutView, CustomTokenRefreshView, TestView


urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('test-auth/',TestView.as_view(), name='test-auth'),

    ]