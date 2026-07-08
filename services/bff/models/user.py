from typing import Optional

from pydantic import BaseModel


class CreateUserRequest(BaseModel):
    name: str
    email: str
    siape: Optional[str] = None
    password: str
    role: Optional[str] = None
    instituteIds: Optional[list[str]] = None


class UpdateUserRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    siape: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    instituteIds: Optional[list[str]] = None
