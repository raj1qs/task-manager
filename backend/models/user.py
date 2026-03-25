from db.database import Base

import uuid
from sqlalchemy import String, Column, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime

class User(Base):
    __tablename__ = 'user'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True,nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default='user')
    created_at = Column(DateTime, default=datetime.now)