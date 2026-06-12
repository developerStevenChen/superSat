from django.contrib import admin
from .models import HomePagePic, Board, Introduction, News, NewsImage, NavItem, Course, Athlete, Coach, IntentClient, ContactInfo


@admin.register(HomePagePic)
class HomePagePicAdmin(admin.ModelAdmin):
    list_display = ('title', 'sort_order', 'is_active')


@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    list_display = ('title', 'sort_order', 'is_active')


@admin.register(Introduction)
class IntroductionAdmin(admin.ModelAdmin):
    list_display = ('title', 'sort_order', 'is_active')


class NewsImageInline(admin.TabularInline):
    model = NewsImage
    extra = 1


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'is_active')
    inlines = [NewsImageInline]


@admin.register(NavItem)
class NavItemAdmin(admin.ModelAdmin):
    list_display = ('label', 'path', 'sort_order', 'is_active')


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'sort_order', 'is_active')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Athlete)
class AthleteAdmin(admin.ModelAdmin):
    list_display = ('name', 'team_level', 'sort_order', 'is_active')


@admin.register(Coach)
class CoachAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'sort_order', 'is_active')


@admin.register(IntentClient)
class IntentClientAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'grade', 'age', 'phone', 'email', 'zipcode', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('student_name', 'email', 'phone', 'zipcode')


@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ('email', 'phone', 'updated_at')
