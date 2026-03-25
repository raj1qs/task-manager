from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "pending"

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    title: Optional[str] = None
    status: Optional[str] = None

class TaskResponse(TaskBase):
    id: UUID
    owner_id: UUID
    created_at: datetime

    class Config:
        orm_mode = True
