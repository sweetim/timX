from google.appengine.ext import ndb

from config import config

def projectModel_key():
	return ndb.Key(config.DB_KIND, config.DB_ID)

class Project(ndb.Model):
	title = ndb.StringProperty(indexed=False)
	description = ndb.StringProperty(indexed=False)
	link = ndb.StringProperty(indexed=False)
	date = ndb.DateTimeProperty(auto_now_add=True)

