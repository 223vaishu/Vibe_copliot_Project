from sqlalchemy import Column, Integer, String, DateTime, Boolean
from database import Base

class Visitor(Base):
    __tablename__ = "visitors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    company = Column(String)
    purpose = Column(String)
    check_in_time = Column(DateTime)
    check_out_time = Column(DateTime)
    is_inside = Column(Boolean, default=False)
    host_id = Column(Integer)  
    photo_url = Column(String)  