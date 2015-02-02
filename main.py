import webapp2

from controllers import main, project, about

application = webapp2.WSGIApplication([
    ('/', main.MainHandler),
    ('/about', about.AboutHandler),
    ('/project', project.ProjectHandler)
], debug=True)
