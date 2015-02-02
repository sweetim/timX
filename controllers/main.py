import webapp2
import os

from google.appengine.ext.webapp import template

from datetime import date
from res import string_en

class MainHandler(webapp2.RequestHandler):
	def get(self):
		path = os.path.join(os.path.dirname(__file__), '../views' ,'index.html')

		obj = {
			"task": "main",
			"philosophies": string_en.philosophies,
			"projects": string_en.project,
			"year": date.today().year
		}

		self.response.write(template.render(path, obj))
