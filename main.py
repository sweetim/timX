import webapp2

from controllers import about, tools, links

application = webapp2.WSGIApplication([
    ('/', about.AboutHandler),
    webapp2.Route(r'/tools', handler=tools.ToolsHandler),
    webapp2.Route(r'/tools/<tool_name>', handler=tools.ToolsNameHandler),
    webapp2.Route('/links', handler=links.LinksHandler)
], debug=True)
