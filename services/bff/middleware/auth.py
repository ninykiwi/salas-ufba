from fastapi import Cookie, Depends, HTTPException, status
from jose import JWTError, jwt

from config import JWT_ALGORITHM, JWT_SECRET
from models.auth import AuthenticatedUser


async def get_token_from_cookie(access_token: str | None = Cookie(default=None)) -> str:
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de acesso não fornecido",
        )
    return access_token


async def get_current_user(
    token: str = Depends(get_token_from_cookie),
) -> AuthenticatedUser:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
        )

    user_id = payload.get("sub")
    email = payload.get("email")
    name = payload.get("name")
    role = payload.get("role")
    if not user_id or not email or not name or not role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
        )

    return AuthenticatedUser(
        id=user_id,
        email=email,
        name=name,
        role=role,
        institutes=payload.get("institutes", []),
    )
