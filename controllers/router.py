import os
import logging

from google.appengine.ext.webapp import template

def getView(current, data):
    path = os.path.join(os.path.dirname(__file__), '../views' ,'router.html')
    logging.error(current)
    router = {
        "home": "/",
        "projects": "/projects"
    }

    routerLinks = { k: v for k, v in router.iteritems() if k != current}

    obj = {
        "nav": {
            "template": "nav.html",
            "data": routerLinks
        },
        "view": data
    }

    return template.render(path, obj)