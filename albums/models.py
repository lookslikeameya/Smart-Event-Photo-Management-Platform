from django.db import models
from django.conf import settings

class Album(models.Model):
    album_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_albums"
    )
    coordinators = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="coordinated_albums",
        blank=True
    )


    start_date = models.DateField(null=True, blank=True)
    qr_code_url = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):
        return self.title
