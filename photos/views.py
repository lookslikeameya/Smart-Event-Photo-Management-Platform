from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Photo, Tag
from .serializers import PhotoSerializer, TagSerializer

from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsVerified, IsPhotographer,IsAdmin

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all().order_by("-photo_id")
    serializer_class = PhotoSerializer
    
    permission_classes = [IsAuthenticated, IsVerified]
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

    def get_permissions(self):
        if self.request.method == "DELETE":
            return [IsAuthenticated(), IsAdmin()]

        # PHOTOGRAPHER-ONLY UPLOAD
        if self.request.method == "POST":
            return [IsAuthenticated(), IsVerified(), IsPhotographer()]

        return super().get_permissions()    

    #Add tag
    @action(detail=True, methods=["post"])
    def add_tag(self, request, pk=None):
        photo = self.get_object()
        tag_name = request.data.get("tag")
        #checks if tag already exists and then creates
        tag, _ = Tag.objects.get_or_create(name=tag_name)
        photo.tags.add(tag)

        return Response({"message": "Tag added"})

    #Remove tag
    @action(detail=True, methods=["post"])
    def remove_tag(self, request, pk=None):
        photo = self.get_object()
        tag_name = request.data.get("tag")

        try:
            tag = Tag.objects.get(name=tag_name)
            photo.tags.remove(tag)
        except Tag.DoesNotExist:
            return Response({"error": "Tag not found"}, status=400)

        return Response({"message": "Tag removed"})
