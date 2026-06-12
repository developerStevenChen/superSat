from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'homepagepic', views.HomePagePicViewSet, basename='homepagepic')
router.register(r'boards', views.BoardViewSet, basename='board')
router.register(r'introductions', views.IntroductionViewSet, basename='introduction')
router.register(r'pathways', views.PathwayViewSet, basename='pathway')
router.register(r'events', views.EventViewSet, basename='event')
router.register(r'awards', views.AwardViewSet, basename='award')
router.register(r'news', views.NewsViewSet, basename='news')
router.register(r'navitems', views.NavItemViewSet, basename='navitem')
router.register(r'courses', views.CourseViewSet, basename='course')
router.register(r'classes', views.ClassSessionViewSet, basename='classsession')
router.register(r'athletes', views.AthleteViewSet, basename='athlete')
router.register(r'coaches', views.CoachViewSet, basename='coach')
router.register(r'intentclients', views.IntentClientViewSet, basename='intentclient')
router.register(r'contactinfo', views.ContactInfoViewSet, basename='contactinfo')

urlpatterns = [
    path('health/', views.health_check),
    path('homepage/', views.homepage),
    path('courses/by_slug/<slug:slug>/', views.course_by_slug),
    path('auth/login/', views.auth_login),
    path('auth/logout/', views.auth_logout),
    path('auth/me/', views.auth_me),
     # superuser 管理 admin 账号
    path('auth/admins/', views.admin_users),
    path('auth/admins/<int:pk>/deactivate/', views.admin_deactivate),
    path('upload/', views.upload_image),
    path('', include(router.urls)),
]
