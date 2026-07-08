import os

from dotenv import load_dotenv

load_dotenv()

AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:3002")

JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET:
    raise Exception("JWT_SECRET não definida — abortando boot")

JWT_ALGORITHM = "HS256"

PORT = 8000
