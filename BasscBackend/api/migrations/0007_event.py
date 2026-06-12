# Generated manually - Event model

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_athlete_coach'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.URLField(blank=True, max_length=500, verbose_name='照片链接')),
                ('title', models.CharField(max_length=200, verbose_name='标题')),
                ('intro', models.CharField(blank=True, max_length=200, verbose_name='简介（1 行 30 词以内）')),
                ('content', models.TextField(blank=True, verbose_name='详细信息（多段多词）')),
                ('sort_order', models.PositiveIntegerField(default=0, verbose_name='排序')),
                ('is_active', models.BooleanField(default=True, verbose_name='是否启用')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='创建时间')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
            ],
            options={
                'verbose_name': '活动',
                'verbose_name_plural': '活动',
                'ordering': ['sort_order', '-created_at'],
            },
        ),
    ]
