# Generated manually - Award model (no location, time only; main image + 6 extra images)

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_event_location_event_time'),
    ]

    operations = [
        migrations.CreateModel(
            name='Award',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.URLField(blank=True, max_length=500, verbose_name='主图链接')),
                ('title', models.CharField(max_length=200, verbose_name='标题')),
                ('intro', models.CharField(blank=True, max_length=200, verbose_name='简介（1 行 30 词以内）')),
                ('event_time', models.CharField(blank=True, max_length=200, verbose_name='时间')),
                ('content', models.TextField(blank=True, verbose_name='详细信息（多段多词）')),
                ('image_1', models.URLField(blank=True, max_length=500, verbose_name='附加图1')),
                ('image_2', models.URLField(blank=True, max_length=500, verbose_name='附加图2')),
                ('image_3', models.URLField(blank=True, max_length=500, verbose_name='附加图3')),
                ('image_4', models.URLField(blank=True, max_length=500, verbose_name='附加图4')),
                ('image_5', models.URLField(blank=True, max_length=500, verbose_name='附加图5')),
                ('image_6', models.URLField(blank=True, max_length=500, verbose_name='附加图6')),
                ('sort_order', models.PositiveIntegerField(default=0, verbose_name='排序')),
                ('is_active', models.BooleanField(default=True, verbose_name='是否启用')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='创建时间')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
            ],
            options={
                'verbose_name': '奖项',
                'verbose_name_plural': '奖项',
                'ordering': ['sort_order', '-created_at'],
            },
        ),
    ]
