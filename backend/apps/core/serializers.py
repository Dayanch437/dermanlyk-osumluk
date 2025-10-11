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
            # Generate URL for large size image (l/herbs/image_name)
            photo_path = str(obj.photo)
            large_photo_path = f"l/{photo_path}"
            
            if request:
                return request.build_absolute_uri(f"{settings.MEDIA_URL}{large_photo_path}")
            return f"{settings.MEDIA_URL}{large_photo_path}"
        return None

