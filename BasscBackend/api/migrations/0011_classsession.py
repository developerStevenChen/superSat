# Generated manually - ClassSession (class schedule sessions)

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_pathway'),
    ]

    operations = [
        migrations.CreateModel(
            name='ClassSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.CharField(max_length=200, verbose_name='时间')),
                ('location', models.CharField(max_length=200, verbose_name='地点')),
                ('category', models.CharField(max_length=100, verbose_name='种类')),
                ('intro', models.TextField(blank=True, verbose_name='介绍')),
                ('coach', models.CharField(max_length=100, verbose_name='教练')),
                ('is_open', models.BooleanField(default=True, verbose_name='是否开放')),
                ('sort_order', models.PositiveIntegerField(default=0, verbose_name='排序')),
                ('is_active', models.BooleanField(default=True, verbose_name='是否启用')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='创建时间')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
            ],
            options={
                'verbose_name': '上课排期',
                'verbose_name_plural': '上课排期',
                'ordering': ['sort_order', 'time'],
            },
        ),
    ]

