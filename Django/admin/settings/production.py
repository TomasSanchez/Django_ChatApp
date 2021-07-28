from .base import *  # noqa
from .base import env

# https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
SECRET_KEY = env("DJANGO_SECRET_KEY")
# https://docs.djangoproject.com/en/dev/ref/settings/#allowed-hosts
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=["example.com"])

# DATABASES
# ------------------------------------------------------------------------------
# TODO
"""
Configure databases

Conf static and media files to work with nginx

Conf asgi to work with channels 

Conf Celery & Redis
"""

