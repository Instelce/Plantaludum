from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if obj.user:
            return obj.user == request.user
        if obj.deck:
            return obj.deck.user == request.user
        if obj.identification:
            return obj.identification.user == request.user

        return False
