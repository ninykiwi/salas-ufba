import httpx
from fastapi import APIRouter, Depends, Response

from config import AUTH_SERVICE_URL
from middleware.auth import get_current_user, oauth2_scheme
from models.auth import AuthenticatedUser
from models.institute import CreateInstituteRequest

router = APIRouter(prefix="/institutes", tags=["institutes"])


@router.get("")
async def list_institutes(
    response: Response,
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(oauth2_scheme),
):
    async with httpx.AsyncClient() as client:
        upstream = await client.get(
            f"{AUTH_SERVICE_URL}/institutes",
            headers={"Authorization": f"Bearer {token}"},
        )
    response.status_code = upstream.status_code
    return upstream.json()


@router.post("")
async def create_institute(
    body: CreateInstituteRequest,
    response: Response,
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(oauth2_scheme),
):
    async with httpx.AsyncClient() as client:
        upstream = await client.post(
            f"{AUTH_SERVICE_URL}/institutes",
            json=body.model_dump(),
            headers={"Authorization": f"Bearer {token}"},
        )
    response.status_code = upstream.status_code
    return upstream.json()
