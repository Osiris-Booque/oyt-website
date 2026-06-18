# Osiris Yoga Therapy

A full-stack web platform for a yoga therapy and wellness coaching business. The application serves as both a public-facing marketing site and a comprehensive internal platform for managing programs, enrollments, instructor scheduling, community engagement, and payments.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
  - [Public Marketing Site](#public-marketing-site)
  - [Offerings](#offerings)
  - [Member Dashboard](#member-dashboard)
  - [Instructor Portal](#instructor-portal)
  - [Admin Panel](#admin-panel)
- [Authentication & Authorization](#authentication--authorization)
- [Database Schema](#database-schema)
- [Edge Functions](#edge-functions)
- [Payments & Stripe Integration](#payments--stripe-integration)
- [Routing & Layouts](#routing--layouts)
- [Configuration System](#configuration-system)
- [Design System](#design-system)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)

---

## Overview

Osiris Yoga Therapy is built to support the full lifecycle of a wellness business:

- **Attract** clients through a polished marketing site with offerings, testimonials, and an approach philosophy
- **Convert** visitors into enrolled students via Stripe-powered checkout flows
- **Deliver** structured cohort programs with milestones, journaling prompts, daily homework, and live Zoom sessions
- **Engage** the community through a forum with posts, comments, and reactions, plus direct messaging between members and instructors
- **Manage** operations through an admin panel with user management, program editing, CSV imports, activity logging, and payment tracking
- **Schedule** 1:1 sessions through an instructor availability and booking system integrated with Google Calendar

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, React Router 7 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Backend | Supabase (PostgreSQL, Auth, Edge Functions, RLS) |
| Payments | Stripe (Elements, Payment Intents, Webhooks) |
| Calendar Sync | Google Calendar API |
| Linting | ESLint 9 with TypeScript and React plugins |

---

## Project Structure

```
src/
├── assets/                   # Static images and brand assets
├── components/
│   ├── admin/                # Admin layout and route protection
│   ├── checkout/             # Stripe payment form, purchase summary, payment link iframe
│   ├── context/              # AuthContext provider and type definitions
│   ├── dashboard/            # Member dashboard layout with sidebar navigation
│   ├── instructor/           # Instructor layout and route protection
│   ├── landing/              # Landing page sections (hero, offerings, approach, etc.)
│   ├── layout/               # Header and Footer shared across layouts
│   └── ui/                   # ProtectedRoute guard and LoadingSpinner
├── config/
│   ├── cta.ts                # Call-to-action button definitions
│   ├── header.ts             # Route-specific header configurations
│   ├── nav.ts                # Navigation item sets for each page context
│   └── personalization.ts    # Dynamic CTA resolution based on user context
├── layouts/                  # Page layout wrappers (Landing, Marketing, Offerings, etc.)
├── lib/
│   ├── constants.ts          # Roles, categories, reaction types, utility functions
│   ├── csvProgram.ts         # Program CSV import parser
│   ├── csvProgramExample.ts  # CSV format example for program imports
│   └── supabase.ts           # Supabase client singleton
├── pages/
│   ├── admin/                # Admin pages (overview, users, programs, editor, activity)
│   ├── checkout/             # Checkout and registration pages
│   ├── dashboard/            # Member pages (home, calendar, booking, community, etc.)
│   ├── instructor/           # Instructor pages (home, programs, calendar, availability)
│   └── offerings/            # Offerings hub, personal, team, Flow Series
└── router/
    ├── AppRouter.tsx          # Root router with all route groups
    ├── marketingRoutes.tsx    # Public pages
    ├── offeringsRoutes.tsx    # Offerings and checkout routes
    ├── dashboardRoutes.tsx    # Protected member routes
    ├── instructorRoutes.tsx   # Protected instructor routes
    └── adminRoutes.tsx        # Protected admin routes

supabase/
├── functions/
│   ├── admin-user-management/  # Create and delete users (admin-only)
│   ├── import-program-csv/     # Bulk import programs with milestones and prompts
│   ├── stripe-checkout/        # Create and confirm Stripe PaymentIntents
│   ├── stripe-webhook/         # Process Stripe webhook events
│   └── sync-google-calendar/   # Connect and sync Google Calendar availability
└── migrations/                 # 30+ database migration files
```

---

## Features

### Public Marketing Site

| Page | Path | Description |
|------|------|-------------|
| Landing | `/` | Hero, offerings showcase, approach, testimonials, about, and contact sections |
| Approach | `/approach` | Yoga therapy methodology: breathwork, meditation, conditioning |
| About | `/about` | Mission, values, team, and journey |
| Blog | `/blog` | Articles and wellness content |
| FAQ | `/faq` | Frequently asked questions |
| Contact | `/contact` | Contact form and business information |
| Site Map | `/sitemap` | Full navigation overview |
| Login | `/login` | Email/password authentication |
| Sign Up | `/signup` | New account registration |

### Offerings

The platform serves three categories of offerings:

**Flow Series (Cohort Programs)**
- Structured 8-week programs with bi-weekly live Zoom sessions
- Current offering: Spring 2026 "Career & Expansion" cohort
- Includes milestones, journaling prompts, daily homework, community access, and certificates
- Limited enrollment capacity

**Personal Offerings**
- 1:1 private sessions with instructors
- Live events and retreats
- Self-paced recorded programs

**Team Offerings**
- Government agency programs (resilience, burnout prevention, leadership)
- Corporate wellness (executive coaching, team mindfulness, quarterly immersion days)
- Community wellness (schools, nonprofits, trauma-informed programming)
- Delivery options: virtual, in-person, and hybrid

### Member Dashboard

Accessible at `/dashboard/*` for authenticated members:

- **Home** -- Active program overview, progress tracking, quick links
- **Programs** -- Browse and search the course catalog; view program details with curriculum, milestones, and enrollment status
- **Calendar** -- Program schedules, events, and calendar sync
- **Booking** -- Schedule 1:1 sessions with instructors based on their availability
- **Community** -- Forum with posts, nested comments, reactions, and pinning
- **Messages** -- Threaded direct messaging with read receipts
- **Profile** -- Update name, avatar, bio, phone, and view enrollment history
- **Completed Programs** -- Certificates of completion

### Instructor Portal

Accessible at `/instructor/*` for users with the instructor role:

- **Home** -- Assigned programs, student counts, upcoming class schedules
- **Program Management** -- View student roster, track progress, post announcements
- **Calendar** -- View student participation and program events
- **Availability** -- Set weekly recurring time slots, sync Google Calendar, manage blocked time
- **Messages & Community** -- Shared access with member features

### Admin Panel

Accessible at `/admin/*` for users with the admin role:

- **Overview** -- System statistics: total users, programs, enrollments, and revenue
- **User Management** -- Create, delete, and manage user accounts and roles
- **Program Management** -- List, filter, publish, and archive programs
- **Program Editor** -- Create and edit programs with milestones, themes, homework, and journal prompts; CSV bulk import
- **Activity Log** -- Track all system changes, login history, payments, and enrollment events
- **Messages & Community** -- Shared access with moderation capabilities

---

## Authentication & Authorization

Authentication is handled entirely through Supabase Auth using email/password. The system supports three roles:

| Role | Access Level |
|------|-------------|
| `member` | Dashboard, programs, community, messaging, booking |
| `instructor` | All member features plus program management, availability, and student oversight |
| `admin` | Full system access including user management, program editing, and activity logs |

Users can hold multiple roles simultaneously. Role information is stored in the `profiles.roles` array and checked via the `hasRole()` method on the auth context.

Route protection is enforced through three guard components:
- `ProtectedRoute` -- Requires any authenticated user
- `InstructorRoute` -- Requires the `instructor` or `admin` role
- `AdminRoute` -- Requires the `admin` role

---

## Database Schema

The PostgreSQL database (managed through Supabase) includes the following core table groups:

### Users & Profiles
- `profiles` -- User identity, roles, contact info; auto-created on auth signup via trigger

### Programs & Curriculum
- `programs` -- Structured learning programs with categories, difficulty levels, and publication status
- `program_modules` -- Sections within a program
- `lessons` -- Individual content items (markdown, video, duration)
- `program_milestones` -- Cohort class dates with themes, times, and Zoom links
- `milestone_journal_prompts` -- Reflection prompts tied to milestones
- `daily_homework_tasks` -- Daily activities organized by week and day

### Enrollment & Progress
- `enrollments` -- User-program enrollment with status tracking (active, completed, dropped)
- `lesson_progress` -- Per-lesson completion tracking
- `user_journal_responses` -- Member responses to journal prompts
- `user_task_completions` -- Daily homework completion records
- `certificates` -- Issued upon program completion

### Events & Scheduling
- `live_events` -- Workshops, webinars, and classes with registration limits
- `event_registrations` -- Student event sign-ups
- `calendar_events` -- Admin-created events visible to all members
- `instructor_bookings` -- 1:1 session bookings with status workflow
- `instructor_availability` -- Weekly recurring time slots
- `instructor_calendar_sync` -- Google Calendar OAuth credentials and sync state
- `instructor_unavailable_slots` -- Blocked time from calendar sync, personal blocks, or bookings

### Communication
- `message_threads` -- Conversation containers with participant lists
- `messages` -- Individual messages with read tracking
- `community_posts` -- Forum posts with categories and pinning
- `post_comments` -- Nested comment threads
- `post_reactions` -- Like, helpful, inspiring, and insightful reactions

### Payments
- `payments` -- Payment records linked to users and programs with Stripe PaymentIntent tracking

### Resources & Assignments
- `program_resources` -- Links, documents, videos, and articles for programs
- `program_assignments` -- Assignments with due dates
- `assignment_submissions` -- Student submissions with review workflow

All tables enforce Row Level Security (RLS) with policies scoped to ownership, role membership, and enrollment status.

---

## Edge Functions

Five Supabase Edge Functions handle server-side operations:

### `stripe-checkout`
Creates and confirms Stripe PaymentIntents for program enrollment. Validates the user is not already enrolled, processes the payment, and records it in the database.

### `stripe-webhook`
Processes incoming Stripe webhook events (`checkout.session.completed`, `payment_intent.succeeded`) to keep payment and subscription records in sync.

### `admin-user-management`
Provides admin-only endpoints for creating new user accounts (with optional role assignment) and deleting existing users through the Supabase Admin Auth API.

### `import-program-csv`
Accepts structured program data and bulk-creates the program along with its milestones, daily homework tasks, and journal prompts in a single operation.

### `sync-google-calendar`
Connects instructor accounts to Google Calendar via OAuth, then syncs calendar events into `instructor_unavailable_slots` to automatically block booking times.

---

## Payments & Stripe Integration

The checkout flow supports two modes:

**Custom Payment Form**
1. Member selects a program and proceeds to checkout
2. `StripePaymentForm` collects card details via Stripe Elements
3. The `stripe-checkout` edge function creates and confirms a PaymentIntent
4. On success, a `payments` record is created with status `paid`
5. Enrollment is gated by a database constraint that requires a confirmed payment

**Stripe Payment Link**
An alternative `StripePaymentLinkIframe` component embeds a Stripe-hosted checkout page for simplified payment collection.

Payment status workflow: `pending` -> `paid` | `failed`

---

## Routing & Layouts

### Route Groups

| Group | Base Path | Layout | Protection |
|-------|-----------|--------|-----------|
| Marketing | `/` | LandingLayout, MarketingLayout | Public |
| Offerings | `/offerings/*`, `/checkout/*`, `/contact` | OfferingsLayout | Public |
| Dashboard | `/dashboard/*` | DashboardLayout | Authenticated |
| Instructor | `/instructor/*` | InstructorLayout | Instructor or Admin role |
| Admin | `/admin/*` | AdminLayout | Admin role |

### Layout System

Five layout wrappers control the page chrome (header, footer, background):

- **LandingLayout** -- Landing page with frosted header and stone background
- **MarketingLayout** -- Standard pages (login, signup, blog, FAQ)
- **OfferingsLayout** -- Smart header that adapts navigation based on the current offerings sub-path
- **ApproachLayout** -- Approach methodology page
- **AboutLayout** -- About us page

All layouts share the same `Header` and `Footer` components, configured via the header configuration system.

---

## Configuration System

The application uses a configuration-driven approach for navigation and CTAs:

### `config/nav.ts`
Defines navigation item sets for each page context (landing, marketing, offerings hub, personal, team, etc.). Each item specifies a label and either a route path (`to`) or anchor link (`href`).

### `config/header.ts`
Maps named configurations to header behavior: which navigation set to display, which CTA button to render, and the visual style.

### `config/cta.ts`
Defines all call-to-action buttons with labels and destinations. Includes options for enrollment, consultations, and dynamic resolution.

### `config/personalization.ts`
Resolves dynamic CTAs based on user role, referral source, and page context. For example, members see "Enroll Today" while corporate visitors see "Book Team Consultation."

---

## Design System

### Typography
- **Headings**: Libre Baskerville (serif)
- **Body**: DM Sans (sans-serif)

### Color Palette
- **Sage** (primary brand): 10-shade ramp from `#F2F5F0` to `#273A2D`
- **Teal** (primary action): CSS variable-driven with hover state
- **Warm Coral** (accent): For highlights and secondary CTAs
- **Stone/Neutral**: Background tones via Tailwind defaults

### Spacing
8px base grid: `xs` (8px), `sm` (16px), `md` (24px), `lg` (48px), `xl` (80px), `xxl` (120px)

### Border Radius
- `sm`: 12px
- `md`: 20px
- `pill`: 9999px (fully rounded)

### Shadows
- `soft`: Subtle elevation (`0 4px 24px`)
- `card`: Light card shadow (`0 2px 16px`)

---

## Environment Variables

### Frontend (Vite)

```
VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

### Edge Functions (Supabase Secrets)

The following are automatically available in the Supabase edge function runtime:

```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_DB_URL
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```
