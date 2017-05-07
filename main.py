import webapp2

from controllers import main, projects

application = webapp2.WSGIApplication([
    ('/', main.MainHandler),
    webapp2.Route(r'/projects', handler=projects.ProjectsHandler),
    webapp2.Route(r'/projects/<project_name>', handler=projects.ProjectsNameHandler)
], debug=True)
