import webapp2

from controllers import main, projects

application = webapp2.WSGIApplication([
    ('/', main.MainHandler),
    ('/projects', projects.ProjectsHandler)
], debug=True)
