"""
BASSC 速滑俱乐部 - API 视图
公开 GET 仅返回 is_active=True；POST/PUT/PATCH/DELETE 仅超级用户/管理员。
"""
from django.contrib.auth import authenticate, get_user_model
from rest_framework import viewsets, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import HomePagePic, Board, Introduction, Pathway, Event, Award, News, NavItem, Course, ClassSession, Athlete, Coach, IntentClient, ContactInfo
from .permissions import IsAdminUserOrReadOnly, AllowCreateOrStaffOnly
from .serializers import (
    HomePagePicSerializer,
    BoardSerializer,
    IntroductionSerializer,
    PathwaySerializer,
    EventSerializer,
    AwardSerializer,
    NewsSerializer,
    NavItemSerializer,
    CourseSerializer,
    ClassSessionSerializer,
    AthleteSerializer,
    CoachSerializer,
    IntentClientSerializer,
    ContactInfoSerializer,
)
from .storage_backend import upload_file_to_bucket
from .utils import get_image_url_for_api


def _filter_active(queryset, request):
    """非管理员仅返回 is_active=True 的记录"""
    if request.user and request.user.is_authenticated and request.user.is_staff:
        return queryset
    return queryset.filter(is_active=True)


class HomePagePicViewSet(viewsets.ModelViewSet):
    queryset = HomePagePic.objects.all()
    serializer_class = HomePagePicSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        return _filter_active(HomePagePic.objects.all(), self.request)


class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        return _filter_active(Board.objects.all(), self.request)


class IntroductionViewSet(viewsets.ModelViewSet):
    queryset = Introduction.objects.all()
    serializer_class = IntroductionSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        return _filter_active(Introduction.objects.all(), self.request)


class PathwayViewSet(viewsets.ModelViewSet):
    queryset = Pathway.objects.all()
    serializer_class = PathwaySerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        return _filter_active(Pathway.objects.all(), self.request)


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        return _filter_active(Event.objects.all(), self.request)


class AwardViewSet(viewsets.ModelViewSet):
    queryset = Award.objects.all()
    serializer_class = AwardSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        return _filter_active(Award.objects.all(), self.request)


class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        return _filter_active(News.objects.all(), self.request)


class NavItemViewSet(viewsets.ModelViewSet):
    queryset = NavItem.objects.all()
    serializer_class = NavItemSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        return _filter_active(NavItem.objects.all(), self.request)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    lookup_field = 'id'
    lookup_url_kwarg = 'id'

    def get_queryset(self):
        return _filter_active(Course.objects.all(), self.request)


class ClassSessionViewSet(viewsets.ModelViewSet):
    queryset = ClassSession.objects.all()
    serializer_class = ClassSessionSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        return _filter_active(ClassSession.objects.all(), self.request)


class AthleteViewSet(viewsets.ModelViewSet):
    queryset = Athlete.objects.all()
    serializer_class = AthleteSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        return _filter_active(Athlete.objects.all(), self.request)


class CoachViewSet(viewsets.ModelViewSet):
    queryset = Coach.objects.all()
    serializer_class = CoachSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        return _filter_active(Coach.objects.all(), self.request)


class IntentClientViewSet(viewsets.ModelViewSet):
    """获客意向：POST 公开提交，GET/PATCH/DELETE 仅 admin/super"""
    queryset = IntentClient.objects.all()
    serializer_class = IntentClientSerializer
    permission_classes = [AllowCreateOrStaffOnly]

    def perform_create(self, serializer):
        if self.request.user and self.request.user.is_authenticated and self.request.user.is_staff:
            serializer.save()
        else:
            serializer.save(status='Asked')


class ContactInfoViewSet(viewsets.ModelViewSet):
    """联系信息：GET 公开，PATCH/PUT 仅 admin/super"""
    queryset = ContactInfo.objects.all()
    serializer_class = ContactInfoSerializer
    permission_classes = [IsAdminUserOrReadOnly]


