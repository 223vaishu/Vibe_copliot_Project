from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, crud
from ..database import SessionLocal

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/visitors/", response_model=schemas.Visitor)
def create_visitor(visitor: schemas.VisitorCreate, db: Session = Depends(get_db)):
    return crud.create_visitor(db, visitor=visitor)

@router.get("/visitors/", response_model=List[schemas.Visitor])
def read_visitors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    visitors = crud.get_visitors(db, skip=skip, limit=limit)
    return visitors

@router.post("/visitors/check-in/", response_model=schemas.Visitor)
def check_in_visitor(check_in: schemas.VisitorCheckIn, db: Session = Depends(get_db)):
    return crud.check_in_visitor(db, check_in=check_in)

@router.post("/visitors/check-out/", response_model=schemas.Visitor)
def check_out_visitor(check_out: schemas.VisitorCheckOut, db: Session = Depends(get_db)):
    return crud.check_out_visitor(db, check_out=check_out)