from tasks.models  import User
from rest_framework import serializers 
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id','name','email','phone','designation']
    
    def create(self,validate_data):
        name = validate_data.get('name')
        email = validate_data.get('email')
        default_password = f"{name}@123"

        user = User.objects.create_user(
            username = email ,
            email = email ,
            password = default_password,
            role = 'user'
        )

        employee = Employee.objects.create(user=user,**validate_data)
        return employee 
    
    def update(self,instance,validate_data):
        password = self.validated_data.pop('password',None)
        for attr, value in validate_data.items():
            setattr(instance,attr,value)
        instance.save()
        if password:
            instance.user.set_password(password)
            instance.user.save()

        return instance