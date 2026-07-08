from typing import Optional

from pydantic import BaseModel


class CreateScheduleRequest(BaseModel):
    title: str
    category: str
    room_id: str
    institute_id: str
    date: str
    start_time: str
    end_time: str
    expected_audience: int
    recurrence: str
    recurrence_end_date: Optional[str] = None
    equipment_requested: Optional[list[str]] = None
    notes: Optional[str] = None


class UpdateScheduleRequest(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    room_id: Optional[str] = None
    institute_id: Optional[str] = None
    date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    expected_audience: Optional[int] = None
    recurrence: Optional[str] = None
    recurrence_end_date: Optional[str] = None
    equipment_requested: Optional[list[str]] = None
    notes: Optional[str] = None
    status: Optional[str] = None
