# Generated manually for Course model

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_board_created_at_board_updated_at_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=100, unique=True, verbose_name='URL 片段')),
                ('title', models.CharField(max_length=200, verbose_name='课程标题')),
                ('hero_video_url', models.URLField(blank=True, max_length=500, verbose_name='Hero 视频链接')),
                ('intro_text', models.TextField(blank=True, verbose_name='介绍正文（约300词）')),
                ('image_1', models.URLField(blank=True, max_length=500, verbose_name='图片1')),
                ('image_2', models.URLField(blank=True, max_length=500, verbose_name='图片2')),
                ('image_3', models.URLField(blank=True, max_length=500, verbose_name='图片3')),
                ('image_4', models.URLField(blank=True, max_length=500, verbose_name='图片4')),
                ('image_5', models.URLField(blank=True, max_length=500, verbose_name='图片5')),
                ('image_6', models.URLField(blank=True, max_length=500, verbose_name='图片6')),
                ('sort_order', models.PositiveIntegerField(default=0, verbose_name='排序')),
                ('is_active', models.BooleanField(default=True, verbose_name='是否启用')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='创建时间')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
            ],
            options={
                'verbose_name': '课程',
                'verbose_name_plural': '课程',
                'ordering': ['sort_order', 'slug'],
            },
        ),
    ]
