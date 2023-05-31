import os
from dotenv import load_dotenv

ENV = os.getenv("ENV", "development")

load_dotenv()  # .env base settings
load_dotenv(f".env.{ENV}", override=True)  # .env.{ENV} environment specific settings

DEBUG = ENV == "development"
IS_PRODUCTION = ENV == "production"
IS_DEVELOPMENT = ENV == "development"

CLIENT_URL = os.getenv("CLIENT_URL")
SERVER_URL = os.getenv("SERVER_URL")
