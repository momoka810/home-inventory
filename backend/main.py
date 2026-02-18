import os
from datetime import date, timedelta

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import anthropic

from database import Base, engine, get_db
from models import FoodItem, SupplyItem
from schemas import (
    FoodItemCreate, FoodItemUpdate, FoodItemResponse,
    SupplyItemCreate, SupplyItemUpdate, SupplyItemResponse,
    RecipeResponse,
)

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="家庭用在庫管理API")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- helpers ----------

def _food_response(item: FoodItem) -> FoodItemResponse:
    is_expiring = item.expiry_date <= date.today() + timedelta(days=3)
    return FoodItemResponse(
        id=item.id,
        name=item.name,
        quantity=item.quantity,
        expiry_date=item.expiry_date,
        is_expiring_soon=is_expiring,
    )


def _supply_response(item: SupplyItem) -> SupplyItemResponse:
    return SupplyItemResponse(
        id=item.id,
        name=item.name,
        stock_level=item.stock_level,
        is_low=item.stock_level == "少ない",
    )


# ---------- Food Items ----------

@app.get("/api/foods", response_model=list[FoodItemResponse])
def list_foods(db: Session = Depends(get_db)):
    items = db.query(FoodItem).order_by(FoodItem.expiry_date).all()
    return [_food_response(i) for i in items]


@app.post("/api/foods", response_model=FoodItemResponse, status_code=201)
def create_food(data: FoodItemCreate, db: Session = Depends(get_db)):
    item = FoodItem(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return _food_response(item)


@app.put("/api/foods/{item_id}", response_model=FoodItemResponse)
def update_food(item_id: int, data: FoodItemUpdate, db: Session = Depends(get_db)):
    item = db.query(FoodItem).filter(FoodItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="食材が見つかりません")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return _food_response(item)


@app.delete("/api/foods/{item_id}", status_code=204)
def delete_food(item_id: int, db: Session = Depends(get_db)):
    item = db.query(FoodItem).filter(FoodItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="食材が見つかりません")
    db.delete(item)
    db.commit()


# ---------- Supply Items ----------

@app.get("/api/supplies", response_model=list[SupplyItemResponse])
def list_supplies(db: Session = Depends(get_db)):
    items = db.query(SupplyItem).order_by(SupplyItem.name).all()
    return [_supply_response(i) for i in items]


@app.post("/api/supplies", response_model=SupplyItemResponse, status_code=201)
def create_supply(data: SupplyItemCreate, db: Session = Depends(get_db)):
    item = SupplyItem(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return _supply_response(item)


@app.put("/api/supplies/{item_id}", response_model=SupplyItemResponse)
def update_supply(item_id: int, data: SupplyItemUpdate, db: Session = Depends(get_db)):
    item = db.query(SupplyItem).filter(SupplyItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="日用品が見つかりません")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return _supply_response(item)


@app.delete("/api/supplies/{item_id}", status_code=204)
def delete_supply(item_id: int, db: Session = Depends(get_db)):
    item = db.query(SupplyItem).filter(SupplyItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="日用品が見つかりません")
    db.delete(item)
    db.commit()


# ---------- Dashboard ----------

@app.get("/api/dashboard")
def dashboard(db: Session = Depends(get_db)):
    threshold = date.today() + timedelta(days=3)
    expiring_foods = (
        db.query(FoodItem)
        .filter(FoodItem.expiry_date <= threshold)
        .order_by(FoodItem.expiry_date)
        .all()
    )
    low_supplies = (
        db.query(SupplyItem)
        .filter(SupplyItem.stock_level == "少ない")
        .order_by(SupplyItem.name)
        .all()
    )
    return {
        "expiring_foods": [_food_response(i) for i in expiring_foods],
        "low_supplies": [_supply_response(i) for i in low_supplies],
    }


# ---------- Shopping List ----------

@app.get("/api/shopping")
def shopping_list(db: Session = Depends(get_db)):
    threshold = date.today() + timedelta(days=3)
    expiring_foods = (
        db.query(FoodItem)
        .filter(FoodItem.expiry_date <= threshold)
        .order_by(FoodItem.expiry_date)
        .all()
    )
    low_supplies = (
        db.query(SupplyItem)
        .filter(SupplyItem.stock_level == "少ない")
        .order_by(SupplyItem.name)
        .all()
    )
    items = []
    for f in expiring_foods:
        items.append({"type": "food", "name": f.name, "detail": f"期限: {f.expiry_date}"})
    for s in low_supplies:
        items.append({"type": "supply", "name": s.name, "detail": "残量: 少ない"})
    return {"items": items}


# ---------- Recipe Suggestion ----------

def _generate_mock_recipe(foods: list[FoodItem]) -> str:
    today = date.today()
    expiring = [f for f in foods if (f.expiry_date - today).days <= 3]
    use_foods = expiring if expiring else foods[:3]
    names = "、".join(f.name for f in use_foods)

    return f"""【提案レシピ】{names}の簡単炒め物（デモモード）

※ これはデモ用のレシピです。ANTHROPIC_API_KEYを設定するとAIが在庫に合わせたレシピを提案します。

■ 材料
{chr(10).join(f'・{f.name} … {f.quantity}個' for f in use_foods)}
・塩こしょう … 適量
・サラダ油 … 大さじ1

■ 手順
1. {names}を食べやすい大きさに切る
2. フライパンにサラダ油を熱し、中火で炒める
3. 塩こしょうで味を調えて完成

■ ポイント
・賞味期限が近い食材（{names}）を優先的に使っています
・お好みで醤油やめんつゆを加えても美味しいです"""


@app.post("/api/recipe", response_model=RecipeResponse)
def suggest_recipe(db: Session = Depends(get_db)):
    foods = db.query(FoodItem).order_by(FoodItem.expiry_date).all()
    if not foods:
        raise HTTPException(status_code=400, detail="食材が登録されていません")

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return RecipeResponse(recipe=_generate_mock_recipe(foods))

    today = date.today()
    food_list = []
    for f in foods:
        days_left = (f.expiry_date - today).days
        urgency = "【期限切れ間近！】" if days_left <= 3 else ""
        food_list.append(f"{urgency}{f.name} (数量: {f.quantity}, 期限まで: {days_left}日)")

    prompt = f"""あなたは家庭料理の専門家です。以下の食材在庫をもとに、作れるレシピを1つ提案してください。

## 現在の食材在庫
{chr(10).join('- ' + item for item in food_list)}

## ルール
- 賞味期限が近い食材を優先的に使うこと
- 家庭で簡単に作れるレシピにすること
- 材料・手順・ポイントを含めること
- 日本語で回答すること
"""

    client = anthropic.Anthropic(api_key=api_key)
    message = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )
    return RecipeResponse(recipe=message.content[0].text)
