from django.urls import path
from .views import EmployeeListCreateView,EmployeeDetailAPIView,EmployeeReactivateView
urlpatterns = [
    path('',EmployeeListCreateView.as_view()),
    path('<int:pk>/',EmployeeDetailAPIView.as_view()),
    path('<int:pk>/reactivate/', EmployeeReactivateView.as_view()),
    path('<int:pk>/deactivate/', EmployeeDetailAPIView.as_view()), 

]