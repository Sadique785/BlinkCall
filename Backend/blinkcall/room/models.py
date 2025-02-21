from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

# Create your models here.


class Room(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_rooms')
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    active_participants = models.IntegerField(default=0)


    def decrease_participants(self):
        """Safely decrease participant count"""
        self.active_participants = max(0, self.active_participants - 1)
        if self.active_participants == 0:
            self.is_active = False
        self.save()

    def increase_participants(self):
        """Safely increase participant count"""
        self.active_participants += 1
        self.is_active = True
        self.save()

        
    def __str__(self):
        return self.name

class RoomParticipant(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='room_participations')
    joined_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True, blank=True)
    time_spent = models.DurationField(default=timezone.timedelta(seconds=0))

    def save(self, *args, **kwargs):
        if self.left_at:
            self.time_spent = self.left_at - self.joined_at
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} in {self.room.name}"