from celery import shared_task
from PIL import Image
from django.core.files.base import ContentFile
from io import BytesIO

from .models import Photo

@shared_task
def generate_thumbnail(photo_id):
    photo = Photo.objects.get(photo_id=photo_id)

    img = Image.open(photo.original_img)
    #if we have png or other img type

    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")


    # resize (keep aspect ratio)
    img.thumbnail((300, 300))

    buffer = BytesIO()
    img.save(buffer, format="JPEG")
    buffer.seek(0)

    thumbnail_name = f"thumb_{photo.photo_id}.jpg"

    photo.thumbnail_img.save(
        thumbnail_name,
        ContentFile(buffer.read()),
        save=False
    )

    photo.is_processed = True
    photo.save()
