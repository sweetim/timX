import webapp2

from controllers import about, projects

application = webapp2.WSGIApplication([
    ('/', about.AboutHandler),
    webapp2.Route(r'/projects', handler=projects.ProjectsHandler),
    webapp2.Route(r'/projects/<project_name>', handler=projects.ProjectsNameHandler)
], debug=True)
