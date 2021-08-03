from .base import * #noqa
from .base import env

DEBUG = True

SECRET_KEY = env.str('SECRET_KEY', default='django-insecure-)udk^l*hobneqn5-fm@k7@cukxhq7a%#_(0fsmpzjb%%)=@=$z')

ALLOWED_HOSTS = ["localhost", "0.0.0.0", "127.0.0.1"]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "http://172.18.0.3:3000",
    "http://localhost:3000",
    "http://172.*.*.*:3000",
]

CORS_ALLOW_HEADERS = ['content-disposition', 'accept-encoding',
                      'content-type', 'accept', 'origin', 'authorization', 'credentials', 'X-CSRFToken']

CORS_ALLOW_CREDENTIALS = True

CORS_EXPOSE_HEADERS = ["Content-Type", "X_CSRFToken"]
