from typing import Optional

import httpx
from fastapi import APIRouter, Depends, Query, Response, status

from config import ROOMS_SERVICE_URL
from middleware.auth import get_current_user, get_token_from_cookie
from models.auth import AuthenticatedUser
from models.room import CreateRoomRequest, UpdateRoomRequest

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.get("")
async def list_rooms(
    response: Response,
    institute_id: Optional[str] = None,
    status_: Optional[str] = Query(default=None, alias="status"),
    floor: Optional[str] = None,
):
    params = {
        k: v
        for k, v in {
            "institute_id": institute_id,
            "status": status_,
            "floor": floor,
        }.items()
        if v is not None
    }
    async with httpx.AsyncClient() as client:
        upstream = await client.get(f"{ROOMS_SERVICE_URL}/rooms", params=params)
    response.status_code = upstream.status_code
    return upstream.json()


@router.get("/{room_id}")
async def get_room(room_id: str, response: Response):
    async with httpx.AsyncClient() as client:
        upstream = await client.get(f"{ROOMS_SERVICE_URL}/rooms/{room_id}")
    response.status_code = upstream.status_code
    return upstream.json()


@router.post("")
async def create_room(
    body: CreateRoomRequest,
    response: Response,
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(get_token_from_cookie),
):
    async with httpx.AsyncClient() as client:
        upstream = await client.post(
            f"{ROOMS_SERVICE_URL}/rooms",
            json=body.model_dump(exclude_none=True),
            headers={"Authorization": f"Bearer {token}"},
        )
    response.status_code = upstream.status_code
    return upstream.json()


@router.patch("/{room_id}")
async def update_room(
    room_id: str,
    body: UpdateRoomRequest,
    response: Response,
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(get_token_from_cookie),
):
    async with httpx.AsyncClient() as client:
        upstream = await client.patch(
            f"{ROOMS_SERVICE_URL}/rooms/{room_id}",
            json=body.model_dump(exclude_none=True),
            headers={"Authorization": f"Bearer {token}"},
        )
    response.status_code = upstream.status_code
    return upstream.json()


@router.delete("/{room_id}")
async def delete_room(
    room_id: str,
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(get_token_from_cookie),
):
    async with httpx.AsyncClient() as client:
        upstream = await client.delete(
            f"{ROOMS_SERVICE_URL}/rooms/{room_id}",
            headers={"Authorization": f"Bearer {token}"},
        )
    if upstream.status_code == status.HTTP_204_NO_CONTENT:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    return Response(
        content=upstream.content,
        status_code=upstream.status_code,
        media_type="application/json",
    )