@api_view(['GET'])
@permission_classes([AllowAny])
def course_by_slug(request, slug):
    """公开：按 slug 获取单门课程（仅 is_active=True，或 staff 可见全部）"""
    from django.shortcuts import get_object_or_404
    course = get_object_or_404(Course, slug=slug)
    if not (request.user and request.user.is_authenticated and request.user.is_staff) and not course.is_active:
        return Response(status=404)
    serializer = CourseSerializer(course)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """API 健康检查"""
    return Response({'status': 'ok', 'message': 'BASSC 速滑俱乐部 API 运行正常'})


@api_view(['GET'])
@permission_classes([AllowAny])
def homepage(request):
    """
    一次性返回全部主页素材（仅 is_active=True），供前端直接展示。
    返回字段与前端约定一致：homePagePic, boards, introductions, news, navItems。
    """
    pics = HomePagePic.objects.filter(is_active=True).order_by('sort_order')
    boards_qs = Board.objects.filter(is_active=True).order_by('sort_order')
    intros_qs = Introduction.objects.filter(is_active=True).order_by('sort_order')
    pathway_first = Pathway.objects.filter(is_active=True).order_by('sort_order').first()
    classes_qs = ClassSession.objects.filter(is_active=True, is_open=True).order_by('sort_order', 'time')
    news_qs = News.objects.filter(is_active=True).order_by('sort_order', '-created_at')[:20]
    nav_qs = NavItem.objects.filter(is_active=True).order_by('sort_order')

    # 轮播图：有存储就展示存储的；无图时用默认占位
    home_page_pic = [
        {'id': p.id, 'image': get_image_url_for_api(p.image), 'title': p.title, 'description': p.description}
        for p in pics
    ]
    # board：无素材时用 default
    boards_list = [
        {'id': b.id, 'image': get_image_url_for_api(b.image), 'title': b.title, 'description': b.description, 'link': b.link or ''}
        for b in boards_qs
    ]
    # introductions：无图用 default
    introductions_list = [
        {'id': i.id, 'image': get_image_url_for_api(i.image), 'title': i.title, 'text': i.text}
        for i in intros_qs
    ]
    # classes：仅返回当前开放的上课排期
    classes_list = [
        {
            'id': c.id,
            'time': c.time,
            'location': c.location,
            'category': c.category,
            'intro': c.intro,
            'coach': c.coach,
        }
        for c in classes_qs
    ]
    # news：无主图/无配图时用 default
    news_list = []
    for n in news_qs:
        images = [
            get_image_url_for_api(img.image_url)
            for img in n.images.filter(is_active=True).order_by('sort_order')
        ]
        if not images:
            images = [get_image_url_for_api(None)]  # 无配图时给一个默认图
        news_list.append({
            'id': n.id,
            'primPic': get_image_url_for_api(n.prim_pic),
            'images': images,
            'title': n.title,
            'intro': n.intro,
            'content': n.content,
        })
    nav_items = [
        {'id': n.key, 'label': n.label, 'path': n.path}
        for n in nav_qs
    ]
    pathway_data = None
    if pathway_first:
        pathway_data = {
            'id': pathway_first.id,
            'image': get_image_url_for_api(pathway_first.image),
            'text': pathway_first.text or '',
        }

    return Response({
        'homePagePic': home_page_pic,
        'boards': boards_list,
        'introductions': introductions_list,
        'pathway': pathway_data,
        'classes': classes_list,
        'news': news_list,
        'navItems': nav_items,
    })


# ---------- 认证（Dashboard 登录，Token 方式，无 CSRF） ----------

