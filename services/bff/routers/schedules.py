from typing import Optional

import httpx
from fastapi import APIRouter, Depends, Query, Response, status

from config import ROOMS_SERVICE_URL
from middleware.auth import get_current_user, get_token_from_cookie
from models.auth import AuthenticatedUser
from models.schedule import CreateScheduleRequest, UpdateScheduleRequest

router = APIRouter(prefix="/schedules", tags=["schedules"])


# Precisa vir antes de "/{schedule_id}" para "today" não ser interpretado como um id.
@router.get("/today")
async def list_schedules_today(response: Response, institute_id: Optional[str] = None):
    params = {"institute_id": institute_id} if institute_id else {}
    async with httpx.AsyncClient() as client:
        upstream = await client.get(
            f"{ROOMS_SERVICE_URL}/schedules/today", params=params
        )
    response.status_code = upstream.status_code
    return upstream.json()


@router.get("")
async def list_schedules(
    response: Response,
    room_id: Optional[str] = None,
    institute_id: Optional[str] = None,
    date: Optional[str] = None,
    professor_id: Optional[str] = None,
    status_: Optional[str] = Query(default=None, alias="status"),
):
    params = {
        k: v
        for k, v in {
            "room_id": room_id,
            "institute_id": institute_id,
            "date": date,
            "professor_id": professor_id,
            "status": status_,
        }.items()
        if v is not None
    }
    async with httpx.AsyncClient() as client:
        upstream = await client.get(f"{ROOMS_SERVICE_URL}/schedules", params=params)
    response.status_code = upstream.status_code
    return upstream.json()


@router.get("/{schedule_id}")
async def get_schedule(schedule_id: str, response: Response):
    async with httpx.AsyncClient() as client:
        upstream = await client.get(f"{ROOMS_SERVICE_URL}/schedules/{schedule_id}")
    response.status_code = upstream.status_code
    return upstream.json()


@router.post("")
async def create_schedule(
    body: CreateScheduleRequest,
    response: Response,
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(get_token_from_cookie),
):
    async with httpx.AsyncClient() as client:
        upstream = await client.post(
            f"{ROOMS_SERVICE_URL}/schedules",
            json=body.model_dump(exclude_none=True),
            headers={"Authorization": f"Bearer {token}"},
        )
    response.status_code = upstream.status_code
    return upstream.json()


@router.patch("/{schedule_id}")
async def update_schedule(
    schedule_id: str,
    body: UpdateScheduleRequest,
    response: Response,
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(get_token_from_cookie),
):
    async with httpx.AsyncClient() as client:
        upstream = await client.patch(
            f"{ROOMS_SERVICE_URL}/schedules/{schedule_id}",
            json=body.model_dump(exclude_none=True),
            headers={"Authorization": f"Bearer {token}"},
        )
    response.status_code = upstream.status_code
    return upstream.json()


@router.delete("/{schedule_id}")
async def delete_schedule(
    schedule_id: str,
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(get_token_from_cookie),
):
    async with httpx.AsyncClient() as client:
        upstream = await client.delete(
            f"{ROOMS_SERVICE_URL}/schedules/{schedule_id}",
            headers={"Authorization": f"Bearer {token}"},
        )
    if upstream.status_code == status.HTTP_204_NO_CONTENT:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    return Response(
        content=upstream.content,
        status_code=upstream.status_code,
        media_type="application/json",
    )
