import httpx
from fastapi import APIRouter, Depends, Response

from config import AUTH_SERVICE_URL
from middleware.auth import get_current_user, oauth2_scheme
from models.auth import AuthenticatedUser, LoginRequest

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
async def login(body: LoginRequest, response: Response):
    async with httpx.AsyncClient() as client:
        upstream = await client.post(
            f"{AUTH_SERVICE_URL}/auth/login", json=body.model_dump()
        )
    response.status_code = upstream.status_code
    return upstream.json()


@router.get("/me")
async def me(
    response: Response,
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(oauth2_scheme),
):
    async with httpx.AsyncClient() as client:
        upstream = await client.get(
            f"{AUTH_SERVICE_URL}/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
    response.status_code = upstream.status_code
    return upstream.json()
