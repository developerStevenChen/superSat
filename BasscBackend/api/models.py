"""
BASSC 速滑俱乐部 - 数据库模型
与前端数据结构对应，图片存链接，所有内容模型均有 is_active 便于上下架。
"""
from django.db import models
from django.utils import timezone


class HomePagePic(models.Model):
    """主页轮播图 - 对应前端 homePagePic"""
    image = models.URLField(max_length=500, verbose_name='图片链接')
    title = models.CharField(max_length=200, verbose_name='标题')
    description = models.CharField(max_length=500, verbose_name='介绍')
    sort_order = models.PositiveIntegerField(default=0, verbose_name='排序')
    is_active = models.BooleanField(default=True, verbose_name='是否启用')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        ordering = ['sort_order']
        verbose_name = '主页轮播图'
        verbose_name_plural = '主页轮播图'

    def __str__(self):
        return self.title


class Board(models.Model):
    """主要介绍板块 - 对应前端 boards"""
    image = models.URLField(max_length=500, verbose_name='板块图片链接')
    title = models.CharField(max_length=100, verbose_name='标题')
    description = models.CharField(max_length=300, verbose_name='简介')
    link = models.CharField(max_length=200, blank=True, verbose_name='跳转链接')
    sort_order = models.PositiveIntegerField(default=0, verbose_name='排序')
    is_active = models.BooleanField(default=True, verbose_name='是否启用')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        ordering = ['sort_order']
        verbose_name = '介绍板块'
        verbose_name_plural = '介绍板块'

    def __str__(self):
        return self.title


class Introduction(models.Model):
    """介绍文章走马灯 - 对应前端 introductions"""
    image = models.URLField(max_length=500, verbose_name='配图链接')
    title = models.CharField(max_length=200, verbose_name='标题')
    text = models.TextField(verbose_name='正文')
    sort_order = models.PositiveIntegerField(default=0, verbose_name='排序')
    is_active = models.BooleanField(default=True, verbose_name='是否启用')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        ordering = ['sort_order']
        verbose_name = '介绍文章'
        verbose_name_plural = '介绍文章'

    def __str__(self):
        return self.title


class Pathway(models.Model):
    """主页 About the Club 下方的 Pathway 卡片 - 一图一段文字"""
    image = models.URLField(max_length=500, blank=True, verbose_name='图片链接')
    text = models.TextField(blank=True, verbose_name='文字')
    sort_order = models.PositiveIntegerField(default=0, verbose_name='排序')
    is_active = models.BooleanField(default=True, verbose_name='是否启用')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        ordering = ['sort_order']
        verbose_name = 'Pathway 卡片'
        verbose_name_plural = 'Pathway 卡片'

    def __str__(self):
        return (self.text[:50] + '…') if self.text and len(self.text) > 50 else (self.text or 'Pathway')


class Event(models.Model):
    """活动/赛事 - 对应前端 events，Dashboard 管理"""
    image = models.URLField(max_length=500, blank=True, verbose_name='照片链接')
    title = models.CharField(max_length=200, verbose_name='标题')
    intro = models.CharField(max_length=200, blank=True, verbose_name='简介（1 行 30 词以内）')
    location = models.CharField(max_length=200, blank=True, verbose_name='地点')
    event_time = models.CharField(max_length=200, blank=True, verbose_name='时间')
    content = models.TextField(blank=True, verbose_name='详细信息（多段多词）')
    sort_order = models.PositiveIntegerField(default=0, verbose_name='排序')
    is_active = models.BooleanField(default=True, verbose_name='是否启用')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        ordering = ['sort_order', '-created_at']
        verbose_name = '活动'
        verbose_name_plural = '活动'

    def __str__(self):
        return self.title


