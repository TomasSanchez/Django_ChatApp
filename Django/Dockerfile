FROM python:3.9

ENV PYTHONUNBUFFERED=0
# ENV DEBUG=False
WORKDIR /backend

COPY requirements /backend/requirements/

RUN pip3 install --no-cache-dir -r requirements/production.txt

COPY . .

RUN python manage.py collectstatic --noinput

# Give permissions to file
RUN chmod +x ./wait-for-it.sh

CMD ./wait-for-it.sh db:5432 --strict --timeout=3 -- && python manage.py makemigrations && python manage.py migrate && daphne admin.asgi:application