from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicalHerbViewSet

router = DefaultRouter()
router.register(r'words', MedicalHerbViewSet, basename='words')

urlpatterns = [
    path('', include(router.urls)),
]
