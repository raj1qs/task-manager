import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime

from db.database import Base

class Task(Base):
    __tablename__ = "task"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String)
    description = Column(String)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.now)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("user.id"))

