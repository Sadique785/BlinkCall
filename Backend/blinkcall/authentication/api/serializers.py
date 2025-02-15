from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username')



class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password],
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password],
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password')

    def validate(self, attrs):
        # Check if email exists
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "User with this email already exists."})
        
        # Check if username exists
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "User with this username already exists."})
        
        return attrs

    def create(self, validated_data):
        # Create user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        return user
    

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()

        if not email:
            raise serializers.ValidationError({
                'email': 'Email address is required.'
            })
        
        if not password:
            raise serializers.ValidationError({
                'password': 'Password is required.'
            })

        user = User.objects.filter(email=email).first()
        if not user:
            raise serializers.ValidationError({
                'email': 'No account found with this email address.'
            })

        if not user.is_active:
            raise serializers.ValidationError({
                'email': 'This account has been deactivated. Please contact support.'
            })

        user = authenticate(username=email, password=password)
        if user is None:
            raise serializers.ValidationError({
                'password': 'Invalid password. Please try again.'
            })

        data['user'] = user
        return data

