
# DayByDay/admin.py
    
from django.contrib import admin
from .models import Reading, NewsItem
    
class ReadingAdmin(admin.ModelAdmin):
  list_display = ('title', 'bible_text', 'question_text', 'prayer_text', 'completed', 'reading_date')
  list_filter = ['reading_date']
  ordering = ('-reading_date',)

class NewsItemAdmin(admin.ModelAdmin):
  list_display = ('news_item_text', 'news_date') 

        
# Register your models here.
admin.site.register(Reading, ReadingAdmin)
admin.site.register(NewsItem, NewsItemAdmin)