import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT Auth
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # App APIs
    path('api/', include('users.urls')),
    path('api/', include('categories.urls')),
    path('api/', include('transactions.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Serve the React SPA for all other routes (must be last)
# In production the built dist/index.html is served by Django templates
dist_index = settings.BASE_DIR / 'dist' / 'index.html'
if dist_index.exists():
    urlpatterns += [
        re_path(r'^(?!api/|admin/|static/|media/).*$',
                TemplateView.as_view(template_name='index.html'),
                name='react-app'),
    ]
