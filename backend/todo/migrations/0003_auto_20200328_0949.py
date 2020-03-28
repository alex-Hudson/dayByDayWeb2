# Generated by Django 3.0.3 on 2020-03-28 09:49

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0002_todo_pub_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='todo',
            name='pub_date',
        ),
        migrations.AddField(
            model_name='todo',
            name='reading_date',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='reading date'),
            preserve_default=False,
        ),
    ]
