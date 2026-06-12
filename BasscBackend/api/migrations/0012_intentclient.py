# Generated manually - IntentClient (Get Start lead / try-out form)

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_classsession'),
    ]

    operations = [
        migrations.CreateModel(
            name='IntentClient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('grade', models.CharField(blank=True, max_length=100, verbose_name='等级')),
                ('student_name', models.CharField(max_length=200, verbose_name='学员姓名')),
                ('age', models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='年龄')),
                ('phone', models.CharField(blank=True, max_length=50, verbose_name='电话')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='Email')),
                ('zipcode', models.CharField(blank=True, max_length=20, verbose_name='Zipcode')),
                ('status', models.CharField(
                    choices=[
                        ('Asked', 'Asked'),
                        ('talked', 'talked'),
                        ('Tried', 'Tried'),
                        ('admit', 'admit'),
                        ('quited', 'quited'),
                    ],
                    default='Asked',
                    max_length=20,
                    verbose_name='状态',
                )),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='提交时间')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
            ],
            options={
                'verbose_name': '意向客户',
                'verbose_name_plural': '意向客户',
                'ordering': ['-created_at'],
            },
        ),
    ]
