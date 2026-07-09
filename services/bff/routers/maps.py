from typing import Optional

import httpx
from fastapi import APIRouter, Depends, Response

from config import MAP_SERVICE_URL
from middleware.auth import get_current_user, get_token_from_cookie
from models.auth import AuthenticatedUser
from models.map import SaveMapRequest

router = APIRouter(prefix="/maps", tags=["maps"])


@router.get("")
async def get_map(
    response: Response,
    institute_id: Optional[str] = None,
    floor: Optional[str] = None,
):
    params = {
        k: v
        for k, v in {"institute_id": institute_id, "floor": floor}.items()
        if v is not None
    }
    async with httpx.AsyncClient() as client:
        upstream = await client.get(f"{MAP_SERVICE_URL}/maps", params=params)
    response.status_code = upstream.status_code
    return upstream.json()


@router.post("")
async def save_map(
    body: SaveMapRequest,
    response: Response,
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(get_token_from_cookie),
):
    async with httpx.AsyncClient() as client:
        upstream = await client.post(
            f"{MAP_SERVICE_URL}/maps",
            json=body.model_dump(),
            headers={"Authorization": f"Bearer {token}"},
        )
    response.status_code = upstream.status_code
    return upstream.json()
