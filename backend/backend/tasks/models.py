from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):

    ROLE_CHOICES = (
        ('admin','Admin'),
        ('user','User')
    )

    role = models.CharField(max_length = 10, choices = ROLE_CHOICES,default='user')


class Task(models.Model):
    work_summary = models.TextField(null=True)
    date  = models.DateField(null=True)
    hours =  models.IntegerField(null=True)
    created_by = models.ForeignKey(User,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)