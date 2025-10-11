import io
import os
import hashlib
from apps.core.files import File
from django.db import models
from PIL import Image, ImageOps

class AdvanceThumbnailField(models.ImageField):
    sizes = {
        's': (100, 100),
        'm': (300, 300),
        'l': (600, 600),
    }

    def contribute_to_class(self, cls, name, **kwargs):
        super().contribute_to_class(cls, name, **kwargs)
        models.signals.pre_save.connect(self.process_image, sender=cls)
        models.signals.pre_delete.connect(self.delete_images, sender=cls)
        models.signals.pre_save.connect(self.auto_delete_file_on_change, sender=cls)

    def get_hashed_name(self, image_data):
        return hashlib.sha256(image_data).hexdigest() + ".webp"

    def resize_and_save(self, img, size, path):
        img_copy = img.copy()
        img_copy.thumbnail(size, Image.Resampling.LANCZOS)
        webp_io = io.BytesIO()
        img_copy.save(webp_io, format="WEBP")
        webp_io.seek(0)

        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as f:
            f.write(webp_io.read())

    def process_image(self, sender, instance, **kwargs):
        image_field = getattr(instance, self.name)
        if not image_field:
            return

        try:
            image_field.open()
            img = Image.open(image_field)
            img = ImageOps.exif_transpose(img)
            image_field.seek(0)
            original_bytes = image_field.read()
        except Exception:
            return

        hashed_name = self.get_hashed_name(original_bytes)

        upload_subdir = self.upload_to if isinstance(self.upload_to, str) else ''
        from django.conf import settings
        media_root = settings.MEDIA_ROOT

        for size_key, dimensions in self.sizes.items():
            save_dir = os.path.join(media_root, size_key, upload_subdir)
            save_path = os.path.join(save_dir, hashed_name)
            self.resize_and_save(img, dimensions, save_path)

        setattr(instance, self.name, os.path.join(upload_subdir, hashed_name))

    def delete_images(self, sender, instance, **kwargs):
        value = getattr(instance, self.name)
        if not value:
            return
        from django.conf import settings
        media_root = settings.MEDIA_ROOT
        for size_key in self.sizes.keys():
            file_path = os.path.join(media_root, size_key, value.name if hasattr(value, 'name') else str(value))
            if os.path.exists(file_path):
                os.remove(file_path)

    def auto_delete_file_on_change(self, instance, **kwargs):
        if not instance.pk:
            return False
        try:
            old_instance = instance.__class__.objects.get(pk=instance.pk)
            old_file = getattr(old_instance, self.name)
        except instance.__class__.DoesNotExist:
            return False
        new_file = getattr(instance, self.name)
        if old_file and (not new_file or old_file != new_file):
            from django.conf import settings
            media_root = settings.MEDIA_ROOT
            for size_key in self.sizes.keys():
                old_path = os.path.join(media_root, size_key, old_file.name if hasattr(old_file, 'name') else str(old_file))
                if os.path.isfile(old_path):
                    os.remove(old_path)
        return False
