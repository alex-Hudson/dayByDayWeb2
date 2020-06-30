
# DayByDay/views.py

from django.shortcuts import render
from rest_framework import viewsets
from .serializers import DayByDaySerializer, NewsItemSerializer
from .models import Reading, NewsItem
from django.http import HttpResponseRedirect, HttpResponse
# from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
# from .serializers import UserSerializer, UserSerializerWithToken
from django.views.generic import View
from django.conf import settings

import os
import logging
import urllib.request


class DayByDayView(viewsets.ModelViewSet):       
  serializer_class = DayByDaySerializer      

  def get_queryset(self):
    return Reading.objects.all().order_by('-reading_date')


class NewsView(viewsets.ModelViewSet):       
  serializer_class = NewsItemSerializer      

  def get_queryset(self):
    return NewsItem.objects.all().order_by('-news_date')


# @api_view(['GET'])
# def current_user(request):
#     """
#     Determine the current user by their token, and return their data
#     """
    
#     serializer = UserSerializer(request.user)
#     return Response(serializer.data)


# class UserList(APIView):
#     """
#     Create a new user. It's called 'UserList' because normally we'd have a get
#     method here too, for retrieving a list of all User objects.
#     """

#     permission_classes = (permissions.AllowAny,)

#     def post(self, request, format=None):
#         print(request)
#         serializer = UserSerializerWithToken(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FrontendAppView(View):
    """
    Serves the compiled frontend entry point (only works if you have run `yarn
    run build`).
    """
    def get(self, request):
        print (os.path.join(settings.REACT_APP_DIR, 'build', 'index.html'))
        try:
            with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            logging.exception('Production build of app not found')
            return HttpResponse(
                """
                This URL is only used when you have built the production
                version of the app. Visit http://localhost:3000/ instead, or
                run `yarn run build` to test the production version.
                """,
                status=501,
            )