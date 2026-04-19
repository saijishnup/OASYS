# OASYS - Multi-Vertical Analytics Platform

OASYS is a comprehensive analytics platform designed to provide unified insights across multiple business verticals. The system consolidates data from Automobiles, Real Estate, Telecom, Logistics, Energy, and FinTech sectors into a single, cohesive dashboard.

## Overview

OASYS delivers real-time analytics, reporting, and data management capabilities across diverse business segments. The platform is built with a modern tech stack using React for the frontend, Express.js for the backend, and MySQL for data persistence.

## Project Structure

```
OASYS/
├── backend/
│   ├── db/
│   │   └── connection.js           # MySQL connection pool with fallback logic
│   ├── middleware/
│   │   └── auth.middleware.js      # JWT-based authentication middleware
│   ├── routes/
│   │   ├── auth.js                 # Authentication endpoints
│   │   ├── automobiles.js          # Automobiles vertical endpoints
│   │   ├── dashboard.js            # Dashboard data aggregation
│   │   ├── energy.js               # Energy sector endpoints
│   │   ├── fintech.js              # Financial technology endpoints
│   │   ├── logistics.js            # Logistics vertical endpoints
│   │   ├── realestate.js           # Real estate vertical endpoints
│   │   └── telecom.js              # Telecom vertical endpoints
│   ├── sql/
│   │   ├── 01_schema.sql           # Database schema definitions
│   │   ├── 02_seed.sql             # Initial data seeding
│   │   ├── 03_procedures.sql       # Stored procedures
│   │   ├── 04_triggers.sql         # Database triggers
│   │   └── 05_backfill.sql         # Data backfill
│   ├── package.json                # Backend dependencies
│   ├── server.js                   # Express server entry point
│   └── .env                        # Environment variables (git ignored)
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js            # Axios instance with environment-based URL
│   │   ├── components/
│   │   │   ├── BarChart.jsx        # Bar chart visualization
│   │   │   ├── ChartWrapper.jsx    # Chart container component
│   │   │   ├── DataTable.jsx       # Data table display component
│   │   │   ├── LineChart.jsx       # Line chart visualization
│   │   │   ├── Navbar.jsx          # Top navigation bar
│   │   │   ├── PrivateRoute.jsx    # Protected route wrapper
│   │   │   ├── ReportDownload.jsx  # Report export functionality
│   │   │   ├── Sidebar.jsx         # Side navigation menu
│   │   │   └── StatCard.jsx        # Statistics card component
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global authentication state
│   │   ├── pages/
│   │   │   ├── Automobiles.jsx     # Automobiles analytics page
│   │   │   ├── Dashboard.jsx       # Main dashboard page
│   │   │   ├── Energy.jsx          # Energy analytics page
│   │   │   ├── Fintech.jsx         # Financial tech analytics page
│   │   │   ├── Login.jsx           # Authentication page
│   │   │   ├── Logistics.jsx       # Logistics analytics page
│   │   │   ├── Logs.jsx            # System logs page
│   │   │   ├── MonthlyReport.jsx   # Monthly report generation
│   │   │   ├── Orders.jsx          # Orders management page
│   │   │   ├── Products.jsx        # Products listing page
│   │   │   ├── RealEstate.jsx      # Real estate analytics page
│   │   │   ├── Segments.jsx        # Customer segments page
│   │   │   ├── Telecom.jsx         # Telecom analytics page
│   │   │   └── Users.jsx           # User management page
│   │   ├── App.jsx                 # Main app component with routing
│   │   ├── index.css               # Tailwind CSS directives
│   │   └── main.jsx                # React DOM entry point
│   ├── index.html                  # HTML template
│   ├── package.json                # Frontend dependencies
│   ├── postcss.config.cjs          # PostCSS configuration
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   ├── vite.config.js              # Vite bundler configuration
│   └── .env                        # Environment variables (git ignored)
│
├── .gitignore                      # Git ignore patterns
└── README.md                       # Project documentation
```

## Technology Stack

**Backend:**
- Node.js v24.15.0
- Express.js 4.22.1
- MySQL2/Promise 3.22.1
- CORS enabled
- Environment configuration via dotenv

