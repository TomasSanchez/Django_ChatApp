import os
from .base import *  # noqa
from .base import env

env.read_env(str(BASE_DIR / ".env.production"))

DEBUG = False

SECRET_KEY = env.str("SECRET_KEY")

# TODO Set list on env file
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=["*"])


CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [env.str('REDIS_URL', 'redis://localhost:6379')],
        },
    },
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env.str('DB_NAME'),
        'USER': env.str('DB_USER'),
        'PASSWORD': env.str('DB_PASS'),
        'HOST': env.str('DB_HOST'),
        'PORT': env.int('DB_PORT', 5432)
    }
}

# Conf static and media files to work with nginx
STATIC_URL = '/django_static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'django_static_files')
# STATIC_ROOT = str(BASE_DIR / "django_static_files")

