import httpx
from fastapi import APIRouter, Depends, Response, status

from config import AUTH_SERVICE_URL
from middleware.auth import get_current_user, oauth2_scheme
from models.auth import AuthenticatedUser
from models.user import CreateUserRequest, UpdateUserRequest

router = APIRouter(prefix="/users", tags=["users"])


@router.get("")
async def list_users(
    response: Response,
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(oauth2_scheme),
):
    async with httpx.AsyncClient() as client:
        upstream = await client.get(
            f"{AUTH_SERVICE_URL}/users",
            headers={"Authorization": f"Bearer {token}"},
        )
    response.status_code = upstream.status_code
    return upstream.json()


@router.post("")
async def create_user(
    body: CreateUserRequest,
    response: Response,
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(oauth2_scheme),
):
    async with httpx.AsyncClient() as client:
        upstream = await client.post(
            f"{AUTH_SERVICE_URL}/auth/register",
            json=body.model_dump(exclude_none=True),
            headers={"Authorization": f"Bearer {token}"},
        )
    response.status_code = upstream.status_code
    return upstream.json()


@router.patch("/{user_id}")
async def update_user(
    user_id: str,
    body: UpdateUserRequest,
    response: Response,
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(oauth2_scheme),
):
    async with httpx.AsyncClient() as client:
        upstream = await client.patch(
            f"{AUTH_SERVICE_URL}/users/{user_id}",
            json=body.model_dump(exclude_none=True),
            headers={"Authorization": f"Bearer {token}"},
        )
    response.status_code = upstream.status_code
    return upstream.json()


@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(oauth2_scheme),
):
    async with httpx.AsyncClient() as client:
        upstream = await client.delete(
            f"{AUTH_SERVICE_URL}/users/{user_id}",
            headers={"Authorization": f"Bearer {token}"},
        )
    if upstream.status_code == status.HTTP_204_NO_CONTENT:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    return Response(
        content=upstream.content,
        status_code=upstream.status_code,
        media_type="application/json",
    )
