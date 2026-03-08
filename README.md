# Smart Job Tracker

A modern job application tracking system that automatically syncs with your Gmail to track application statuses. Built with Next.js (client) and Node.js (server), featuring AI-powered resume analysis using Hugging Face.

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB database
- Gmail account with API access
- Hugging Face API key
- npm or yarn package manager

## 🚦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Fuadseid/Smart-Job-racker.git
cd Smart-Job-racker
```

### 2. Server Setup (Backend)

Navigate to the server directory:
```bash
cd Server
npm install
```

Create a `.env` file in the server directory:
```env
DB_CONNECTION=mongodb://localhost:27017/smart-job-tracker
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
ACCESS_TOKEN_EXPIRY=30
REFRESH_TOKEN_EXPIRY=30
MAX_ATTEMPT_IP_USERNAME=10
MAX_ATTEMPT_PER_DAY=100
MAX_ATTEMPT_EMAIL_PER_DAY=50
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALL_BACK=http://localhost:5000/api/auth/google/callback
HF_API_KEY=your_huggingface_api_key
```

Start the server:
```bash
npm run dev
```
The server will run on `http://localhost:5000`

### 3. Client Setup (Frontend)

Navigate to the client directory:
```bash
cd ../Client
# or if in root directory
cd Client
```

Install dependencies:
```bash
npm install
# or
yarn install
```

Run the client development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

### Client (Frontend)
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Redux Toolkit with RTK Query
- **API Calls**: RTK Query (built-in)

### Server (Backend)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Passport.js (Google OAuth)
- **Email Integration**: Nodemailer with Gmail
- **AI/ML**: Hugging Face Inference API (Resume Analysis)
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Validation**: Joi

## 📁 Project Structure

```
Project-001/
├── Client/                          # Frontend application
│   ├── public/                      # Static assets
│   │   ├── dashboard.jpg
│   │   ├── logo-dark.png
│   │   ├── logo-light.jpg
│   │   └── ...
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   │   ├── button.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── input.jsx
│   │   │   │   └── ...
│   │   │   ├── app-sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── login-form.jsx
│   │   │   ├── signup-form.jsx
│   │   │   └── ...
│   │   ├── hooks/                   # Custom React hooks
│   │   │   └── use-mobile.js
│   │   ├── lib/                     # Utility functions
│   │   │   └── utils.js
│   │   ├── pagecomponents/          # Page-level components
│   │   │   ├── Applications.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── ...
│   │   ├── pages/                   # Next.js pages (Pages Router)
│   │   │   ├── about/
│   │   │   ├── api/
│   │   │   ├── contact/
│   │   │   ├── dashboard/           # Dashboard routes
│   │   │   │   ├── account/         # Account management
│   │   │   │   ├── applications/    # Job applications
│   │   │   │   ├── insights/        # Analytics and insights
│   │   │   │   ├── interviews/      # Interview tracking
│   │   │   │   ├── offers/          # Offer management
│   │   │   │   ├── saved-jobs/      # Saved jobs
│   │   │   │   ├── tools/           # Resume, cover letters
│   │   │   │   │   ├── resume/      # Resume analysis
│   │   │   │   │   └── ...
│   │   │   │   ├── tracking/        # Activity tracking
│   │   │   │   └── index.jsx
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── policy/
│   │   │   ├── terms/
│   │   │   └── index.js
│   │   ├── store/                    # Redux store
│   │   │   ├── endPoints/            # RTK Query endpoints
│   │   │   │   ├── authenticationEndpoints.js
│   │   │   │   ├── contactEndpoints.js
│   │   │   │   ├── jobsEndpoints.js
│   │   │   │   └── resumeEndpoints.js
│   │   │   ├── apiSlice.ts
│   │   │   ├── authReducer.ts
│   │   │   └── store.ts
│   │   ├── styles/                   # Global styles
│   │   │   └── globals.css
│   │   └── wrapper/                  # Layout wrapper
│   │       └── index.jsx
│   ├── .gitignore
│   ├── next.config.mjs                # Next.js configuration
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── tailwind.config.js             # Tailwind CSS configuration
│   └── ...
│
├── Server/                            # Backend application
│   ├── configs/                       # Configuration files
│   │   ├── config.js
│   │   ├── passport-google.js
│   │   ├── passport-jwt.js
│   │   ├── passport.js
│   │   └── token.js
│   ├── controllers/                   # Route controllers
│   │   ├── auth.controller.js
│   │   ├── contact.controller.js
│   │   ├── job.controller.js
│   │   ├── resumeController.js        # Resume analysis controller
│   │   └── user.controller.js
│   ├── middleware/                    # Custom middleware
│   │   ├── auth.js
│   │   └── upload.js                  # File upload for resumes
│   ├── models/                        # MongoDB models
│   │   ├── contact.models.js
│   │   ├── job.models.js
│   │   ├── JobActivities.js
│   │   ├── savedJob.models.js
│   │   ├── token.model.js
│   │   └── user.model.js
│   ├── routes/                         # API routes
│   │   ├── api.route.js
│   │   ├── auth.route.js
│   │   └── main.route.js
│   ├── services/                        # Business logic
│   │   ├── auth.service.js
│   │   ├── contact.service.js
│   │   ├── job.service.js
│   │   ├── jobActivity.service.js
│   │   ├── token.service.js
│   │   └── user.service.js
│   ├── utils/                           # Helper functions
│   │   ├── analyze.js                   # AI resume analysis
│   │   ├── ApiError.js
│   │   ├── email-transporter.js
│   │   └── read-emails.js
│   ├── validation/                       # Input validation
│   │   └── envvarschema.validation.js
│   ├── .env                              # Server environment variables
│   ├── app.js
│   ├── server.js                         # Entry point
│   └── package.json
│
└── README.md
```

