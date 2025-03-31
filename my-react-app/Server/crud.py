from sqlalchemy.orm import Session
import models
import schemas
from datetime import datetime

def get_visitor(db: Session, visitor_id: int):
    return db.query(models.Visitor).filter(models.Visitor.id == visitor_id).first()

def get_visitors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Visitor).offset(skip).limit(limit).all()

def create_visitor(db: Session, visitor: schemas.VisitorCreate):
    db_visitor = models.Visitor(**visitor.dict())
    db.add(db_visitor)
    db.commit()
    db.refresh(db_visitor)
    return db_visitor

def check_in_visitor(db: Session, check_in: schemas.VisitorCheckIn):
    visitor = db.query(models.Visitor).filter(models.Visitor.id == check_in.visitor_id).first()
    if visitor:
        visitor.check_in_time = datetime.now()
        visitor.is_inside = True
        visitor.host_id = check_in.host_id
        db.commit()
        db.refresh(visitor)
    return visitor

def check_out_visitor(db: Session, check_out: schemas.VisitorCheckOut):
    visitor = db.query(models.Visitor).filter(models.Visitor.id == check_out.visitor_id).first()
    if visitor:
        visitor.check_out_time = datetime.now()
        visitor.is_inside = False
        db.commit()
        db.refresh(visitor)
    return visitor