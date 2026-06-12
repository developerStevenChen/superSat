# Coach entity: add title field (photo, name, title, intro)

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_contactinfo'),
    ]

    operations = [
        migrations.AddField(
            model_name='coach',
            name='title',
            field=models.CharField(blank=True, max_length=200, verbose_name='头衔 / Title'),
        ),
    ]
