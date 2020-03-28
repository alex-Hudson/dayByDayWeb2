
# todo/admin.py
    
from django.contrib import admin
from .models import Todo # add this
    
class TodoAdmin(admin.ModelAdmin):  # add this
  list_display = ('title', 'bible_text', 'question_text', 'prayer_text', 'completed', 'reading_date') # add this
        
# Register your models here.
admin.site.register(Todo, TodoAdmin) # add this