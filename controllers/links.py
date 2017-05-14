import webapp2

from datetime import date
from router import getView

class LinksHandler(webapp2.RequestHandler):
	def get(self):
		self.response.write(getView("links", {
			"template": "links.html",
			"data": [
                {
                    "title": "C# 6.0 In A Nutshell",
                    "link": "https://s3-ap-southeast-1.amazonaws.com/mylekha-ebook/IT+%26+Programming/c_c%2B%2B_c%23/C%23+6.0+in+a+Nutshell.pdf",
                    "language": "C#"
                },
                {
                    "title": "High Performance Javascript",
                    "link": "ftp://ftp.micronet-rostov.ru/linux-support/books/programming/JavaScript/[O%60Reilly]%20-%20High%20Performance%20JavaScript%20-%20[Zakas].pdf",
                    "language": "Javascript"
                },
                {
                    "title": "Mastering CMake",
                    "link": "https://www.scribd.com/document/260149983/Mastering-Cmake",
                    "language": "CMake"
                },
                {
                    "title": "Modern C++ Design: Generic Programming and Design Patterns Applied",
                    "link": "https://www.mimuw.edu.pl/~mrp/cpp/SecretCPP/Addison-Wesley%20-%20Modern%20C++%20Design.%20Generic%20Programming%20and%20Design%20Patterns%20Applied.pdf",
                    "language": "C++"
                },
                {
                    "title": "Effective Modern C++",
                    "link": "https://edisciplinas.usp.br/pluginfile.php/1995323/mod_resource/content/1/Effective%20Modern%20C%2B%2B%202014.pdf",
                    "language": "C++"
                },
                {
                    "title": "Effective GoF Patterns with C++11 and Boost",
                    "link": "https://www.infoq.com/presentations/gof-patterns-c-plus-plus-boost#downloadPdf",
                    "language": "C++"
                },
                {
                    "title": "Blog about writing good C++ code",
                    "link": "http://www.acodersjourney.com/2016/05/top-10-dumb-mistakes-avoid-c-11-smart-pointers/",
                    "language": "C++"
                },
                {
                    "title": "Artificial Intelligence: A Modern Approach",
                    "link": "http://aima.cs.berkeley.edu/",
                    "language": "AI"
                }
            ]
		}))
