
# todo/models.py
      
from django.db import models
# Create your models here.

# add this
class Todo(models.Model):
  title = models.CharField(max_length=120)
  description = models.TextField()
  completed = models.BooleanField(default=False)
  reading_date = models.DateTimeField('reading date')
      
  def __str__(self):
    return self.title
    
  def is_todays_reading(self):
        now = timezone.now()
        return now - datetime.timedelta(days=1) == self.reading_date <= now
  
  is_todays_reading.admin_order_field = 'reading_date'
  is_todays_reading.boolean = True
  is_todays_reading.short_description = 'Todays reading?'