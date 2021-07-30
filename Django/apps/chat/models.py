from enum import unique
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class Message(models.Model):
    
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT, related_name='user_message')
    created_at = models.TimeField(auto_now_add=True)
    content = models.TextField(_('content'))
    chat_group = models.ForeignKey('GroupChat', on_delete=models.CASCADE, blank=True, null=True, related_name='group_chat_message')
    chat_private = models.ForeignKey('PrivateChat', on_delete=models.CASCADE, blank=True, null=True, related_name='private_chat_message')

class GroupChat(models.Model):

    group_name = models.CharField(max_length=100, unique=True)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='group_chat_member')
    created_at = models.TimeField(auto_now_add=True)

    class Meta:     
        ordering = ["-created_at"]

    def __str__(self):
        return self.group_name

class PrivateChat(models.Model):
 
    chat_name = models.CharField(max_length=100, unique=True)
    user1 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='chat_user1')
    user2 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='chat_user2')
    created_at = models.TimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user1', 'user2'],  name="private_unique_members")
        ]

        ordering = ["-created_at"]

    def __str__(self):
        return self.chat_name


