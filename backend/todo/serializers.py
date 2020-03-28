
# todo/serializers.py

from rest_framework import serializers
from .models import Todo
      
class TodoSerializer(serializers.ModelSerializer):
  class Meta:
    model = Todo
    fields = ('id', 'title', 'bible_text', 'question_text', 'prayer_text', 'completed', 'reading_date')