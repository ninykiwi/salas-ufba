from typing import Any

from pydantic import BaseModel


class SaveMapRequest(BaseModel):
    institute_id: str
    institute_name: str
    floor: int
    shapes: list[dict[str, Any]]
