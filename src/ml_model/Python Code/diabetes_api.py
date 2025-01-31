from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import json

app = FastAPI()

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin; restrict for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ModelInput(BaseModel):
    Pregnancies: int
    Glucose: int
    BloodPressure: int
    SkinThickness: int
    Insulin: int
    BMI: float
    DiabetesPedigreeFunction: float
    Age: int

# Load the saved model
diabetes_model = pickle.load(open('diabetes_model.sav', 'rb'))

@app.post('/diabetes_prediction')
def diabetes_prediction(input_parameters: ModelInput):
    # Parse input data
    input_data = input_parameters.json()
    input_dictionary = json.loads(input_data)

    # Prepare the input list
    input_list = [
        input_dictionary['Pregnancies'],
        input_dictionary['Glucose'],
        input_dictionary['BloodPressure'],
        input_dictionary['SkinThickness'],
        input_dictionary['Insulin'],
        input_dictionary['BMI'],
        input_dictionary['DiabetesPedigreeFunction'],
        input_dictionary['Age']
    ]

    # Make prediction
    prediction = diabetes_model.predict([input_list])

    if prediction[0] == 0:
        return {"result": "The person is not Diabetic"}
    else:
        return {"result": "The person is Diabetic"}