**Frontend:**
- React 18.3.1
- React Router DOM 6.28.0
- Vite 5.4.10
- Tailwind CSS 3.4.19
- Lucide React 0.468.0 (icons)
- React Hot Toast 2.4.1 (notifications)

**Database:**
- MySQL 8.0+
- Connection pooling with fallback mechanisms

## Installation & Setup

### Prerequisites

- Node.js v20+ 
- MySQL Server v8.0+
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your database credentials
# Required variables:
# PORT=5001
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=oasys_db
# DB_PORT=3306
# ADMIN_USERNAME=admin
# ADMIN_PASSWORD=admin123
```

4. Create database and tables:
```bash
# Connect to MySQL and run the schema scripts
mysql -u root -p oasys_db < sql/01_schema.sql
mysql -u root -p oasys_db < sql/02_seed.sql
mysql -u root -p oasys_db < sql/03_procedures.sql
mysql -u root -p oasys_db < sql/04_triggers.sql
mysql -u root -p oasys_db < sql/05_curl http://localhost:5001/       # Backend health check
# Then open http://localhost:5174 in browserbackfill.sql
```

5. Start the development server:
```bash
npm run dev
```

The backend will run on http://localhost:5001

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy the example file
cp .env.example .env

# Edit .env with backend URL
# VITE_API_BASE=http://localhost:5001/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:5174 (or next available port if 5174 is in use)

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Once both servers are running, open your browser and navigate to http://localhost:5174

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
# Output: dist/ folder ready for deployment
```

**Backend:**
Ensure all environment variables are properly set for your production environment, then:
```bash
cd backend
npm start
```

## Authentication

The application uses token-based authentication with the following default credentials:

- Username: `admin`
- Password: `admin123`

These credentials are configured in the backend `.env` file and should be changed in production.

Tokens are stored in browser localStorage as `oasys_token` and are automatically included in all API requests.

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- GET `/api/auth/verify` - Verify token validity

### Dashboard
- GET `/api/dashboard/summary` - Dashboard summary statistics
- GET `/api/dashboard/metrics` - Key metrics and KPIs

### Verticals
- GET `/api/automobiles/*` - Automobiles data endpoints
- GET `/api/realestate/*` - Real estate data endpoints
- GET `/api/telecom/*` - Telecom data endpoints
- GET `/api/logistics/*` - Logistics data endpoints
- GET `/api/energy/*` - Energy data endpoints
- GET `/api/fintech/*` - FinTech data endpoints

All protected endpoints require valid authentication token in Authorization header:
```
Authorization: Bearer <token>
```

## Database Connection

The backend implements intelligent database connection management with fallback logic:

1. Primary: Uses environment-configured host and password
2. Fallback 1: Uses environment host with empty password
3. Fallback 2: Uses 127.0.0.1 with environment password
4. Fallback 3: Uses 127.0.0.1 with empty password

This ensures connectivity even in various MySQL configuration scenarios.

## Environment Variables

### Backend (.env)
```
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=oasys_db
DB_PORT=3306
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### Frontend (.env)
```
VITE_API_BASE=http://localhost:5001/api
```

## Git Workflow

The project uses Git for version control:

```bash
# Check current branch
git branch -a

# View commit history
git log --oneline

# View remote configuration
git remote -v

# Add changes and commit
git add .
git commit -m "Your message"

# Push to master branch
git push origin master
```

## Performance Considerations

- Database connection pooling (max 10 connections)
- Vite for optimized frontend builds
- Tailwind CSS for efficient styling
- Responsive design for all screen sizes
- Fallback mechanisms for robust database connections

## Troubleshooting

**Backend won't start:**
- Ensure MySQL is running and credentials are correct
- Check PORT 5001 is not in use: `lsof -i :5001`
- Verify database exists: `CREATE DATABASE oasys_db;`

**Frontend won't connect to backend:**
- Verify VITE_API_BASE in frontend/.env is correct
- Ensure backend is running on configured port
- Check browser console for CORS errors

**Database connection fails:**
- Test connection: `mysql -u root -p -h localhost`
- Verify database user has all privileges
- Check MySQL service is running

## License

This project is provided as-is for development and educational purposes.

## Support

For issues, questions, or contributions, please refer to project documentation or contact the development team.

## Project Status

Current Status: Production Ready
Last Updated: April 2026
Version: 1.0.0
