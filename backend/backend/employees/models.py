from django.db import models
from tasks.models import User
# Create your models here.


class Employee(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=12,blank=True)
    designation = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name