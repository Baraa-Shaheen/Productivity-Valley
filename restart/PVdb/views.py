from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from .serializer import *
from rest_framework.response import Response
from rest_framework import status
from django.db.models import F
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from datetime import timedelta
from django.http import JsonResponse

@csrf_exempt 

class PomodoroStatsView(APIView):
    def get(self, request, username):
        # Get today's date and the date 6 days ago to cover a week
        today = timezone.now().date()
        week_ago = today - timedelta(days=6)

        # Filter UserDates records for the given user and date range
        data = UserDates.objects.filter(
            username__username=username,
            date__range=[week_ago, today]
        ).annotate(
            date=TruncDay('date')
        ).values(
            'date'
        ).annotate(
            total_time_spent=Sum('timeSpent')  # Sum the time spent on each day
        ).order_by(
            'date'
        )

        # Convert QuerySet to a list of dictionaries
        response_data = [
            {'date': record['date'].strftime('%Y-%m-%d'), 'timeSpent': record['total_time_spent']}
            for record in data
        ]
        # pseudo data
        # data = [
        #     {'date': '2024-04-01', 'timeSpent': 120},
        #     {'date': '2024-04-02', 'timeSpent': 150},
        #     {'date': '2024-04-03', 'timeSpent': 90},
        #
        # ]
        # response_data = data
        return JsonResponse(response_data, safe=False)

class UsersView(APIView):
    def get(self, request):
        output = [{"firstName":output.firstName,
                  "lastName":output.lastName,
                  "username":output.username,
                  "email":output.email,
                  "money":output.money,
                  "houseStatus":output.houseStatus}
                  for output in Users.objects.all()]
        return Response(output)
    def post (self, request):
        serializer = UsersSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
    def delete(self, request):
        username = request.data.get('username', None)
        if username is None:
            return Response({"error": "Username not provided"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = Users.objects.get(username=username)
            user.delete()
            return Response({"message": f"User with username {username} deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Users.DoesNotExist:
            return Response({"error": f"User with username {username} does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class MoneyView(APIView):
     def post(self, request):
        username = request.data.get('username', None)
        money = request.data.get('money', None)
        if username is None or money is None:
            return Response({"error": "Username or amount of money not provided"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            Users.objects.filter(username=username).update(money=F('money') + money)
            return Response({"message": f"Money updated successfully for user {username}"}, status=status.HTTP_200_OK)
        except Users.DoesNotExist:
            return Response({"error": f"User with username {username} does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TasksView(APIView):
    def get(self, request):
        output = [{"taskName":output.taskName,
                   "projectName":output.projectName,
                   "username":output.username.username,
                  "taskCompleted":output.taskCompleted,
                  "taskStatus":output.taskStatus,
                  "plotNumber":output.plotNumber,
                  "pomodorros":output.pomodorros}
                  for output in Tasks.objects.all()]
        return Response(output)
    def post (self, request):
        serializer = TasksSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
    def delete(self, request):
        taskName = request.data.get('taskName', None)
        username = request.data.get('username', None)

        if taskName is None or username is None:
            return Response({"error": "Task name not provided"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            task = Tasks.objects.get(taskName=taskName, username= username)
            task.delete()
            return Response({"message": f"Task with name {taskName} deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Users.DoesNotExist:
            return Response({"error": f"Task with name {taskName} does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class UserDatesView(APIView):
    def get(self, request):
        userDates = UserDates.objects.all()
        serializer = UserDatesSerializer(userDates, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserDatesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class DecorationsView(APIView):
    def get(self, request):
        output = [{"name":output.name,
                  "price":output.price}
                  for output in Decorations.objects.all()]
        return Response(output)
    def post (self, request):
        serializer = DecorationsSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
    def delete(self, request):
        name = request.data.get('name', None)
        if name is None:
            return Response({"error": "Decoration name not provided"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            decoration = Decorations.objects.get(name=name)
            decoration.delete()
            return Response({"message": f"Decoration with name {name} deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Users.DoesNotExist:
            return Response({"error": f"Decoration with name {name} does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class CropsView(APIView):
    def get(self, request):
        output = [{"name":output.name,
                  "price":output.price,
                  "worth":output.worth}
                  for output in Crops.objects.all()]
        return Response(output)
    def post (self, request):
        serializer = CropsSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
    def delete(self, request):
        name = request.data.get('name', None)
        if name is None:
            return Response({"error": "Crop not provided"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            crop = Crops.objects.get(name=name)
            crop.delete()
            return Response({"message": f"Crop with name {name} deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Users.DoesNotExist:
            return Response({"error": f"Crop with name {name} does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class UserDecorationsView(APIView):
    def get(self, request):
        userDecorations = UserDecorations.objects.all()
        serializer = UserDecorationsSerializer(userDecorations, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserDecorationsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class UserCropsView(APIView):
    def get(self, request):
        userCrops = UserCrop.objects.all()
        serializer = UsersCropsSerializer(userCrops, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UsersCropsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


