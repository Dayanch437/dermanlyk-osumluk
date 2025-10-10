from django.contrib import admin
from .models import MedicalHerb
# Register your models here.
admin.site.register(MedicalHerb)
admin.site.site_header = "Dermanlyk Admin"
admin.site.site_title = "Dermanlyk Admin Portal"
admin.site.index_title = "Welcome to Dermanlyk Admin Portal"
