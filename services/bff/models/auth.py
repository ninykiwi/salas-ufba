from typing import Optional

from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str
    keepConnected: bool = False


class AuthenticatedUser(BaseModel):
    id: str
    email: str
    name: str
    role: str
    institutes: list[dict] = []
