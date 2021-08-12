import json

from rest_framework.serializers import Serializer

from .models import User
from .serializers import UserSerializer

from django.http import JsonResponse
from django.db.models.query import QuerySet
from django.middleware.csrf import get_token
from django.views.decorators.http import require_POST
from django.contrib.auth import authenticate, login, logout

from rest_framework import filters, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated


class CreateUser(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        reg_serializer = UserSerializer(data=request.data)
        if reg_serializer.is_valid():
            new_user = reg_serializer.save()
            if new_user:
                return Response({'detail': 'User Created'}, status=status.HTTP_201_CREATED)
        return Response(reg_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def get_csrf(request):
    response = JsonResponse({"Info": "Success - Set CSRF cookie"})
    response["X-CSRFToken"] = get_token(request)
    return response


@require_POST
def login_view(request):

    data = json.loads(request.body)
    email = data.get("email")
    password = data.get("password")

    if email is None or password is None:
        return JsonResponse(
            {"errors": {"__all__": "Please enter both username and password"}},
            status=400,
        )
    user = authenticate(email=email, password=password)
    if user is not None:
        login(request=request,user=user, backend='django.contrib.auth.backends.ModelBackend')
        return JsonResponse({"detail": "User logged in successfully"})
    return JsonResponse({"detail": "Invalid credentials"}, status=400)


@require_POST
def logout_view(request):
    logout(request)
    return JsonResponse({"detail": "Logout Successful"})


#returns all users
class UserList(generics.ListAPIView):
    permission_classes=[AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer


# returns the profile of the current authenticated user
class LoggedInUserDetail(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
       
        assert self.queryset is not None, (
            "'%s' should either include a `queryset` attribute, "
            "or override the `get_queryset()` method."
            % self.__class__.__name__
        )
        user = self.request.user
        queryset = self.queryset
        if isinstance(queryset, QuerySet):
            # Ensure queryset is re-evaluated on each request.
            queryset = queryset.filter(id=user.id)
        return queryset


# Returns a single
class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# for checking if user is loged in
class WhoAmI(APIView):
    permission_classes = [AllowAny]

    @staticmethod
    def get(request, format=None):
        if request.user.is_authenticated:
            user = request.user
            serializer = UserSerializer(user)
            serializer.data['authenticated'] = 1
            return Response({'detail':'LoggedIn','user':serializer.data})
        return Response({'detail':'AnonymousUser'})
