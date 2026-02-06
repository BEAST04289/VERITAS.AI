import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ No API Key found in .env")
    exit(1)

genai.configure(api_key=api_key)

print(f"✅ API Key found: {api_key[:5]}...{api_key[-5:]}")
print("Checking available models...")

try:
    models = list(genai.list_models())
    found_any = False
    for m in models:
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
            found_any = True
            
    if not found_any:
        print("❌ No models found that support generateContent.")
    else:
        print("\n✅ Found valid models! Please use one of the names above in main.py")
        
except Exception as e:
    print(f"❌ Error listing models: {e}")
