from rest_framework import serializers
from .models import Photo, Tag

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]


class PhotoSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.StringRelatedField(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    users_tagged = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Photo
        fields = "__all__"
        read_only_fields = ["photo_id", "uploaded_by"]
