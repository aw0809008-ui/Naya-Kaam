# Naya Kaam (نیا کام) 🇵🇰🛠️

A modern, mobile-first **Skilled Worker Marketplace** in Pakistan that connects households and businesses with verified local kaarigars (Electricians, Plumbers, AC Technicians, Tailors, Tutors, Carpenters, Painters, Drivers, Makeup Artists, and more).

![Naya Kaam](https://img.shields.io/badge/Naya-Kaam-39E07A)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-green)

---

## ✨ Features

### 🔍 Skilled Worker Search & Smart Filters
- **Filter by Trade/Category**: Electricians, Plumbers, AC Technicians, Tailors, Tutors, Carpenters, Painters, Drivers, Home Cooks, Mehndi Artists, and Makeup Artists.
- **Location-Based Search**: Cities (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad) and neighborhood areas (Gulshan, DHA, F-8, Gulberg, etc.).
- **Sorting & Range Filters**: Minimum rating threshold, price ceiling, verified-only toggle, and keyword search.

### 🤖 AI-Powered Features (Gemini 2.5)
- **AI Urdu/English Voice & Text Search Assistant**: Parses natural language requests (e.g., *"Gulshan mein urgent inverter AC repair walar dhoondo"*) into structured category, city, and area filters.
- **AI Bio Generator for Kaarigars**: Automatically crafts professional, trustworthy bios in Roman Urdu/English for registering workers.
- **AI Review Trust Summaries**: Synthesizes customer reviews into concise trust highlights for provider profiles.

### 📱 In-App Calling & Real-Time Messaging (Privacy-First)
- **WebRTC Voice Calling**: Call providers directly within the app without exchanging personal phone numbers.
- **Booking Chat & Push Notifications**: In-app messaging per booking with FCM push notifications and system audio ringers.

### 🛡️ Safety, NADRA CNIC Verification & Security
- **NADRA CNIC Verification**: Workers upload front/back CNIC photos for admin verification before receiving public badges.
- **Bot Defense & Anti-Abuse**: CAPTCHA challenges during registration, device rate-limiting (max 5 bookings/day, 3 signups/hr), and platform anti-circumvention protections.
- **Dispute Resolution Console**: Formal complaint filing with evidence attachments and admin resolution workflow.

### 💼 Worker & Admin Dashboards
- **Dual View Role Switcher**: Seamlessly toggle between Customer and Worker view modes.
- **Worker Management**: Job requests acceptance/decline, active job status, rate updates, availability toggle, and earnings report.
- **Admin Control Center**: CNIC document verification queue, dispute resolution console, WebRTC call logs, platform revenue ledger (15% commission cut), and pre-launch health check diagnostic tool.

### 📲 Mobile-First PWA (Progressive Web App)
- **Installable** on iOS and Android devices as a native-like app.
- **Offline Capable**: Offline fallback page, local cache persistence, and service worker push handler.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Lucide React Icons
- **AI Engine**: Google GenAI SDK (`@google/genai` / Gemini 2.5 Flash)
- **Realtime & Cloud Data**: Firebase / Firestore & LocalStorage Sync Strategy
- **Calling**: In-App WebRTC Pipeline with Custom Ringtone Audio Synthesis

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aw0809008-ui/Naya-Kaam.git
   cd Naya-Kaam
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Directory Structure

```
Naya-Kaam/
├── public/
│   ├── icons/            # PWA icons (192x192, 512x512)
│   ├── manifest.json     # Web app manifest
│   ├── sw.js             # Service worker
│   └── offline.html      # Offline fallback
├── src/
│   ├── app/              # Next.js App Router routes
│   │   ├── (dashboard)/  # Protected customer/worker dashboards
│   │   ├── admin/        # Admin portal, disputes, health-check, calls
│   │   ├── api/ai/       # Gemini AI routes (bio, parse-search, summary)
│   │   ├── book/         # Direct worker booking flow
│   │   ├── worker/       # Worker public profile page
│   │   ├── search/       # Service search and filter directory
│   │   ├── worker-signup/# Kaarigar registration flow
│   │   └── terms/privacy # Legal policy pages
│   ├── components/       # Reusable React components & modals
│   │   ├── call/         # WebRTC overlay & incoming call modal
│   │   ├── ui/ font/     # UI primitives & CAPTCHA challenge
│   │   └── ...
│   └── lib/              # Utilities, store persistence, notifications, Firebase
```

---

## 📄 License

MIT License — feel free to adapt for local service marketplace projects.

---

**Naya Kaam** — *Connecting Pakistani households with trusted, verified kaarigars.* 🇵🇰✨
