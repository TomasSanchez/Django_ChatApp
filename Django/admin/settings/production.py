from .base import *  # noqa
from .base import env

env.read_env(str(BASE_DIR / ".env.production"))

DEBUG = False

SECRET_KEY = env.str("SECRET_KEY")

# TODO Set list on env file
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=["0.0.0.0"])

# TODO
"""
Configure databases

Conf static and media files to work with nginx

Conf asgi to work with channels 

Conf Celery

Conf Redis

Conf All Auth
"""

