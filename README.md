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

- **Attract** clients through a polished marketing site with offerings, program detail pages, and an about section
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
│   ├── checkout/             # Stripe payment link iframe, purchase summary
│   ├── context/              # AuthContext provider and type definitions
│   ├── dashboard/            # Member dashboard layout with sidebar navigation
│   ├── instructor/           # Instructor layout and route protection
│   ├── landing/              # Landing page sections (hero, offerings, about, contact)
│   ├── layout/               # Header and Footer shared across layouts
│   ├── offerings/            # Offerings cards + shared TeamProgramLayout
│   └── ui/                   # ProtectedRoute guard and LoadingSpinner
├── config/
│   ├── cta.ts                # Call-to-action button definitions
│   ├── header.ts             # Route-specific header configurations
│   ├── nav.ts                # Navigation item sets for each page context
│   └── personalization.ts    # Dynamic CTA resolution based on user context
├── layouts/                  # Page layout wrappers (Landing, Marketing, Offerings, About)
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
│   └── offerings/
│       ├── team/             # Team program detail pages (consulting, government, ...)
│       └── *.tsx             # Offerings hub, personal, team, Flow Series, private sessions
└── router/
    ├── AppRouter.tsx          # Root router with all route groups
    ├── marketingRoutes.tsx    # Public pages
    ├── offeringsRoutes.tsx    # Offerings, team programs, and checkout routes
    ├── dashboardRoutes.tsx    # Protected member routes
    ├── instructorRoutes.tsx   # Protected instructor routes
    └── adminRoutes.tsx        # Protected admin routes

supabase/
├── functions/
│   ├── admin-user-management/  # Create and delete users (admin-only)
│   ├── delete-account/         # Self-service account deletion
│   ├── import-program-csv/     # Bulk import programs with milestones and prompts
│   ├── stripe-checkout/        # Create and confirm Stripe PaymentIntents
│   ├── stripe-webhook/         # Process Stripe webhook events
│   └── sync-google-calendar/   # Connect and sync Google Calendar availability
└── migrations/                 # 40+ database migration files
```

> **Routing note.** Vite has no file-based routing: a file's location in `src/pages/`
> is convention only. `src/router/*.tsx` is the single source of truth mapping a URL
> to a component, and is the fastest way to find the file behind any page.

---

## Features

### Public Marketing Site

| Page | Path | Description |
|------|------|-------------|
| Landing | `/` | Hero, offerings showcase, about, and contact sections |
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

**Personal Offerings** (`/offerings/personal`)

The landing page for all personal offerings, organized into three sections:

1. **Private Sessions** -- three 1:1 yoga therapy tracks, each with its own detail page:
   | Page | Path |
   |------|------|
   | The Body | `/offerings/personal/the-body` |
   | The Mind | `/offerings/personal/the-mind` |
   | The Soul | `/offerings/personal/the-soul` |
2. **Seasonal Programs** -- each season now has its own dedicated website; the tiles
   link out to `flowthroughsummer.com`, `flowthroughfall.com`, `flowintospring.com`,
   and `flowthroughwinter.com`. Each tile also opens the Flow Series email-announcement
   modal (`NotifyModal`).
3. **Events & Retreats** -- placeholder content, intentionally left as-is.

**Team Offerings** (`/offerings/team`)

Four engagement types, each with a detail page. All four share a single presentational
component (`components/offerings/TeamProgramLayout.tsx`) and differ only in content, so
the layout is edited in one place:

| Page | Path |
|------|------|
| Wellness Consulting | `/offerings/team/consulting` |
| Government Agency Programs | `/offerings/team/government` |
| Corporate Wellness Programs | `/offerings/team/corporate` |
| Community Wellness Programs | `/offerings/team/community` |

Delivery options: virtual, in-person, and hybrid. Every team page CTA routes to the
external Google Calendar consultation booking link.

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

Six Supabase Edge Functions handle server-side operations:

### `stripe-checkout`
Creates and confirms Stripe PaymentIntents for program enrollment. Validates the user is not already enrolled, processes the payment, and records it in the database.

### `stripe-webhook`
Processes incoming Stripe webhook events (`checkout.session.completed`, `payment_intent.succeeded`) to keep payment and subscription records in sync.

### `delete-account`
Allows an authenticated user to delete their own account and associated profile data.

### `admin-user-management`
Provides admin-only endpoints for creating new user accounts (with optional role assignment) and deleting existing users through the Supabase Admin Auth API.

### `import-program-csv`
Accepts structured program data and bulk-creates the program along with its milestones, daily homework tasks, and journal prompts in a single operation.

### `sync-google-calendar`
Connects instructor accounts to Google Calendar via OAuth, then syncs calendar events into `instructor_unavailable_slots` to automatically block booking times.

---

## Payments & Stripe Integration

The Flow Series cohort checkout uses a **Stripe-hosted payment page**, embedded via
`StripePaymentLinkIframe`. Card details are never collected by this application, which
keeps the project in the lightest PCI scope (SAQ-A).

Supporting server-side pieces exist for a fuller integration:

- `stripe-checkout` -- creates and confirms PaymentIntents
- `stripe-webhook` -- reconciles `checkout.session.completed` and `payment_intent.succeeded`
- Enrollment is gated by a database constraint requiring a confirmed payment

> ### ⚠️ Known gap: the private-session purchase modal is a prototype
>
> The purchase modal on `/offerings/personal/the-body`, `/the-mind`, and `/the-soul`
> (defined inline in each `The*Page.tsx`) is **not connected to Stripe**. It renders
> card inputs, waits 1.8s on a `setTimeout`, and then displays a success message. No
> payment is taken and no record is written.
>
> It is retained deliberately while the site is unreleased and receiving no traffic.
> **It must be replaced with a Stripe-hosted payment link before launch** -- both
> because it reports false confirmations and because collecting raw card fields in the
> page would otherwise widen PCI scope well beyond SAQ-A.

Payment status workflow: `pending` -> `paid` | `failed`

---

## Routing & Layouts

### Route Groups

| Group | Base Path | Layout | Protection |
|-------|-----------|--------|-----------|
| Marketing | `/` | LandingLayout, MarketingLayout | Public |
| Offerings | `/offerings/*`, `/offerings/team/*`, `/checkout/*`, `/contact` | OfferingsLayout | Public |
| Dashboard | `/dashboard/*` | DashboardLayout | Authenticated |
| Instructor | `/instructor/*` | InstructorLayout | Instructor or Admin role |
| Admin | `/admin/*` | AdminLayout | Admin role |

### Layout System

Four layout wrappers control the page chrome (header, footer, background):

- **LandingLayout** -- Landing page with frosted header and stone background
- **MarketingLayout** -- Standard pages (login, signup, blog, FAQ)
- **OfferingsLayout** -- Smart header that adapts navigation based on the current offerings sub-path (offerings hub, personal hub, private-session pages, team hub, team program pages, Flow Series, contact)
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
