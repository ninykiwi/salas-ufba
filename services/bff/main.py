from fastapi import FastAPI

from routers import auth, institutes, users

app = FastAPI(title="Salas UFBA BFF")

app.include_router(auth.router)
app.include_router(institutes.router)
app.include_router(users.router)
