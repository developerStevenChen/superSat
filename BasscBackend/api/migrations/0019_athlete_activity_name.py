# Shares: team_level -> activity_name (text), remove athlete-only source field

from django.db import migrations, models


def copy_team_level_to_activity_name(apps, schema_editor):
    Athlete = apps.get_model('api', 'Athlete')
    for row in Athlete.objects.all():
        level = getattr(row, 'team_level', None)
        if level == 1:
            row.activity_name = 'Level 1'
        elif level == 2:
            row.activity_name = 'Level 2'
        if row.activity_name:
            row.save(update_fields=['activity_name'])


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_alter_admin_display_names'),
    ]

    operations = [
        migrations.AddField(
            model_name='athlete',
            name='activity_name',
            field=models.CharField(blank=True, max_length=200, verbose_name='活动名称'),
        ),
        migrations.RunPython(copy_team_level_to_activity_name, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name='athlete',
            name='team_level',
        ),
        migrations.RemoveField(
            model_name='athlete',
            name='source',
        ),
        migrations.AlterField(
            model_name='athlete',
            name='name',
            field=models.CharField(max_length=100, verbose_name='名称'),
        ),
    ]
