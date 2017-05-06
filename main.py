import webapp2

from controllers import main

application = webapp2.WSGIApplication([
    ('/', main.MainHandler)
], debug=True)
