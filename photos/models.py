# photos/models.py

from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from albums.models import Album

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Photo(models.Model):
    photo_id = models.AutoField(primary_key=True)

    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    original_img = models.ImageField(upload_to="photos/originals/")
    thumbnail_img = models.ImageField(upload_to="photos/thumbnails/")
    watermark_img = models.ImageField(upload_to="photos/watermarks/")

  
    tags = models.ManyToManyField(Tag, blank=True, related_name="photos")

 
    users_tagged = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        blank=True,
        related_name="tagged_photos"
    )

    capture_at = models.DateTimeField(null=True, blank=True)
    # metadata = models.JSONField(default=dict, blank=True)  will do json later
    metadata = models.CharField()
