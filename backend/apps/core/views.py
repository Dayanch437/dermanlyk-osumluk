from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.db.models import Q
import random

from .models import MedicalHerb
from .serializers import MedicalHerbSerializer
from .pagination import LargeResultsSetPagination


class MedicalHerbViewSet(viewsets.ReadOnlyModelViewSet):
	"""API endpoint for MedicalHerb objects with search and utility actions."""
	queryset = MedicalHerb.objects.filter(is_deleted=False).order_by('name')
	serializer_class = MedicalHerbSerializer
	permission_classes = [AllowAny]  # Allow unrestricted access for frontend integration
	authentication_classes = []  # Disable authentication for these read-only endpoints
	pagination_class = LargeResultsSetPagination  # Use the large pagination for listing all herbs
	
	def get_serializer_context(self):
		"""Add request to serializer context for generating absolute URLs."""
		context = super().get_serializer_context()
		context.update({'request': self.request})
		return context

	@action(detail=False, methods=['get'])
	def search(self, request):
		q = request.query_params.get('q', '').strip()
		page = int(request.query_params.get('page', 1))
		limit = int(request.query_params.get('limit', 50))  # Default to 50 for name-only display

		if not q:
			return Response({'results': [], 'count': 0})

		# First look for exact name matches
		exact_matches = list(self.queryset.filter(name__iexact=q))
		
		# Then look for name-startswith matches
		starts_with_matches = list(self.queryset.filter(name__istartswith=q).exclude(name__iexact=q))
		
		# Then look for other fields matches
		other_matches = list(self.queryset.filter(
			Q(name__icontains=q) |
			Q(name_latin__icontains=q) |
			Q(content__icontains=q)
		).exclude(
			Q(name__iexact=q) | 
			Q(name__istartswith=q)
		))

		# Combine with priority order
		combined_qs = exact_matches + starts_with_matches + other_matches
		
		total = len(combined_qs)
		start = (page - 1) * limit
		end = start + limit
		
		page_herbs = combined_qs[start:end]
		serializer = self.get_serializer(page_herbs, many=True)
		
		return Response({
			'results': serializer.data, 
			'count': total,
			'page': page,
			'pages': (total + limit - 1) // limit  # Ceiling division for total pages
		})

	@action(detail=False, methods=['get'])
	def suggestions(self, request):
		q = request.query_params.get('q', '').strip()
		limit = int(request.query_params.get('limit', 5))
		if not q:
			return Response({'suggestions': []})

		qs = self.queryset.filter(name__icontains=q).values_list('name', flat=True)[:limit]
		return Response({'suggestions': list(qs)})

	@action(detail=False, methods=['get'])
	def popular(self, request):
		limit = int(request.query_params.get('limit', 10))
		qs = self.queryset.order_by('-created_at')[:limit]
		serializer = self.get_serializer(qs, many=True)
		return Response({'words': serializer.data})

	@action(detail=False, methods=['get'])
	def random(self, request):
		ids = list(self.queryset.values_list('id', flat=True))
		if not ids:
			return Response(status=status.HTTP_404_NOT_FOUND)
		pick = random.choice(ids)
		herb = get_object_or_404(self.queryset, id=pick)
		serializer = self.get_serializer(herb)
		return Response(serializer.data)

	@action(detail=False, methods=['get'], url_path='word-of-the-day')
	def word_of_the_day(self, request):
		# For simplicity pick the most recently created herb as word of the day
		herb = self.queryset.order_by('-created_at').first()
		if not herb:
			return Response(status=status.HTTP_404_NOT_FOUND)
		serializer = self.get_serializer(herb)
		return Response(serializer.data)


class GlobalSearchView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		q = request.query_params.get('q', '').strip()
		limit = int(request.query_params.get('limit', 100))  # Default to 100 for name-only display
		page = int(request.query_params.get('page', 1))
		
		if not q:
			return Response({'results': [], 'count': 0})

		queryset = MedicalHerb.objects.filter(is_deleted=False)
		
		# First look for exact name matches
		exact_matches = list(queryset.filter(name__iexact=q))
		
		# Then look for name-startswith matches
		starts_with_matches = list(queryset.filter(name__istartswith=q).exclude(name__iexact=q))
		
		# Then look for other fields matches
		other_matches = list(queryset.filter(
			Q(name__icontains=q) |
			Q(character__icontains=q) |
			Q(usage__icontains=q) |
			Q(natural_source__icontains=q)
		).exclude(
			Q(name__iexact=q) | 
			Q(name__istartswith=q)
		))

		# Combine with priority order
		combined_results = exact_matches + starts_with_matches + other_matches
		
		total = len(combined_results)
		start = (page - 1) * limit
		end = start + limit
		
		page_herbs = combined_results[start:end]
		serializer = MedicalHerbSerializer(page_herbs, many=True, context={'request': request})
		
		return Response({
			'results': serializer.data, 
			'count': total,
			'page': page,
			'pages': (total + limit - 1) // limit  # Ceiling division for total pages
		})
