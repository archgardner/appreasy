from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..db.session import AsyncSessionLocal
from ..models.property import Parcel

router = APIRouter()

async def get_db():
    async with AsyncSessionLocal() as sess:
        yield sess

@router.get("/search")
async def search(q: str = Query(min_length=3), db: AsyncSession = Depends(get_db)):
    stmt = select(Parcel).where(Parcel.address.ilike(f"%{q}%")).limit(50)
    result = await db.execute(stmt)
    parcels = result.scalars().all()
    return [{"id": p.id, "address": p.address, "area": p.area} for p in parcels]

@router.get("/parcel/{parcel_id}")
async def get_parcel(parcel_id: str, db: AsyncSession = Depends(get_db)):
    parcel = await db.get(Parcel, parcel_id)
    if not parcel:
        raise HTTPException(status_code=404, detail="Parcel not found")
    
    return {
        "id": parcel.id,
        "address": parcel.address,
        "title_no": parcel.title_no,
        "legal_desc": parcel.legal_desc,
        "area": parcel.area,
        "cv": getattr(parcel.rating, 'cv', None) if parcel.rating else None,
        "last_sale_price": None,  # Would join with sales data
        "last_sale_date": None,
        "median_rent": None,  # Would calculate from rent data
        "zone_code": None,  # Would join with zoning data
        "hazard_summary": None,  # Would join with hazard data
    }

@router.get("/health")
async def health_check():
    return {"status": "healthy"}
