# Try out form: student_name -> name, grade -> gender

from django.db import migrations, models


def clear_old_grade_values(apps, schema_editor):
    IntentClient = apps.get_model('api', 'IntentClient')
    IntentClient.objects.all().update(grade='')


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_coach_remove_team_level_source'),
    ]

    operations = [
        migrations.RunPython(clear_old_grade_values, migrations.RunPython.noop),
        migrations.RenameField(
            model_name='intentclient',
            old_name='student_name',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='intentclient',
            old_name='grade',
            new_name='gender',
        ),
        migrations.AlterField(
            model_name='intentclient',
            name='gender',
            field=models.CharField(
                blank=True,
                choices=[
                    ('', '--'),
                    ('male', 'Male'),
                    ('female', 'Female'),
                    ('other', 'Other'),
                    ('prefer_not_to_say', 'Prefer not to say'),
                ],
                max_length=30,
                verbose_name='Gender',
            ),
        ),
        migrations.AlterField(
            model_name='intentclient',
            name='name',
            field=models.CharField(max_length=200, verbose_name='Name'),
        ),
    ]
