from rest_framework import serializers
from .models import Task,User
from django.contrib.auth import get_user_model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id','username','password','role','is_active']
        extra_kwargs = {'password':{'write_only':True}}
    
    def create(self,validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user

class TaskSerailizer(serializers.ModelSerializer):
    created_by = serializers.CharField(source='created_by.username', read_only=True)
    class Meta:
        model = Task 
        fields = '__all__'
        read_only_fields = ['created_by']