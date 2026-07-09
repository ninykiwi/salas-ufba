from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, institutes, logs, maps, notifications, rooms, schedules, users

app = FastAPI(title="Salas UFBA BFF")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,  # obrigatório para cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(institutes.router)
app.include_router(users.router)
app.include_router(rooms.router)
app.include_router(schedules.router)
app.include_router(logs.router)
app.include_router(notifications.router)
app.include_router(maps.router)
