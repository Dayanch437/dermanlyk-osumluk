"""
Custom permissions for the application
"""
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner of the object.
        return obj.owner == request.user


class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to access it.
    """
    
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class IsVerified(permissions.BasePermission):
    """
    Custom permission to only allow verified users.
    """
    
    def has_permission(self, request, view):
        return bool(request.user and 
                   request.user.is_authenticated and 
                   request.user.is_verified)


class IsAdminOrOwner(permissions.BasePermission):
    """
    Custom permission to only allow admin users or owners.
    """
    
    def has_object_permission(self, request, view, obj):
        return bool(request.user.is_staff or obj.owner == request.user)


class ReadOnlyPermission(permissions.BasePermission):
    """
    Custom permission for read-only access.
    """
    
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS