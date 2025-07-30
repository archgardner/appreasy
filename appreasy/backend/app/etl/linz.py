import aiohttp
import csv
import io
import asyncio
from datetime import datetime
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.property import Parcel

LINZ_PARCELS_CSV = "https://data.linz.govt.nz/services/api/v1/exports/87524.csv"

async def fetch_csv(url: str) -> io.StringIO:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            response.raise_for_status()
            data = await response.read()
    return io.StringIO(data.decode())

async def load_parcels(session: AsyncSession, since: datetime = None):
    try:
        buff = await fetch_csv(LINZ_PARCELS_CSV)
        reader = csv.DictReader(buff)
        rows = []
        
        for row in reader:
            if since and "last_modified" in row:
                try:
                    if datetime.fromisoformat(row["last_modified"]) < since:
                        continue
                except:
                    pass  # Skip if date parsing fails
                    
            rows.append({
                "id": row.get("id", ""),
                "title_no": row.get("title_no"),
                "address": row.get("address"),
                "legal_desc": row.get("legal_desc"),
                "area": float(row.get("area_m2", 0) or 0),
            })
            
        if rows:
            stmt = insert(Parcel).values(rows).on_conflict_do_update(
                index_elements=[Parcel.id],
                set_={c: getattr(stmt.excluded, c) for c in ["title_no", "address", "legal_desc", "area"]},
            )
            await session.execute(stmt)
            await session.commit()
            
    except Exception as e:
        print(f"Error loading parcels: {e}")
        await session.rollback()
