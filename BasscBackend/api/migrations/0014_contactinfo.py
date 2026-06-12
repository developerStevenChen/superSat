# ContactInfo - site contact email/phone (singleton, manageable in dashboard)

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_intentclient_skating_grade'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContactInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='Email')),
                ('phone', models.CharField(blank=True, max_length=50, verbose_name='Phone')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='更新时间')),
            ],
            options={
                'verbose_name': '联系信息',
                'verbose_name_plural': '联系信息',
            },
        ),
    ]
