from typing import Optional

from pydantic import BaseModel


class CreateRoomRequest(BaseModel):
    name: str
    institute_id: str
    floor: str
    type: str
    capacity: int
    resources: Optional[list[str]] = None
    status: Optional[str] = None


class UpdateRoomRequest(BaseModel):
    name: Optional[str] = None
    institute_id: Optional[str] = None
    floor: Optional[str] = None
    type: Optional[str] = None
    capacity: Optional[int] = None
    resources: Optional[list[str]] = None
    status: Optional[str] = None
