# Generated manually - Athlete and Coach models

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_news_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='Athlete',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.URLField(blank=True, max_length=500, verbose_name='照片链接')),
                ('name', models.CharField(max_length=100, verbose_name='姓名')),
                ('intro', models.TextField(blank=True, verbose_name='介绍')),
                ('team_level', models.PositiveSmallIntegerField(choices=[(1, 'Level 1'), (2, 'Level 2')], default=1, verbose_name='队伍等级')),
                ('source', models.CharField(blank=True, max_length=200, verbose_name='入队方式/来源')),
                ('sort_order', models.PositiveIntegerField(default=0, verbose_name='排序')),
                ('is_active', models.BooleanField(default=True, verbose_name='是否启用')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='创建时间')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
            ],
            options={
                'verbose_name': '运动员',
                'verbose_name_plural': '运动员',
                'ordering': ['sort_order', 'name'],
            },
        ),
        migrations.CreateModel(
            name='Coach',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.URLField(blank=True, max_length=500, verbose_name='照片链接')),
                ('name', models.CharField(max_length=100, verbose_name='姓名')),
                ('intro', models.TextField(blank=True, verbose_name='介绍')),
                ('team_level', models.PositiveSmallIntegerField(choices=[(1, 'Level 1'), (2, 'Level 2')], default=1, verbose_name='队伍等级')),
                ('source', models.CharField(blank=True, max_length=200, verbose_name='入队方式/来源')),
                ('sort_order', models.PositiveIntegerField(default=0, verbose_name='排序')),
                ('is_active', models.BooleanField(default=True, verbose_name='是否启用')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='创建时间')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
            ],
            options={
                'verbose_name': '教练',
                'verbose_name_plural': '教练',
                'ordering': ['sort_order', 'name'],
            },
        ),
    ]
