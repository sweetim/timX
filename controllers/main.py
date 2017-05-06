import webapp2
import os

from google.appengine.ext.webapp import template

from datetime import date

class MainHandler(webapp2.RequestHandler):
	def get(self):
		path = os.path.join(os.path.dirname(__file__), '../views' ,'index.html')

		obj = {
			"references": [{
				"link": "https://www.linkedin.com/in/swee-tim-ho-8a378048/",
				"image": "public/image/linkedin.png",
				"name": "Linkedin"
			}, {
				"link": "http://stackoverflow.com/users/2297825/tim",
				"image": "public/image/stackoverflow.svg",
				"name": "Stackoverflow"
			}, {
				"link": "https://github.com/sweetim",
				"image": "public/image/github.png",
				"name": "Github"
			}],
			"year": date.today().year
		}

		self.response.write(template.render(path, obj))
