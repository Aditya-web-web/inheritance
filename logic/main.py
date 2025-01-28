import os
from pymongo import MongoClient
from bson import ObjectId
import pytesseract
from PIL import Image
from langchain.text_splitter import CharacterTextSplitter
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms.huggingface_hub import HuggingFaceHub
from langchain.chains.question_answering import load_qa_chain
from datetime import datetime
import sys
import re
from dotenv import load_dotenv
import pandas as pd
from sklearn import externals
import joblib

load_dotenv(dotenv_path='../backend/.env')

HUGGINGFACEHUB_API_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")
MONGODB_URI = os.getenv("MONGODB_URI").replace("<db_name>", "maininfodb")

client = MongoClient(MONGODB_URI)
database1 = client["maininfodb"]
collection1 = database1["maininfos"]

username = sys.argv[1]
user_id = sys.argv[2]

user_data = collection1.find_one({"_id": ObjectId(f"{user_id}")})

if user_data:
    print("Document found.")
else:
    print("Document not found.")

income = user_data["income"]
qualification = user_data["qualification"]
dependents = user_data["dependents"]
assets = user_data["assets"]
city = user_data["city"]
debt = user_data["debt"]

images_path = [user_data["aadhaar"], user_data["loan"], user_data["insurance"]]

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
llm = HuggingFaceHub(repo_id="google/flan-t5-base", model_kwargs={"temperature": 0, "max_length": 512})
chain = load_qa_chain(llm, chain_type="stuff")

# aadhaarImage extraction

aadhaar_image = Image.open(images_path[0])
aadhaar_image_text = pytesseract.image_to_string(aadhaar_image)
aadhaar_text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
aadhaar_docs = aadhaar_text_splitter.split_text(aadhaar_image_text)
aadhaar_db = FAISS.from_texts(aadhaar_docs, embeddings)
aadhaar_query = "What is the date of birth of the person ?"
aadhaar_doc_results = aadhaar_db.similarity_search(aadhaar_query)
date_of_birth = chain.run(input_documents=aadhaar_doc_results, question=aadhaar_query)

def calculate_age(date_of_birth):
    today = datetime.today()
    age = today.year - date_of_birth.year
    
    if today.month < date_of_birth.month or (today.month == date_of_birth.month and today.day < date_of_birth.day):
        age -= 1
    
    return age

date = int(date_of_birth[:2])
month = int(date_of_birth[3:5])
year = int(date_of_birth[6:10])
dob = datetime(year, month, date)

age = calculate_age(dob)

# loan statement extraction / analysis

loan_image = Image.open(images_path[1])
loan_image_text = pytesseract.image_to_string(loan_image)

def count_late_payments(text):
    matches = re.findall(r"(late payment|missed payment|late fee|installment missed|missed installment|missed installments|installments missed)", text, re.IGNORECASE)
    return len(matches)

def count_overdrafts(text):
    matches= re.findall(r"(overdraft fee|bounced check)", text, re.IGNORECASE)
    return len(matches)

def analyze_statement(raw_text):
    late_payments = int(count_late_payments(raw_text))
    outstanding_balance = int(count_overdrafts(raw_text))

    result = late_payments + outstanding_balance

    return result


loan_result = analyze_statement(loan_image_text)


# insurance statement extraction / analysis

insurance_image = Image.open(images_path[2])
insurance_image_text = pytesseract.image_to_string(insurance_image)

insurance_result = analyze_statement(insurance_image_text)

loan = loan_result
insurance = insurance_result

# Display the DataFrame

data = {
    'Income': [income],
    'Education': [qualification],
    'Total No. of Dependents': [dependents],
    'Total Assets': [assets],
    'City Tier': [city],
    'Debt': [debt],
    'Age': [age],
    'Late Payments': [loan],
    'Installments Missed': [insurance]
}
pd.set_option('display.max_columns', None)
pd.set_option('display.max_rows', None)

df = pd.DataFrame(data)