## 🔑 Server Environment Variables (.env)

```env
DB_CONNECTION=mongodb://localhost:27017/smart-job-tracker
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
ACCESS_TOKEN_EXPIRY=30
REFRESH_TOKEN_EXPIRY=30
MAX_ATTEMPT_IP_USERNAME=10
MAX_ATTEMPT_PER_DAY=100
MAX_ATTEMPT_EMAIL_PER_DAY=50
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALL_BACK=http://localhost:5000/api/auth/google/callback
HF_API_KEY=your_huggingface_api_key
```

## ✨ Features

### 📊 Application Management
- **Complete CRUD Operations**: Add, edit, delete, and track all your job applications
- **Status Tracking**: Monitor applications through stages: Applied → Interview → Offer → Rejected
- **Rich Application Details**: Store position, company, location, salary range, job URL, notes, and follow-up dates
- **Dual View Modes**: Switch between card and list views
- **Advanced Filtering**: Filter by status, search by position, company, or location

### 🤖 AI-Powered Resume Analysis
- **Resume Upload**: Upload your resume in PDF or DOCX format
- **AI Analysis**: Hugging Face AI analyzes resume content
- **Skills Extraction**: Automatically extract skills and qualifications
- **Improvement Suggestions**: Get AI-powered recommendations to improve your resume

### 📱 Specialized Views
- **All Applications**: Master view with complete control
- **Saved Jobs**: Quick access to jobs saved for later
- **Interviewed Jobs**: Dedicated view for applications with interviews
- **Offered Jobs**: Focus on positions with offers
- **Insights & Analytics**: Track your job search progress
- **Resume Tools**: Upload and analyze your resume

### 🎨 Modern UI/UX
- **Responsive Design**: Works on all devices
- **Dark Theme**: Eye-friendly dark mode with gradient accents
- **Smooth Animations**: Framer Motion powered transitions
- **Toast Notifications**: Real-time feedback with Sonner

## 🚀 Running the Application

1. **Start the Server** (from Server directory):
   ```bash
   npm run dev
   ```

2. **Start the Client** (from Client directory):
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📧 Contact

Fuad Seid - fuaddbus@gmail.com

Project Link: [https://github.com/Fuadseid/Smart-Job-racker](https://github.com/Fuadseid/Smart-Job-racker)


