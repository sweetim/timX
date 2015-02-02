import webapp2
import os

from google.appengine.ext.webapp import template

from datetime import date
from model import projectModel
from res import string_en

class ProjectHandler(webapp2.RequestHandler):
	def get(self):
		path = os.path.join(os.path.dirname(__file__), '../views' ,'index.html')

		project_query = projectModel.Project.query(ancestor=projectModel.projectModel_key()).order(-projectModel.Project.date)
		projects = project_query.fetch(10)

		obj = {
			"task": "project",
			"year": date.today().year,
			"projects": string_en.project
		}

		self.response.write(template.render(path, obj))

