# Bozeman Health Employee Housing Portal - Frontend

Modern React application for helping Bozeman Health employees find rental housing.

## Tech Stack

- **React 19** - UI library
- **TypeScript 5.9** - Type safety
- **Vite 7.3** - Build tool with HMR
- **Tailwind CSS 4.1** - Utility-first styling
- **React Router DOM 7.12** - Client-side routing
- **React Query 5.90** - Server state management
- **React Hook Form 7.71** - Form handling
- **Zod 4.3** - Schema validation
- **Axios 1.13** - HTTP client
- **Google Maps API** - Location visualization

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running at `http://localhost:5000`
- Google Maps API key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:5173

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - TypeScript check + production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Project Structure

```
src/
├── components/
│   ├── auth/           # Auth-related components (future)
│   ├── common/         # Reusable UI components (future)
│   ├── layout/         # Header, Footer, Layout
│   └── property/       # Property-specific components (future)
├── context/
│   └── AuthContext.tsx # Authentication state management
├── hooks/              # Custom React hooks (future)
├── pages/
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── PropertyList.tsx # Property listing with map
│   ├── PropertyDetail.tsx # Property details
│   ├── SubmitProperty.tsx # Property submission form
│   ├── Admin.tsx       # Admin dashboard
│   ├── Profile.tsx     # User profile
│   └── Favorites.tsx   # Saved properties
├── services/
│   ├── api.ts          # Axios instance with interceptors
│   ├── authServices.ts # Authentication API calls
│   └── propertyService.ts # Property API calls
├── types/
│   └── index.ts        # TypeScript interfaces
├── utils/              # Utility functions (future)
├── App.tsx             # Root component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind
```

## Features

### Implemented ✅

- **Authentication**
  - User registration and login
  - Role-based access control (employee, provider, admin, superadmin)
  - Protected routes
  - Token refresh on expiration

- **Property Browsing**
  - Grid and map view
  - Search and filtering
  - Sort options
  - Google Maps integration
  - Property cards with images

- **Property Details**
  - Full property information
  - Image gallery
  - Location map
  - Landlord contact info
  - Favorite functionality

- **Property Submission**
  - Multi-section form
  - Form validation with Zod
  - Pending approval workflow

- **Admin Dashboard**
  - Property approval queue
  - Approve/reject actions
  - Status filtering

- **User Features**
  - Profile page
  - Favorites management
  - Role-based navigation

### Not Yet Implemented 🚧

See [MIGRATION_STATUS.md](./MIGRATION_STATUS.md) for complete list:

- Image upload functionality (HIGH PRIORITY)
- Email verification pages
- Password reset flow
- Amenities selection in forms
- Advanced filtering
- Notifications system
- Property analytics
- And more...

## User Roles

- **Employee** - Browse properties, save favorites, contact landlords
- **Provider** - All employee features + submit properties
- **Admin** - All provider features + approve/reject properties
- **Superadmin** - All admin features + manage users

## API Integration

The frontend communicates with the backend API at `/api/v1` endpoints:

- `/auth/*` - Authentication endpoints
- `/properties/*` - Property CRUD operations
- `/favorites/*` - Favorite management

Axios interceptors automatically:
- Add authentication tokens to requests
- Refresh tokens on 401 errors
- Redirect to login on auth failures

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api/v1` |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key | `AIza...` |

## Development Notes

### Authentication Flow

1. User logs in → receives access token
2. Token stored in localStorage
3. Axios interceptor adds token to all requests
4. On 401 error → attempts token refresh
5. If refresh fails → redirects to login

### State Management

- **Server state**: React Query for caching and synchronization
- **Client state**: React Context for auth
- **Form state**: React Hook Form for performance

### Styling Approach

- Utility-first with Tailwind CSS
- Responsive design with mobile-first approach
- Consistent color scheme (blue primary, gray neutrals)
- Lucide React for icons

## Build and Deployment

### Production Build

```bash
npm run build
```

Output in `dist/` directory.

### Build Size

Current production build:
- CSS: ~25 KB (gzipped: ~5 KB)
- JS: ~480 KB (gzipped: ~147 KB)

### Deployment Options

- **Vercel** - Recommended (automatic deployment from Git)
- **Netlify** - Good alternative with similar features
- **AWS Amplify** - If using AWS ecosystem
- **Traditional hosting** - Build + serve dist/ folder

### Environment-Specific Configs

Create `.env.production` for production settings:
```env
VITE_API_URL=https://api.yourdomain.com/api/v1
VITE_GOOGLE_MAPS_API_KEY=production_key_here
```

## Contributing

1. Create feature branch from `main`
2. Make changes
3. Test thoroughly
4. Create pull request

## Testing

Currently no tests implemented. Recommended:
- Jest + React Testing Library for unit tests
- Playwright or Cypress for E2E tests

## License

Internal use for Bozeman Health only.

## Support

For issues or questions, contact the development team.

---

**Migration Status:** See [MIGRATION_STATUS.md](./MIGRATION_STATUS.md) for detailed feature tracking and roadmap.
