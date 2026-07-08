from typing import Optional

from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthenticatedUser(BaseModel):
    id: str
    role: str
    institutes: list[dict] = []
