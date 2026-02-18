from pydantic import BaseModel
from datetime import date
from enum import Enum


class StockLevel(str, Enum):
    HIGH = "多い"
    NORMAL = "普通"
    LOW = "少ない"


class FoodItemCreate(BaseModel):
    name: str
    quantity: int = 1
    expiry_date: date


class FoodItemUpdate(BaseModel):
    name: str | None = None
    quantity: int | None = None
    expiry_date: date | None = None


class FoodItemResponse(BaseModel):
    id: int
    name: str
    quantity: int
    expiry_date: date
    is_expiring_soon: bool = False

    model_config = {"from_attributes": True}


class SupplyItemCreate(BaseModel):
    name: str
    stock_level: StockLevel = StockLevel.NORMAL


class SupplyItemUpdate(BaseModel):
    name: str | None = None
    stock_level: StockLevel | None = None


class SupplyItemResponse(BaseModel):
    id: int
    name: str
    stock_level: StockLevel
    is_low: bool = False

    model_config = {"from_attributes": True}


class RecipeRequest(BaseModel):
    pass


class RecipeResponse(BaseModel):
    recipe: str
