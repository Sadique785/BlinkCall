# rooms/serializers.py
from rest_framework import serializers
from room.models import Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'description', 'created_at', 'is_active']
        read_only_fields = ['created_by']  # Ensure it's not required from the frontend
