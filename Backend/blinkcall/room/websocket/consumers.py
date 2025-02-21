import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from room.models import Room



class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
            print('Got into the connect')
            self.room_id = self.scope['url_route']['kwargs']['room_id']
            self.room_group_name = f'room_{self.room_id}'
            print('Got in here', self.room_id)

            # Get room and increase participants
            room_data = await self.get_room_with_creator()
            if not room_data:
                print(f"Room {self.room_id} not found")
                await self.close(code=4001)
                return
            
            room, creator_id = room_data
            
            if room.active_participants >= 2:
                print(f"Room {self.room_id} is full")
                await self.accept()
                await self.send(json.dumps({
                    'type': 'room_full',
                    'message': 'This room is already full. Maximum capacity is 2 participants.',
                    'room_id': self.room_id
                }))
                await self.close(code=4002)
                return

            await database_sync_to_async(room.increase_participants)()

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            print('Going to connect')
            await self.accept()

            await self.send(json.dumps({
                'type': 'connection_success',
                'message': f'Successfully connected to room {self.room_id}',
                'current_participants': room.active_participants + 1,
                'creator_id': creator_id
            }))
        
            print(f"WebSocket connected: {self.room_id}")

    async def disconnect(self, close_code):
        # Handle different close codes
        if close_code == 4001:
            print(f"Disconnected: Room {self.room_id} not found")
        elif close_code == 4002:
            print(f"Disconnected: Room {self.room_id} was full")
        else:
            room_data = await self.get_room_with_creator()
            if room_data:
                room, _ = room_data  # Unpack the tuple, we only need the room object
                await database_sync_to_async(room.decrease_participants)()
            
            # Remove from room group
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            print(f"WebSocket disconnected: {self.room_id}")
    
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'join_room':
            self.user_id = data.get('user_id')
            room_data = await self.get_room_with_creator()
            if room_data:
                room, creator_id = room_data
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'user_joined',
                        'user_id': self.user_id,
                        'room_id': self.room_id,
                        'creator_id': creator_id
                    }
                )
        elif message_type in ['offer', 'answer', 'ice_candidate']:
            room_data = await self.get_room_with_creator()
            if room_data:
                room, creator_id = room_data
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': message_type,
                        **data,
                        'creator_id': creator_id
                    }
                )
        else:
            print(f"Unknown message type: {message_type}")


    async def user_joined(self, event):
        # Send user_joined message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'user_joined',
            'user_id': event['user_id'],
            'room_id': event['room_id'],
            'creator_id': event['creator_id'],

        }))


    @database_sync_to_async
    def get_room_with_creator(self):
        try:
            room = Room.objects.get(id=self.room_id)
            creator_id = room.created_by.id  # Get creator_id in sync context
            return room, creator_id
        except Room.DoesNotExist:
            return None
        except Exception as e:
            print(f"Error getting room: {e}")
            return None
        



    async def offer(self, event):
        await self.send(text_data=json.dumps({
            **event,
            'type': 'offer'
        }))

    async def answer(self, event):
        await self.send(text_data=json.dumps({
            **event,
            'type': 'answer'
        }))

    async def ice_candidate(self, event):
        await self.send(text_data=json.dumps({
            **event,
            'type': 'ice_candidate'
        }))
        
