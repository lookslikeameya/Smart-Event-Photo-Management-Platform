from rest_framework import serializers
from .models import Album

class AlbumSerializer(serializers.ModelSerializer):
    creator = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Album
        fields = "__all__"
        read_only_fields = ["album_id", "creator"]
