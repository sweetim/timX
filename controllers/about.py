import webapp2

from datetime import date
from router import getView

class AboutHandler(webapp2.RequestHandler):
	def get(self):
		self.response.write(getView("about", {
			"template": "home.html",
			"data": {
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
		}))
