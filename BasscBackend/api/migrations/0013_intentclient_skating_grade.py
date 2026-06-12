# Skating grade: optional choices, rename from "等级" to "Skating grade"

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_intentclient'),
    ]

    operations = [
        migrations.AlterField(
            model_name='intentclient',
            name='grade',
            field=models.CharField(
                blank=True,
                choices=[
                    ('', '--'),
                    ('beginner', 'Beginner (0-4 month)'),
                    ('intermediate', 'intermediate (4-12month)'),
                    ('advance', 'Advance (12 month+)'),
                    ('speed_skater', 'Speed Skater (Trained Speed skating 3 month and above)'),
                    ('advance_speed_skater', 'Advance Speed skater (Trained speed skating 12month+)'),
                ],
                max_length=30,
                verbose_name='Skating grade',
            ),
        ),
    ]
