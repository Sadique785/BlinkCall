from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from room.models import Room
from .serializers import RoomSerializer
from rest_framework.permissions import IsAuthenticated

class RoomCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RoomSerializer(data=request.data)
        if serializer.is_valid():
            room = serializer.save(created_by=request.user)  # Set created_by automatically
            return Response({
                'room_id': str(room.id),
                'name': room.name,
                'description': room.description,
                'created_by': room.created_by.username
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoomListView(APIView):
    def get(self, request):
        # Only get active rooms
        rooms = Room.objects.filter(is_active=True)
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)