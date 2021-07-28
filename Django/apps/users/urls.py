from .views import UserList
from django.urls import path

app_name = "users"

urlpatterns = [
    path('', UserList.as_view(), name='UserList'),
]