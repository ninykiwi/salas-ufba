import httpx
from fastapi import APIRouter, Depends, Response

from config import AUTH_SERVICE_URL
from middleware.auth import get_current_user, get_token_from_cookie
from models.auth import AuthenticatedUser
from models.institute import CreateInstituteRequest

router = APIRouter(prefix="/institutes", tags=["institutes"])


@router.get("")
async def list_institutes(response: Response):
    async with httpx.AsyncClient() as client:
        upstream = await client.get(f"{AUTH_SERVICE_URL}/institutes")
    response.status_code = upstream.status_code
    return upstream.json()


@router.post("")
async def create_institute(
    body: CreateInstituteRequest,
    response: Response,
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(get_token_from_cookie),
):
    async with httpx.AsyncClient() as client:
        upstream = await client.post(
            f"{AUTH_SERVICE_URL}/institutes",
            json=body.model_dump(),
            headers={"Authorization": f"Bearer {token}"},
        )
    response.status_code = upstream.status_code
    return upstream.json()


@router.delete("/{institute_id}")
async def delete_institute(
    institute_id: str,
    response: Response,
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(get_token_from_cookie),
):
    async with httpx.AsyncClient() as client:
        upstream = await client.delete(
            f"{AUTH_SERVICE_URL}/institutes/{institute_id}",
            headers={"Authorization": f"Bearer {token}"},
        )
    response.status_code = upstream.status_code
    return upstream.json()
