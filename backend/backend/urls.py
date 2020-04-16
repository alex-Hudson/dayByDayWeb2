
# backend/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers      
from DayByDay import views
from DayByDay.views import FrontendAppView
from rest_framework_jwt.views import obtain_jwt_token
from django.conf.urls import url
from django.conf import settings


router = routers.DefaultRouter()    
router.register(r'readings', views.DayByDayView, 'readings')
        
urlpatterns = [
    path('token-auth/', obtain_jwt_token),
    path('admin', admin.site.urls),    
    path('api/', include(router.urls)),
    path('current_user/', views.current_user),
    path('users/', views.UserList.as_view()),
    path('', FrontendAppView.as_view())
]