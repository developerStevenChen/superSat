# Generated manually - Event location and event_time

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_event'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='location',
            field=models.CharField(blank=True, max_length=200, verbose_name='地点'),
        ),
        migrations.AddField(
            model_name='event',
            name='event_time',
            field=models.CharField(blank=True, max_length=200, verbose_name='时间'),
        ),
    ]
