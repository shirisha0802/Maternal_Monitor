from pydantic import BaseModel

class MaternalData(BaseModel):
    patient_id: int

    # Risk model inputs
    age: int
    systolicBP: int
    diastolicBP: int
    BS: float
    bodyTemp: float
    heartRate: int

    # Nutrient model inputs
    bmi: float
    hb: float
    dietScore: float
    protein_g: float
    calcium_mg: float
    iron_mg: float