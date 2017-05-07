import webapp2

from router import getView

class ToolsHandler(webapp2.RequestHandler):
	def get(self):
		self.response.write(getView("tools", {
			"template": "tools.html",
			"data": {
				"tools": [{
					"link": "/tools/pcdviewer",
					"name": "PCD Viewer",
					"description": "A point cloud viewer that reads .pcd file and display them"
				}, {
					"link": "/tools/snows",
					"name": "Snows simulator",
					"description": "A simple snow simulator"
				}]
			}
		}))

class ToolsNameHandler(webapp2.RequestHandler):
	def get(self, tool_name):
		tools = [{
			"name": "pcdviewer",
			"source": "pcd.html"
		}, {
			"name": "snow",
			"source": "snow.html"
		}]

		source = "error.html"

		for val in tools:
			if (val["name"] == tool_name):
				source = val["source"]
				break

		self.response.write(getView("pcdviewer", {
			"template": "pcd.html",
			"data": {}
		}))
