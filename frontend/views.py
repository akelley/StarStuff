from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import Satellite
import requests, tle2czml, os


def index(request, *args, **kwargs):
  return render(request, 'index.html')


@api_view(['GET'])
def satellite(request, name):
  if request.method == "GET":
    satellites = list(Satellite.objects.values())
    satellites_list = [entry for entry in satellites]

    result = None
    for satellite in satellites_list:
      for key, value in satellite.items():
        if key == 'acronym' and value == name:
          result = satellite
          break

    base_url = "https://celestrak.org/NORAD/elements/gp.php?GROUP={}&FORMAT=tle".format(name)
    r = requests.get(base_url)

    input_file = "static/mySpaceStuff/tle2czml/tle_{}.txt".format(name)
    
    with open(input_file, 'wb') as f:
      f.write(r.content)
    f.close()

    output_file = "static/mySpaceStuff/tle2czml/tle_{}.czml".format(name)
    tle2czml.create_czml(input_file, outputfile_path=output_file)
    return JsonResponse(result, safe=False)