class Award(models.Model):
    """奖项/荣誉 - 对应前端 awards，无地点，仅时间；主图 + 最多 6 张附加图"""
    image = models.URLField(max_length=500, blank=True, verbose_name='主图链接')
    title = models.CharField(max_length=200, verbose_name='标题')
    intro = models.CharField(max_length=200, blank=True, verbose_name='简介（1 行 30 词以内）')
    event_time = models.CharField(max_length=200, blank=True, verbose_name='时间')
    content = models.TextField(blank=True, verbose_name='详细信息（多段多词）')
    image_1 = models.URLField(max_length=500, blank=True, verbose_name='附加图1')
    image_2 = models.URLField(max_length=500, blank=True, verbose_name='附加图2')
    image_3 = models.URLField(max_length=500, blank=True, verbose_name='附加图3')
    image_4 = models.URLField(max_length=500, blank=True, verbose_name='附加图4')
    image_5 = models.URLField(max_length=500, blank=True, verbose_name='附加图5')
    image_6 = models.URLField(max_length=500, blank=True, verbose_name='附加图6')
    sort_order = models.PositiveIntegerField(default=0, verbose_name='排序')
    is_active = models.BooleanField(default=True, verbose_name='是否启用')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        ordering = ['sort_order', '-created_at']
        verbose_name = '奖项'
        verbose_name_plural = '奖项'

    def __str__(self):
        return self.title


class News(models.Model):
    """新闻 - 对应前端 news"""
    title = models.CharField(max_length=200, verbose_name='标题')
    intro = models.CharField(max_length=500, verbose_name='简介')
    content = models.TextField(verbose_name='正文')
    prim_pic = models.URLField(max_length=500, verbose_name='主图链接')
    sort_order = models.PositiveIntegerField(default=0, verbose_name='排序（前端展示顺序，数值小靠前）')
    is_active = models.BooleanField(default=True, verbose_name='是否发布')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='发布时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        ordering = ['sort_order', '-created_at']
        verbose_name = '新闻'
        verbose_name_plural = '新闻'

    def __str__(self):
        return self.title


class NewsImage(models.Model):
    """新闻配图 - 对应 news.images 数组"""
    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField(max_length=500, verbose_name='图片链接')
    sort_order = models.PositiveIntegerField(default=0, verbose_name='排序')
    is_active = models.BooleanField(default=True, verbose_name='是否显示')

    class Meta:
        ordering = ['sort_order']
        verbose_name = '新闻配图'
        verbose_name_plural = '新闻配图'


class Course(models.Model):
    """课程页 - 对应前端 /class/<slug>，如 speedskating, PE-training"""
    slug = models.SlugField(max_length=100, unique=True, verbose_name='URL 片段')
    title = models.CharField(max_length=200, verbose_name='课程标题')
    hero_video_url = models.URLField(max_length=500, blank=True, verbose_name='Hero 视频链接')
    intro_text = models.TextField(blank=True, verbose_name='介绍正文（约300词）')
    image_1 = models.URLField(max_length=500, blank=True, verbose_name='图片1')
    image_2 = models.URLField(max_length=500, blank=True, verbose_name='图片2')
    image_3 = models.URLField(max_length=500, blank=True, verbose_name='图片3')
    image_4 = models.URLField(max_length=500, blank=True, verbose_name='图片4')
    image_5 = models.URLField(max_length=500, blank=True, verbose_name='图片5')
    image_6 = models.URLField(max_length=500, blank=True, verbose_name='图片6')
    sort_order = models.PositiveIntegerField(default=0, verbose_name='排序')
    is_active = models.BooleanField(default=True, verbose_name='是否启用')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        ordering = ['sort_order', 'slug']
        verbose_name = '课程'
        verbose_name_plural = '课程'

    def __str__(self):
        return self.title


class ClassSession(models.Model):
    """上课排期 - 用于日历/课表展示当前开放课程"""
    time = models.CharField(max_length=200, verbose_name='时间')
    location = models.CharField(max_length=200, verbose_name='地点')
    category = models.CharField(max_length=100, verbose_name='种类')
    intro = models.TextField(blank=True, verbose_name='介绍')
    coach = models.CharField(max_length=100, verbose_name='教练')
    is_open = models.BooleanField(default=True, verbose_name='是否开放')
    sort_order = models.PositiveIntegerField(default=0, verbose_name='排序')
    is_active = models.BooleanField(default=True, verbose_name='是否启用')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        ordering = ['sort_order', 'time']
        verbose_name = '上课排期'
        verbose_name_plural = '上课排期'

    def __str__(self):
        return f'{self.time} - {self.category}'


