from django.shortcuts import render

# Create your views here.



"""


Group1 = GroupChat.objects.first()
Group1.members.add(Obby)
Group1.members.values()
<QuerySet [
    {'id': 1, 'password': 'pbkdf2_sha256$260000$jHh4JSxyB3XmOwviLuCuXh$MV3rKe59OPuzX+laKrXNopDUCTknheSufat0p6aSfk8=', 'last_login': datetime.datetime(2021, 7, 30, 19, 42, 24, 381126, tzinfo=<UTC>), 
'is_superuser': True, 'email': 't@t.com', 'user_name': 'Tomas', 'first_name': 'Tomas', 'last_name': 'Sanchez', 'start_date': datetime.datetime(2021, 7, 28, 22, 7, 31, 245467, tzinfo=<UTC>), 'about': None, 
'is_staff': True, 'is_active': True},
 {'id': 2, 'password': '', 'last_login': None, 'is_superuser': False, 'email': 'o@o.com', 'user_name': 'obby', 'first_name': 'obby', 'last_name': 'obby', 'start_date': 
datetime.datetime(2021, 7, 30, 19, 52, 40, 785711, tzinfo=<UTC>), 'about': None, 'is_staff': False, 'is_active': True}
]>


>>> Group1.group_chat_message.values()
<QuerySet [{'id': 1, 'author_id': 1, 'created_at': datetime.time(19, 49, 46, 161604), 'content': 'First!', 'chat_group_id': 1, 'chat_private_id': None}]>
>>> 


"""