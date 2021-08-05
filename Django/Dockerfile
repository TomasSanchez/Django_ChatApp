FROM python:3.9

ENV PYTHONUNBUFFERED=0

WORKDIR /backend

COPY requirements /backend/requirements/

RUN pip3 install --no-cache-dir -r requirements/production.txt

COPY . .

# FIX worked before, now it needs to wait for db..
# RUN python manage.py makemigrations && \
#     python manage.py collectstatic --noinput && \
#     python manage.py migrate
    # && \
    #daphne admin.asgi:application