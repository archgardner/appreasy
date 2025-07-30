from sqlalchemy import Column, String, Float, Date, Integer, ForeignKey
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from ..db.base import Base

class Parcel(Base):
    __tablename__ = "parcels"
    id = Column(String, primary_key=True)  # LINZ parcel_id
    title_no = Column(String)
    address = Column(String)
    legal_desc = Column(String)
    area = Column(Float)
    geom = Column(Geometry("MULTIPOLYGON", srid=2193))
    sales = relationship("Sale", back_populates="parcel")
    rating = relationship("Rating", uselist=False, back_populates="parcel")

class Sale(Base):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True)
    parcel_id = Column(String, ForeignKey("parcels.id"))
    price = Column(Float)
    date = Column(Date)
    parcel = relationship("Parcel", back_populates="sales")

class Rating(Base):
    __tablename__ = "ratings"
    id = Column(Integer, primary_key=True)
    parcel_id = Column(String, ForeignKey("parcels.id"))
    cv = Column(Float)
    lv = Column(Float)
    iv = Column(Float)
    val_date = Column(Date)
    parcel = relationship("Parcel", back_populates="rating")
