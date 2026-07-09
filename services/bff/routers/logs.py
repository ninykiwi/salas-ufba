from typing import Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException, Response, status

from config import AUTH_SERVICE_URL
from middleware.auth import get_current_user, get_token_from_cookie
from models.auth import AuthenticatedUser

router = APIRouter(prefix="/logs", tags=["logs"])


@router.get("")
async def get_logs(
    response: Response,
    admin_id: Optional[str] = None,
    resource_type: Optional[str] = None,
    current_user: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(get_token_from_cookie),
):
    if current_user.role != "SUPERADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Acesso negado"
        )
    params = {
        k: v
        for k, v in {"admin_id": admin_id, "resource_type": resource_type}.items()
        if v is not None
    }
    async with httpx.AsyncClient() as client:
        upstream = await client.get(
            f"{AUTH_SERVICE_URL}/audit/logs",
            params=params,
            headers={"Authorization": f"Bearer {token}"},
        )
    response.status_code = upstream.status_code
    return upstream.json()
