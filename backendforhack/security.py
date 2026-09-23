from passlib.context import CryptContext
from jose import jwt
from dotenv import load_dotenv
import os

# Load values from .env
load_dotenv()

# JWT secret key
SECRET_KEY = os.getenv("SECRET_KEY")

# Password hashing configuration
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_id: int):
    data = {
        "sub": str(user_id)
    }

    token = jwt.encode(
        data,
        SECRET_KEY,
        algorithm="HS256"
    )

    return token


def decode_access_token(token: str):
    payload = jwt.decode(
        token,
        SECRET_KEY,
        algorithms=["HS256"]
    )

    return payload