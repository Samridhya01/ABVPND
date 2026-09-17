# ABVP – Narasimha Datta College Unit Digital Platform

Official digital student portal and membership system for **Akhil Bharatiya Vidyarthi Parishad (ABVP) – Narasimha Datta College Unit, Howrah, West Bengal** (affiliated with University of Calcutta).

---

## 🚀 How to Deploy to Vercel (Step-by-Step)

This repository is already configured with `vercel.json` and Vercel Serverless Functions (`/api/chat.ts`, `/api/health.ts`).

### Step 1: Push / Export to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Push your project files to your GitHub repository (or use the GitHub Export feature in Google AI Studio).

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** -> **Project**.
3. Under **Import Git Repository**, select your GitHub repository and click **Import**.

### Step 3: Configure Build & Output Settings
Vercel will detect Vite automatically via the included `vercel.json`:
- **Framework Preset:** `Vite`
- **Root Directory:** `./`
- **Build Command:** `vite build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 4: Add Environment Variables (Optional for AI Chatbot)
In the Vercel project configuration page before clicking Deploy (or later in **Project Settings > Environment Variables**):
- **Key:** `GEMINI_API_KEY`
- **Value:** *Your Google Gemini API Key* (from [aistudio.google.com](https://aistudio.google.com/app/apikey))

*(Note: If you do not provide an API key, the chatbot will automatically run in smart offline mode with preloaded campus answers).*

### Step 5: Click Deploy
Click **Deploy**. In under 60 seconds, Vercel will build your website and give you a live production URL:
`https://your-project-name.vercel.app`

---

## 🌐 Setting Up a Custom Domain (Ready for Real Operation)
To give your college unit a professional domain (e.g., `abvpndc.org` or `ndcabvp.in`):
1. In your Vercel Dashboard, navigate to **Settings** > **Domains**.
2. Enter your custom domain name and click **Add**.
3. Update your domain DNS records (CNAME / A record) at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) as instructed by Vercel.
4. Vercel automatically provisions a free **SSL Certificate (HTTPS)** for your domain.

---

## ⚙️ Operational Guide for Unit Leaders & Admins

### 1. Admin Portal Access
- Click the **Admin** button in the header navigation or footer.
- Default Master PIN: **`2026`** (can be updated inside Admin Settings).

### 2. Managing Student Memberships (₹5 Drive)
- Students fill in their details (Name, Phone, Semester, Stream, Address), pay ₹5 via UPI QR code, and upload payment confirmation.
- Admins can review, verify payment screenshots, approve, and export the membership list directly to Excel/CSV.
- Students receive an instant digital **ABVP Student Membership ID Card** with a QR code.

### 3. Student Help Desk & Grievance Tickets
- Students can submit admission, exam form fill-up, or scholarship issues and receive a tracking ticket code (e.g. `TKT-2026-XXXX`).
- Admins can respond to inquiries, update ticket status, and resolve issues.

### 4. Updating Notices & Events
- Publish Calcutta University exam schedules, syllabus circulars, and college events in real-time from the Admin dashboard.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Lint code
npm run lint

# Build for production
npm run build
```
