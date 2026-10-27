"""Serve the static platform at both / and its GitHub Pages /learning-lab/ prefix."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import argparse
ROOT=Path(__file__).resolve().parent.parent
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
 def translate_path(self,path):
  if path.startswith('/learning-lab/'):path=path[len('/learning-lab'):]
  return super().translate_path(path)
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=8000);args=parser.parse_args()
 ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
