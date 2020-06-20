# Generated by Django 3.0.5 on 2020-06-19 15:34

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('DayByDay', '0002_newsitem'),
    ]

    operations = [
        migrations.AddField(
            model_name='newsitem',
            name='news_date',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='reading date'),
            preserve_default=False,
        ),
    ]
