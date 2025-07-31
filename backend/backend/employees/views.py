from django.shortcuts import render
from .serializers import EmployeeSerializer
from .models import Employee
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from tasks.permissions import IsAdminOrOwner
from rest_framework.permissions import IsAuthenticated
from tasks.models import User
# Create your views here.

class EmployeeListCreateView(APIView):
    permission_classes = [IsAdminOrOwner]

    def get(self, request):
        employees = Employee.objects.all()
        employee_data = []

        for employee in employees:
            user = User.objects.get(id=employee.user_id)
            employee_info = EmployeeSerializer(employee).data
            employee_info['username'] = user.username
            employee_info['is_active'] = user.is_active          
            employee_data.append(employee_info)
        return Response(employee_data)
    
    def post(self,request):
        serializer = EmployeeSerializer(data = request.data)
        if serializer.is_valid():
            employee = serializer.save()
            return Response({
                'message':'Employee created successfully',
                'username':employee.user.username,
                'default_password':f'{employee.name}@123'

            },status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class EmployeeDetailAPIView(APIView):
    permission_classes = [IsAdminOrOwner,IsAuthenticated]

    def get_object(self,pk):
        try:
            return Employee.objects.get(pk=pk)
        except Employee.DoesNotExist:
            return None
    
    def get(self,request,pk):
        employee = self.get_object(pk)
        if not employee:
            return Response({'error':'Employee not found'},status=status.HTTP_404_NOT_FOUND)
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)
    
    def put(self,request,pk):
        employee = self.get_object(pk)
        if not employee:
            return Response({'error','Employee not found'},status=status.HTTP_404_NOT_FOUND)
        serializer = EmployeeSerializer(employee,data = request.data,partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'employee updated successfully'})
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,pk):
        employee = self.get_object(pk)
        if not employee:
            return Response({'error','Employee not found'},status=status.HTTP_404_NOT_FOUND)
        employee.user.is_active = False
        employee.user.save()
        return Response({'message','Employee deactivated successfully'})
    
    def post(self,request,pk):
        employee = self.get_object(pk)
        if not employee:
            return Response({'error':'Employee not found'},status=status.HTTP_404_NOT_FOUND)
        employee.user.is_active = True
        employee.user.save()
        return Response({'message':'Employee reactivated successfully'})