def new_record(df):
  bins0 = [0, 100000, 500000, 1000000, 2500000, float('inf')]
  scores0 = [700, 600, 500, 400, 300]
  bins1 = [0, 200000, 1000000, 5000000, 10000000, float('inf')]
  scores1 = [300, 400, 500, 600, 700]
  bins2 = [0, 300000, 600000, 1200000, 2500000, float('inf')]
  scores2 = [300, 400, 500, 600, 700]
  def map_education(education):
    if "PhD" in education:
        return 700
    elif "Master" in education:
        return 600
    elif "Bachelor" in education:
        return 500
    elif "Diploma" in education:
        return 400
    elif "High School" in education:
        return 300
    else:
        return 0
  def map_Installments(installments):
    if installments==0:
      return 700
    elif installments==1:
      return 600
    elif installments==2:
      return 500
    elif installments==3:
      return 400
    else:
      return 300
  def map_late(late):
    if late==0:
      return 700
    elif late==1:
      return 600
    elif late==2:
      return 500
    elif late==3:
      return 400
    else:
      return 300
  bins3 = [0,18, 25, 35, 50, 65, float('inf')]
  scores3 = [0, 300, 400, 500, 400, 300]
  def map_CityTier(tier):
    if tier=="Tier_1":
        return 500
    elif tier=="Tier_2":
        return 400
    elif tier=="Tier_3":
        return 300
  def map_Dependents(dep):
    if dep==0:
      return 650
    elif dep==1:
      return 600
    elif dep==2:
      return 550
    elif dep==3:
      return 500
    elif dep==4:
      return 450
    elif dep==5:
      return 400
    elif dep==6:
      return 350
    elif dep==7:
      return 300
  df['Debts_lvl'] = pd.cut(df['Debt'], bins=bins0, labels=scores0, right=True)
  df['Education_lvl'] = df['Education'].apply(map_education)
  df['Installments_lvl'] = df['Installments Missed'].apply(map_Installments)
  df['Assets_lvl'] = pd.cut(df['Total Assets'], bins=bins1, labels=scores1, right=True)
  df['Income_lvl'] = pd.cut(df['Income'], bins=bins2, labels=scores2, right=True)
  df['City_lvl'] = df['City Tier'].apply(map_CityTier)
  df['Age_lvl'] = pd.cut(df['Age'], bins=bins3, labels=scores3, right=True, ordered=False)
  df['Late_lvl'] = df['Late Payments'].apply(map_late)
  df['Dep_lvl'] = df['Total No. of Dependents'].apply(map_Dependents)

new_record(df)

print(df)

# Get the directory where the current script is located
current_dir = os.path.dirname(os.path.realpath(__file__))

# Construct the full path to the model file
model_path = os.path.join(current_dir, 'creditmodel_final.joblib')

# Load the model
with open(model_path, 'rb') as file:
    credit_model = joblib.load(file)
    
latest_record = df.iloc[[-1]]

score = credit_model.predict(latest_record[['Income_lvl','Age_lvl','Dep_lvl','Debts_lvl','Education_lvl','Assets_lvl','City_lvl','Installments_lvl','Late_lvl']])
print(score)

credit_score = round(score[0])


database2 = client["usercreditscoresdb"]
collection2 = database2["usercreditscores"]

save_credit_score_data = {
    "username": username,
    "id":user_id,
    "date": datetime.now(),
    "creditscore": int(credit_score),
    "income_lvl": int(df['Income_lvl'].iloc[0]),
    "age_lvl": int(df['Age_lvl'].iloc[0]),
    "dep_lvl": int(df['Dep_lvl'].iloc[0]),
    "debts_lvl": int(df['Debts_lvl'].iloc[0]),
    "education_lvl": int(df['Education_lvl'].iloc[0]),
    "assets_lvl": int(df['Assets_lvl'].iloc[0]),
    "city_lvl": int(df['City_lvl'].iloc[0]),
    "installments_lvl": int(df['Installments_lvl'].iloc[0]),
    "late_lvl": int(df['Late_lvl'].iloc[0])
}

save_credit_score = collection2.insert_one(save_credit_score_data)