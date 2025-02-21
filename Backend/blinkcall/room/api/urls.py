from django.urls import path
from .views import RoomCreateView, RoomListView


urlpatterns = [
    path('create-room/', RoomCreateView.as_view(), name='create-room'),
    path('fetch-rooms/', RoomListView.as_view(), name='room-list'),
    ]