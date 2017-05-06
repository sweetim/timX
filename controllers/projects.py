import os
import webapp2

from google.appengine.ext.webapp import template

class ProjectsHandler(webapp2.RequestHandler):
	def get(self):
		path = os.path.join(os.path.dirname(__file__), '../views' ,'projects.html')

		obj = {
			"projects": [{
				"link": "/public/pcd.html",
				"name": "PCD Viewer",
                "description": "A point cloud viewer"
			}, {
				"link": "/snows",
				"name": "Snows simulator",
                "description": "A simple snow simulator"
			}]
		}

		self.response.write(template.render(path, obj))
