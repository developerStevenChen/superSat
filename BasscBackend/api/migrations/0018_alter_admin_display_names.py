# Admin display names: Program, Activity Schedule, Share

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_intentclient_name_gender'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='athlete',
            options={'ordering': ['sort_order', 'name'], 'verbose_name': 'Share', 'verbose_name_plural': 'Shares'},
        ),
        migrations.AlterModelOptions(
            name='classsession',
            options={
                'ordering': ['sort_order', 'time'],
                'verbose_name': 'Activity Schedule',
                'verbose_name_plural': 'Activity Schedules',
            },
        ),
        migrations.AlterModelOptions(
            name='course',
            options={'ordering': ['sort_order', 'slug'], 'verbose_name': 'Program', 'verbose_name_plural': 'Programs'},
        ),
    ]
