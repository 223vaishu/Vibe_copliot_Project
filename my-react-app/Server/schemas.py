from datetime import datetime
from pydantic import BaseModel

class VisitorBase(BaseModel):
    name: str
    email: str
    phone: str
    company: str
    purpose: str

class VisitorCreate(VisitorBase):
    pass

class Visitor(VisitorBase):
    id: int
    check_in_time: datetime
    check_out_time: datetime | None = None
    is_inside: bool
    
    class Config:
        orm_mode = True

class VisitorCheckIn(BaseModel):
    visitor_id: int
    host_id: int

class VisitorCheckOut(BaseModel):
    visitor_id: int