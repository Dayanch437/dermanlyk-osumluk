from .models import MedicalHerb
from rest_framework import serializers
from django.conf import settings


class MedicalHerbSerializer(serializers.ModelSerializer):
    # Include full URL for photo field
    photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicalHerb
        fields = '__all__'
    
    def get_photo_url(self, obj):
        if obj.photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.photo.url)
            return obj.photo.url
        return None

