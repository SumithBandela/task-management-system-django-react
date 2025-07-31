from django.urls import path
from .views import EmployeeListCreateView,EmployeeDetailAPIView
urlpatterns = [
    path('',EmployeeListCreateView.as_view()),
    path('<int:pk>/',EmployeeDetailAPIView.as_view()),
    path('<int:pk>/reactivate/', EmployeeDetailAPIView.as_view()),
    path('<int:pk>/deactivate/', EmployeeDetailAPIView.as_view()), 

]