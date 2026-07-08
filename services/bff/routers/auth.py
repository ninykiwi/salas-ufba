import httpx
from fastapi import APIRouter, Depends, Response

from config import AUTH_SERVICE_URL
from middleware.auth import get_current_user
from models.auth import AuthenticatedUser, LoginRequest

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
async def login(body: LoginRequest, response: Response):
    async with httpx.AsyncClient() as client:
        upstream = await client.post(
            f"{AUTH_SERVICE_URL}/auth/login",
            json={"email": body.email, "password": body.password},
        )

    if upstream.status_code != 200:
        response.status_code = upstream.status_code
        return upstream.json()

    data = upstream.json()

    if body.keepConnected:
        response.set_cookie(
            key="access_token",
            value=data["access_token"],
            httponly=True,
            secure=False,  # True em produção
            samesite="strict",
            max_age=86400,  # 1 dia — persiste após fechar o browser
        )
    else:
        response.set_cookie(
            key="access_token",
            value=data["access_token"],
            httponly=True,
            secure=False,  # True em produção
            samesite="strict",
            # sem max_age = session cookie, some ao fechar o browser
        )

    return {"user": data["user"]}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logout realizado"}


@router.get("/me")
async def me(current_user: AuthenticatedUser = Depends(get_current_user)):
    return {
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "role": current_user.role,
            "institutes": current_user.institutes,
        }
    }
