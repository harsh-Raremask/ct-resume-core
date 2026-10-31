# CT Core-chatbot — AI Resume Coach

CT Core-chatbot is a Flask-based AI Resume Coach with a clean sky blue and white two-panel UI and uses the **same Groq model** as the source project: `openai/gpt-oss-120b`.

## Features
- Upload a resume as PDF, DOCX or TXT.
- Compare a resume with a target role and job description.
- View a transparent keyword-coverage estimate plus AI feedback and improvement ideas.
- Ask natural-language questions about resumes, jobs, skills and interviews.
- Generate a practical career roadmap through chat.
- Save chat history in SQLite and export a conversation to PDF.

## 1. Install Python
Use Python 3.10 or newer.

## 2. Create and activate a virtual environment (recommended)
Windows:
```powershell
python -m venv venv
.\venv\Scripts\activate
```

## 3. Install packages
```powershell
pip install -r requirements.txt
```

## 4. Add your API key
In the project root, create a file named `.env` (same folder as `app.py`). Copy the content of `.env.example` into it and replace the placeholder:
```env
GROQ_API_KEY=your_actual_groq_api_key
```
Get a key from https://console.groq.com/keys. Do not add quotes unless your key provider specifically requires them. Never upload `.env` to GitHub or share it.

## 5. Run the app
```powershell
python app.py
```
Open http://127.0.0.1:5000 in your browser.

## How the ATS estimate works
The percentage shown is a simple literal keyword-coverage estimate from the job description, not a score returned by an employer's ATS. The AI feedback separately reviews relevance, missing requirements, resume wording and formatting. Different employers use different ATS products and rules, so no score can guarantee selection.

## Notes
- Scanned/image-only PDFs may not contain selectable text and may need OCR before upload.
- The app currently stores the latest uploaded resume and chat history locally in `resume_coach.db`; uploaded resumes are stored in `resumes/`.
- Keep `.env`, `resume_coach.db`, and personal resume files private.
