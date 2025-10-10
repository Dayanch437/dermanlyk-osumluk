from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='medicalherb',
            name='photo',
            field=models.ImageField(blank=True, help_text='Photo of the medical herb', null=True, upload_to='herbs/'),
        ),
    ]