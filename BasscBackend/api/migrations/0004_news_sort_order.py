# Generated manually - add sort_order to News

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_add_course'),
    ]

    operations = [
        migrations.AddField(
            model_name='news',
            name='sort_order',
            field=models.PositiveIntegerField(default=0, verbose_name='排序（前端展示顺序，数值小靠前）'),
        ),
    ]