@api_view(['POST'])
@permission_classes([AllowAny])
def auth_login(request):
    """登录：username, password -> 返回 token，前端请求头带 Authorization: Token <token>"""
    try:
        username = request.data.get('username') or request.POST.get('username')
        password = request.data.get('password') or request.POST.get('password')
        if not username or not password:
            return Response({'error': '需要 username 和 password'}, status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({'error': '用户名或密码错误'}, status=status.HTTP_401_UNAUTHORIZED)
        if not user.is_superuser and not user.is_staff:
            return Response({'error': '仅超级用户或管理员可登录'}, status=status.HTTP_403_FORBIDDEN)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {'id': user.id, 'username': user.username, 'is_superuser': user.is_superuser, 'is_staff': user.is_staff},
        })
    except Exception as e:
        return Response({
            'error': '登录处理异常',
            'detail': '请确认后端已执行 migrate 并已创建超级用户（python manage.py createsuperuser）。',
            'debug': str(e) if __debug__ else None,
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def auth_logout(request):
    """登出：可选删除当前 token（强制下次重新登录）"""
    if hasattr(request, 'auth') and request.auth and getattr(request.auth, 'delete', None):
        request.auth.delete()
    return Response({'detail': 'ok'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def auth_me(request):
    """当前用户，用于判断是否为 superuser 以展示 Dashboard"""
    u = request.user
    return Response({
        'user': {'id': u.id, 'username': u.username, 'is_superuser': u.is_superuser, 'is_staff': u.is_staff},
    })


# ---------- Superuser 管理 admin 账号 ----------


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def admin_users(request):
    """仅 superuser 可用：GET 列出 admin 账号，POST 创建新的 admin 账号。"""
    if not request.user.is_superuser:
        return Response({'error': '需要 superuser 权限'}, status=status.HTTP_403_FORBIDDEN)
    User = get_user_model()

    if request.method == 'GET':
        admins = User.objects.filter(is_staff=True, is_superuser=False).order_by('username')
        data = [
            {'id': u.id, 'username': u.username, 'is_active': u.is_active}
            for u in admins
        ]
        return Response({'admins': data})

    # POST 创建 admin
    username = (request.data.get('username') or '').strip()
    password = request.data.get('password') or ''
    if not username or not password:
        return Response({'error': '需要 username 和 password'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'error': '该用户名已存在'}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(
        username=username,
        password=password,
        is_staff=True,
        is_superuser=False,
        is_active=True,
    )
    return Response(
        {'id': user.id, 'username': user.username, 'is_active': user.is_active},
        status=status.HTTP_201_CREATED,
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_deactivate(request, pk: int):
    """仅 superuser 可用：注销 admin 账号（取消 is_staff 并停用账号）。"""
    if not request.user.is_superuser:
        return Response({'error': '需要 superuser 权限'}, status=status.HTTP_403_FORBIDDEN)
    User = get_user_model()
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': '用户不存在'}, status=status.HTTP_404_NOT_FOUND)
    if user.is_superuser:
        return Response({'error': '不能操作 superuser'}, status=status.HTTP_400_BAD_REQUEST)
    # 注销 admin：取消 staff 身份并停用账号
    user.is_staff = False
    user.is_active = False
    user.save()
    # 让该账号的 token 立即失效
    Token.objects.filter(user=user).delete()
    return Response({'detail': 'ok'})


# ---------- 图片/视频上传（Railway Bucket） ----------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_image(request):
    """上传图片或短视频到 Railway Bucket，仅 staff。body: multipart 字段 image 或 file。视频存到 videos/，图片存到 uploads/。"""
    if not request.user.is_staff:
        return Response({'error': '需要管理员权限'}, status=status.HTTP_403_FORBIDDEN)
    file_obj = request.FILES.get('image') or request.FILES.get('file')
    if not file_obj:
        return Response({'error': '请上传 image 或 file 字段'}, status=status.HTTP_400_BAD_REQUEST)
    content_type = getattr(file_obj, 'content_type', '') or ''
    folder = 'videos' if content_type.startswith('video/') else 'uploads'
    url = upload_file_to_bucket(file_obj, folder=folder)
    if not url:
        return Response({'error': '上传失败或未配置 Bucket'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({'url': url})
