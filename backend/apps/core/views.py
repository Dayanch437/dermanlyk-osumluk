from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
import random

from .models import MedicalHerb
from .serializers import MedicalHerbSerializer
from rest_framework.permissions import AllowAny


class MedicalHerbViewSet(viewsets.ReadOnlyModelViewSet):
	"""API endpoint for MedicalHerb objects with search and utility actions."""
	queryset = MedicalHerb.objects.filter(is_deleted=False).order_by('name')
	serializer_class = MedicalHerbSerializer
	permission_classes = [AllowAny]  # Allow unrestricted access for frontend integration
	authentication_classes = []  # Disable authentication for these read-only endpoints
	
	def get_serializer_context(self):
		"""Add request to serializer context for generating absolute URLs."""
		context = super().get_serializer_context()
		context.update({'request': self.request})
		return context

	@action(detail=False, methods=['get'])
	def search(self, request):
		q = request.query_params.get('q', '').strip()
		page = int(request.query_params.get('page', 1))
		limit = int(request.query_params.get('limit', 10))

		if not q:
			return Response({'results': [], 'count': 0})

		qs = self.queryset.filter(
			Q(name__icontains=q) |
			Q(character__icontains=q) |
			Q(usage__icontains=q) |
			Q(natural_source__icontains=q)
		)

		total = qs.count()
		start = (page - 1) * limit
		end = start + limit
		serializer = self.get_serializer(qs[start:end], many=True)
		return Response({'results': serializer.data, 'count': total})

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


from rest_framework.views import APIView


class GlobalSearchView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		q = request.query_params.get('q', '').strip()
		limit = int(request.query_params.get('limit', 20))
		if not q:
			return Response({'results': [], 'count': 0})

		qs = MedicalHerb.objects.filter(
			Q(name__icontains=q) |
			Q(character__icontains=q) |
			Q(usage__icontains=q) |
			Q(natural_source__icontains=q)
		).filter(is_deleted=False).order_by('name')[:limit]

		serializer = MedicalHerbSerializer(qs, many=True, context={'request': request})
		return Response({'results': serializer.data, 'count': len(serializer.data)})
