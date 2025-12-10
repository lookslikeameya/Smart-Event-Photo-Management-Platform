from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Album
from .serializers import AlbumSerializer
from accounts.permissions import IsVerified, IsCoordinator, IsAdmin


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all().order_by("-album_id")
    serializer_class = AlbumSerializer

    # DEFAULT: only authenticated + verified users can access
    permission_classes = [IsAuthenticated, IsVerified]

    # ADMIN-ONLY DELETE
    # COORDINATOR-ONLY CREATE & UPDATE
    def get_permissions(self):
        if self.request.method == "DELETE":
            return [IsAuthenticated(), IsAdmin()]

        if self.request.method in ["POST", "PUT", "PATCH"]:
            return [IsAuthenticated(), IsVerified(), IsCoordinator()]

        return super().get_permissions()
