import webapp2

from router import getView

class ProjectsHandler(webapp2.RequestHandler):
	def get(self):
		self.response.write(getView("projects", {
			"template": "projects.html",
			"data": {
				"projects": [{
					"link": "/projects/pcdviewer",
					"name": "PCD Viewer",
					"description": "A point cloud viewer"
				}, {
					"link": "/projects/snows",
					"name": "Snows simulator",
					"description": "A simple snow simulator"
				}]
			}
		}))

class ProjectsNameHandler(webapp2.RequestHandler):
	def get(self, project_name):
		projects = [{
			"name": "pcdviewer",
			"source": "pcd.html"
		}, {
			"name": "snow",
			"source": "snow.html"
		}]

		source = "error.html"

		for val in projects:
			if (val["name"] == project_name):
				source = val["source"]
				break

		self.response.write(getView("pcdviewer", {
			"template": "pcd.html",
			"data": {}
		}))