class Athlete(models.Model):
    """运动员 - 对应前端 /athlete 列表"""
    image = models.URLField(max_length=500, blank=True, verbose_name='照片链接')
    name = models.CharField(max_length=100, verbose_name='姓名')
    intro = models.TextField(blank=True, verbose_name='介绍')
    team_level = models.PositiveSmallIntegerField(
        default=1,
        choices=[(1, 'Level 1'), (2, 'Level 2')],
        verbose_name='队伍等级',
    )
    source = models.CharField(max_length=200, blank=True, verbose_name='入队方式/来源')
    sort_order = models.PositiveIntegerField(default=0, verbose_name='排序')
    is_active = models.BooleanField(default=True, verbose_name='是否启用')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        ordering = ['sort_order', 'name']
        verbose_name = '运动员'
        verbose_name_plural = '运动员'

    def __str__(self):
        return self.name


class Coach(models.Model):
    """教练 - 对应前端 /coach 列表（照片、名字、头衔、介绍）"""
    image = models.URLField(max_length=500, blank=True, verbose_name='照片链接')
    name = models.CharField(max_length=100, verbose_name='姓名')
    title = models.CharField(max_length=200, blank=True, verbose_name='头衔 / Title')
    intro = models.TextField(blank=True, verbose_name='介绍')
    sort_order = models.PositiveIntegerField(default=0, verbose_name='排序')
    is_active = models.BooleanField(default=True, verbose_name='是否启用')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        ordering = ['sort_order', 'name']
        verbose_name = '教练'
        verbose_name_plural = '教练'

    def __str__(self):
        return self.name


class NavItem(models.Model):
    """导航项 - 对应前端 navItems"""
    key = models.CharField(max_length=50, unique=True, verbose_name='标识')
    label = models.CharField(max_length=50, verbose_name='显示文字')
    path = models.CharField(max_length=200, verbose_name='路径')
    sort_order = models.PositiveIntegerField(default=0, verbose_name='排序')
    is_active = models.BooleanField(default=True, verbose_name='是否显示')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        ordering = ['sort_order']
        verbose_name = '导航项'
        verbose_name_plural = '导航项'

    def __str__(self):
        return self.label


class IntentClient(models.Model):
    """Get Start 获客 - 试课意向客户"""
    STATUS_CHOICES = [
        ('Asked', 'Asked'),
        ('talked', 'talked'),
        ('Tried', 'Tried'),
        ('admit', 'admit'),
        ('quited', 'quited'),
    ]
    SKATING_GRADE_CHOICES = [
        ('', '--'),
        ('beginner', 'Beginner (0-4 month)'),
        ('intermediate', 'intermediate (4-12month)'),
        ('advance', 'Advance (12 month+)'),
        ('speed_skater', 'Speed Skater (Trained Speed skating 3 month and above)'),
        ('advance_speed_skater', 'Advance Speed skater (Trained speed skating 12month+)'),
    ]
    grade = models.CharField(
        max_length=30,
        blank=True,
        choices=SKATING_GRADE_CHOICES,
        verbose_name='Skating grade',
    )
    student_name = models.CharField(max_length=200, verbose_name='学员姓名')
    age = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name='年龄')
    phone = models.CharField(max_length=50, blank=True, verbose_name='电话')
    email = models.EmailField(max_length=254, blank=True, verbose_name='Email')
    zipcode = models.CharField(max_length=20, blank=True, verbose_name='Zipcode')
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Asked',
        verbose_name='状态',
    )
    created_at = models.DateTimeField(default=timezone.now, verbose_name='提交时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        ordering = ['-created_at']
        verbose_name = '意向客户'
        verbose_name_plural = '意向客户'

    def __str__(self):
        return f'{self.student_name} ({self.status})'


class ContactInfo(models.Model):
    """站点联系信息 - 单条记录，Dashboard 可更新，Contact 页展示"""
    email = models.EmailField(max_length=254, blank=True, verbose_name='Email')
    phone = models.CharField(max_length=50, blank=True, verbose_name='Phone')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        verbose_name = '联系信息'
        verbose_name_plural = '联系信息'

    def __str__(self):
        return self.email or self.phone or 'Contact'
