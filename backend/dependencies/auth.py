from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from db.database import get_db
from models.user import User
from core.config import settings
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    import uuid
    try:
        uuid_obj = uuid.UUID(str(user_id))
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid or expired token. Please login again.")
        
    user = db.query(User).filter(User.id == str(uuid_obj)).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user