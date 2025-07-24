from rest_framework.permissions import BasePermission
from datetime import datetime

def  is_office_hours():
    current_hour = datetime.now().hour
    return 9<= current_hour <18


class IsAdminOrOwner(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        if not is_office_hours():
            return request.method in ['GET']
        if request.user.role == 'admin':
            return True
        
        return obj.created_by == request.user and request.method in ['GET','POST']
    
    