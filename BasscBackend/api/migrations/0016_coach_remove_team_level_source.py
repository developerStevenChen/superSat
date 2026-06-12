# Remove team_level and source from Coach (structure: photo, name, title, intro only)

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_coach_title'),
    ]

    operations = [
        migrations.RemoveField(model_name='coach', name='team_level'),
        migrations.RemoveField(model_name='coach', name='source'),
    ]
