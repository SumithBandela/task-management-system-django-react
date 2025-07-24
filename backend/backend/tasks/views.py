from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer,TaskSerailizer
from .models import Task
from rest_framework import status,permissions
from .permissions import is_office_hours , IsAdminOrOwner
from django.contrib.auth import authenticate,get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.


class RegisterUserView(APIView):
    
    def post(self,request):
        serializer = UserSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'User registered successfully'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user:

            refresh = RefreshToken.for_user(user)
            
            access_token = refresh.access_token
            access_token['role'] = user.role  
            
            return Response({
                "access": str(access_token), 
                "refresh": str(refresh), 
            }, status=status.HTTP_200_OK)
        
        return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)


class TaskListView(APIView):
    permission_classes = [IsAdminOrOwner]
    def get(self,request):
        task = Task.objects.all() if request.user.role == 'admin' else Task.objects.filter(created_by = request.user)
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        serializer = TaskSerailizer(task,many = True)
        return Response(serializer.data)
    
    def post(self,request):
        if not is_office_hours():
            return Response({'detail':'Cant add task after office hours'},status=status.HTTP_405_METHOD_NOT_ALLOWD)
        serializer = TaskSerailizer(data = request.data)
        if serializer.is_valid():
            serializer.save(created_by = request.user)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status= status.HTTP_400_BAD_REQUEST)

class TaskDetailView(APIView):
    permission_classes = [IsAdminOrOwner]
    
    def get_object(self,pk):
        try:
            return Task.objects.get(pk = pk)
        except Task.DoesNotExist:
            return None


    def get(self,request,pk):
        task = self.get_object(pk)
        if not task:
            return Response({'detail':'task not found'},status=status.HTTP_404_NOT_FOUND)
        
        serializer = TaskSerailizer(task)
        return Response(serializer.data)
    
    def put(self,request,pk):
        if not is_office_hours():
            return Response({'detail':'Cant update after office hours'},status=status.HTTP_403_FORBIDDEN)
        task = self.get_object(pk)
        if not task:
            return Response({'detail':'task not found'},status=status.HTTP_404_NOT_FOUND)
        self.check_object_permissions(request,task)
        serializer =  TaskSerailizer(task ,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,pk):
        if not is_office_hours():
            return Response({'detail':'Cant delete after office hours'},status=status.HTTP_403_FORBIDDEN)
        task = self.get_object(pk)
        if not task:
            return Response({'detail':'task not found'},status= status.HTTP_404_NOT_FOUND)
        self.check_object_permissions(request,task)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
 

class UserListView(APIView):

    def get(self,request):
        User = get_user_model()
        user = User.objects.filter(role='user')  
        serializer = UserSerializer(user,many=True)
        return Response(serializer.data)
    
