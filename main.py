import webapp2

from controllers import about, tools

application = webapp2.WSGIApplication([
    ('/', about.AboutHandler),
    webapp2.Route(r'/tools', handler=tools.ToolsHandler),
    webapp2.Route(r'/tools/<tool_name>', handler=tools.ToolsNameHandler)
], debug=True)
