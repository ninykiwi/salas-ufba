import httpx
from fastapi import APIRouter, Depends, Response
from fastapi.responses import StreamingResponse

from config import ROOMS_SERVICE_URL
from middleware.auth import get_current_user, get_token_from_cookie
from models.auth import AuthenticatedUser

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("")
async def list_notifications(
    response: Response,
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(get_token_from_cookie),
):
    async with httpx.AsyncClient() as client:
        upstream = await client.get(
            f"{ROOMS_SERVICE_URL}/notifications",
            headers={"Authorization": f"Bearer {token}"},
        )
    response.status_code = upstream.status_code
    return upstream.json()


@router.get("/stream")
async def stream_notifications(
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(get_token_from_cookie),
):
    async def event_generator():
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream(
                "GET",
                f"{ROOMS_SERVICE_URL}/notifications/stream",
                headers={"Authorization": f"Bearer {token}"},
            ) as upstream:
                async for chunk in upstream.aiter_bytes():
                    yield chunk

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.patch("/read-all")
async def mark_all_notifications_read(
    response: Response,
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(get_token_from_cookie),
):
    async with httpx.AsyncClient() as client:
        upstream = await client.patch(
            f"{ROOMS_SERVICE_URL}/notifications/read-all",
            headers={"Authorization": f"Bearer {token}"},
        )
    response.status_code = upstream.status_code
    return upstream.json()


@router.patch("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    response: Response,
    _: AuthenticatedUser = Depends(get_current_user),
    token: str = Depends(get_token_from_cookie),
):
    async with httpx.AsyncClient() as client:
        upstream = await client.patch(
            f"{ROOMS_SERVICE_URL}/notifications/{notification_id}/read",
            headers={"Authorization": f"Bearer {token}"},
        )
    response.status_code = upstream.status_code
    return upstream.json()
