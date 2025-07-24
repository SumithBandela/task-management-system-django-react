from django.urls import path
from .views import TaskListView,TaskDetailView,RegisterUserView,LoginView,UserListView
urlpatterns = [
    path('register/',RegisterUserView.as_view()),
    path('tasks/',TaskListView.as_view()),
    path('tasks/<int:pk>/',TaskDetailView.as_view()),
    path('login/',LoginView.as_view()),
    path('users/',UserListView.as_view())
]