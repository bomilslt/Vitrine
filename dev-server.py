import http.server
import socketserver
import os
import sys

PORT = 4000

class SPALocalRequestHandler(http.server.SimpleHTTPRequestHandler):
    """
    Custom request handler that serves index.html for all 404 errors.
    This allows client-side routing (History API) to work locally.
    """
    def do_GET(self):
        # Try to serve the requested file
        path = self.translate_path(self.path)
        
        # If it doesn't exist, serve index.html
        if not os.path.exists(path):
            self.path = '/index.html'
            
        return super().do_GET()

if __name__ == "__main__":
    Handler = SPALocalRequestHandler
    
    # Ensure we are in the right directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"--- BOMIL SOLUTIONS DEV SERVER ---")
            print(f"Serveur SPA lancé sur http://127.0.0.1:{PORT}")
            print(f"Support des Clean URLs (History API) : ACTIF")
            print(f"Appuyez sur Ctrl+C pour arrêter.")
            httpd.serve_forever()
    except OSError as e:
        print(f"Erreur : Le port {PORT} est déjà utilisé. Essayez d'arrêter l'autre serveur.")
    except KeyboardInterrupt:
        print("\nServeur arrêté.")
