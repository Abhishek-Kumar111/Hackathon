# app.py (Flask API)
from flask import Flask, request, jsonify
from flask_cors import CORS 
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.neighbors import NearestNeighbors
from sklearn.pipeline import Pipeline

categorical_columns = [
    'gender', 'occupation', 'education_level', 'marital_status', 
    'income_level', 'coping_mechanisms', 'physical_activity', 
]

numerical_columns = [
   'age',  'sleep_hours', 'stress_levels'
]
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_columns),
        ('cat', OneHotEncoder(drop='first'), categorical_columns)
    ]
)
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('model', NearestNeighbors(n_neighbors=5, algorithm='auto'))
])
pipeline = joblib.load('model.pkl')
preprocessor=joblib.load('preprocessor.pkl')
df=pd.read_csv('synthetic_mental_health_data_correlated.csv')

app = Flask(__name__)
CORS(app, resources={r"/recommend": {"origins": "http://localhost:5500"}})


@app.route('/recommend', methods=['POST'])
def recommend():
    user_data = {"age":20,
    "gender":"male",
    "occupation":"employed", 
    "education_level":"Bachelor", 
    "marital_status":"single", 
    "income_level":"Medium", 
    "coping_mechanisms":"exercise", 
    "physical_activity":"moderate", 
    "sleep_hours":6.2, 
    "stress_levels":5.55}
    print("Request received")
    
    user_df = pd.DataFrame([user_data])
    print(f"User Data: {user_data}")

    for col in numerical_columns:
        user_df[col] = pd.to_numeric(user_df[col], errors='coerce')
    
    user_df = user_df.dropna(subset=numerical_columns)  
    user_df = user_df.fillna('Unknown')  
    
    for col in categorical_columns:
        user_df[col] = user_df[col].astype(str)

   
    user_transformed = pipeline.named_steps['preprocessor'].transform(user_df)

  
    distances, indices = pipeline.named_steps['model'].kneighbors(user_transformed)
    

    recommended_users = df.iloc[indices[0]].head(2)

    recommendations = recommended_users.to_dict(orient='records')
    response = {
        "recommendations": recommendations
    }
    
    return jsonify(response)
# Running Flask app
if __name__ == '__main__':
    app.run(debug=True)