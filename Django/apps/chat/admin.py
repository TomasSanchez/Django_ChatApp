from django.contrib import admin
from .models import Message, GroupChat, PrivateChat

# Register your models here.
admin.site.register(Message)
admin.site.register(GroupChat)
admin.site.register(PrivateChat)