# Golf Charity Subscription Platform

A subscription-based golf platform combining performance tracking, 
monthly prize draws, and charitable giving. Built as a full-stack 
assignment for Digital Heroes.

---

## Live Demo

- **Frontend:** [https://golf-charity-platform-gold.vercel.app]
- **Backend:** [https://golf-charity-platform-uqbe.onrender.com]
- **Database:** [https://iyxevrrwcyoncopnpked.supabase.co]
- **github:** [https://github.com/NNIIKKKKII/Golf_Charity_Platform]
---

## Test Credentials

**Subscriber Account**
- Email: [EMAIL_ADDRESS]
- Password: [PASSWORD]

**Admin Account**
- Email: digitalheroesadmin@gmail.com
- Password: dgheroesadmin

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + JWT |
| Payments | Stripe (see note below) |
| Email | Nodemailer + Gmail SMTP |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Features Built

### Auth
- Signup and login with Supabase Auth + JWT
- Role-based access (subscriber / admin)
- Protected and admin-only routes
- Auto profile creation on signup via Supabase trigger

### Subscription System
- Monthly and yearly plan support
- Stripe integration fully implemented and production-ready
- Mock subscription route included for demo/testing purposes

> **Note on Stripe:** Stripe is currently available in India 
> by invite only for new accounts. The full Stripe integration 
> is correctly implemented in `server/src/controllers/subscriptionController.js` 
> including checkout session creation, webhook handling for 
> subscription lifecycle events (created, updated, cancelled), 
> and subscription status validation on every authenticated request. 
> A mock subscription endpoint (`POST /api/subscription/mock-subscribe`) 
> has been added to demonstrate the full platform flow during evaluation. 
> This would be replaced with live Stripe once access is available.

### Score Management
- Enter last 5 Stableford scores (range 1-45)
- Rolling logic — 6th score auto-removes oldest
- Edit existing scores
- Displayed in reverse chronological order

### Charity System
- Public charity directory with search
- Featured charity spotlight
- User selects charity at signup
- Minimum 10% contribution, user can increase up to 100%
- Admin can add, edit, and soft-delete charities

### Draw Engine
- Monthly draws with random or algorithmic number generation
- Algorithmic mode weighted by most frequent user scores
- Simulation mode before official publish
- 3-match, 4-match, 5-match prize tiers
- Prize pool: 40% / 35% / 25% split
- Jackpot rollover if no 5-match winner
- Multiple winners in same tier split prize equally

### Winner Verification
- Winner uploads screenshot proof
- Admin approves or rejects
- Payment status tracking: Pending → Paid

### User Dashboard
- Subscription status and renewal date
- Score entry and edit interface
- Charity selection and contribution percentage
- Winnings overview and payment status

### Admin Dashboard
- User management
- Draw configuration and execution
- Charity management
- Winner verification and payout tracking

### Email Notifications
- Welcome email on signup
- Draw results notification
- Winner verification confirmation
- Built with Nodemailer + Gmail SMTP App Password

---

## Project Structure
```
golf-charity-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/  # User dashboard sections
│   │   │   └── admin/      # Admin dashboard sections
│   │   ├── pages/          # Route-level pages
│   │   ├── store/          # Zustand state management
│   │   └── services/       # Axios API instance
└── server/                 # Express backend
    ├── src/
    │   ├── config/         # Supabase client, mailer
    │   ├── controllers/    # Business logic
    │   ├── middleware/     # Auth & Role middleware
    │   └── routes/         # API endpoints
```

---

## API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Subscription
- `POST /api/subscription/create-checkout`
- `POST /api/subscription/webhook`
- `GET /api/subscription/me`
- `POST /api/subscription/mock-subscribe` *(demo only)*

### Scores
- `POST /api/scores`
- `GET /api/scores/me`
- `PUT /api/scores/:id`

### Charities
- `GET /api/charities`
- `GET /api/charities/:id`
- `POST /api/charities` *(admin)*
- `PUT /api/charities/:id` *(admin)*
- `DELETE /api/charities/:id` *(admin)*
- `POST /api/charities/select`
- `GET /api/charities/my/selection`

### Draws
- `POST /api/draws/run` *(admin)*
- `GET /api/draws/all` *(admin)*
- `GET /api/draws/published`
- `GET /api/draws/my-history`

### Winners
- `GET /api/winners/my-winnings`
- `PUT /api/winners/:id/proof`
- `GET /api/winners/all` *(admin)*
- `PUT /api/winners/:id/verify` *(admin)*
- `PUT /api/winners/:id/pay` *(admin)*

### Admin
- `GET /api/admin/users` *(admin)*

---

## Environment Variables

### Backend (`server/.env`)
```
PORT=5000
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CLIENT_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_MONTHLY_PRICE_ID=
STRIPE_YEARLY_PRICE_ID=
EMAIL_USER=
EMAIL_PASS=
```

### Frontend (`client/.env`)
```
VITE_SUPABASE_URL=
VITE_API_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## Local Setup
```bash
# Clone the repo
git clone [your-repo-url]

# Backend
cd server
npm install
npm run dev

# Frontend (new terminal)
cd client
npm install
npm run dev
```

---

## Database

- Platform: Supabase (PostgreSQL)
- Fresh project created specifically for this assignment
- Schema includes: profiles, subscriptions, scores, charities,
  user_charities, draws, draw_entries, winners, prize_pools

---

## Deployment

- Frontend deployed on Vercel
- Backend deployed on Render
- Database on Supabase
- Environment variables configured separately on each platform

---

## Notes

- Stripe is fully implemented but uses a mock endpoint for demo
  due to India invite-only restriction
- Email notifications are implemented and tested
- All admin routes are protected with role-based middleware
- Supabase Row Level Security can be enabled for additional
  database-level protection in production

---

Built by Nikki for Digital Heroes Full-Stack Trainee Selection — March 2026