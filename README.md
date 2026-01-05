
# JewelFlow CRM

A sophisticated lead management CRM designed for high-end jewelry retail, featuring AI-powered lead scoring and history tracking.

## 🚀 GitHub Deployment Instructions

### 1. Create a New Repository
- Go to [GitHub](https://github.com/new) and create a new repository named `jewelflow-crm`.

### 2. Push to GitHub
Open your terminal in this project folder and run:
```bash
git init
git add .
git commit -m "Initial commit: JewelFlow CRM"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jewelflow-crm.git
git push -u origin main
```

### 3. Setup GitHub Pages
1. Go to your repository on GitHub.
2. Click **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. GitHub will suggest a "Static HTML" or "Vite" workflow. Choose the **Static HTML** or create a custom one using the Vite template.

### 4. Configure API Key
Since this app uses the Gemini API, you must handle the `API_KEY`.
- **For Local Development**: Create a `.env` file with `VITE_GEMINI_API_KEY=your_key`.
- **For Production**: In a real production app, you should proxy these requests through a backend. For a quick demo on GitHub Pages, you can modify `geminiService.ts` to accept a key via a Settings UI in the app.

## 🛠 Tech Stack
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: Google Gemini API (@google/genai)
- **Charts**: Recharts
