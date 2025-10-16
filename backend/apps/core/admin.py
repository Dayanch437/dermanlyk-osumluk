from django.contrib import admin
from .models import MedicalHerb
from import_export.admin import ImportExportModelAdmin

@admin.register(MedicalHerb)
class MedicalHerbAdmin(ImportExportModelAdmin):
    pass

admin.site.site_header = "Dermanlyk Admin"
admin.site.site_title = "Dermanlyk Admin Portal"
admin.site.index_title = "Welcome to Dermanlyk Admin Portal"
