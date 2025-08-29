# TripMind AI 🌍✈️

> **Intelligent Travel Planning with AI-Powered Agents**

A production-ready full-stack React application for intelligent travel planning, featuring AI-powered trip planning agents, flight search integration with Skyscanner, and comprehensive trip management functionality.

![TripMind AI](https://img.shields.io/badge/TripMind-AI%20Travel%20Assistant-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)
![Express](https://img.shields.io/badge/Express-5.1-000000?style=flat&logo=express)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-06B6D4?style=flat&logo=tailwindcss)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:8080
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS 3 + React Router 6 (SPA)
- **Backend**: Express.js integrated with Vite dev server
- **UI Components**: Radix UI + TailwindCSS + Lucide React icons
- **Package Manager**: PNPM (preferred)
- **Testing**: Vitest
- **Build System**: Vite (dual config for client/server)

## 📁 Project Structure

```
├── client/                     # React SPA Frontend
│   ├── pages/                  # Route Components
│   │   ├── Index.tsx          # Home page with AI chat interface
│   │   ├── FlightSearch.tsx   # Flight search & booking (Skyscanner)
│   │   ├── CreateTrip.tsx     # Trip creation form
│   │   ├── TripDetails.tsx    # Trip management & itinerary
│   │   └── NotFound.tsx       # 404 page
│   ├── components/            # React Components
│   │   ├── ui/               # Pre-built UI component library (50+ components)
│   │   └── TripForm.tsx      # Trip creation/editing form
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── App.tsx               # App entry point with routing setup
│   └── global.css            # TailwindCSS theming & global styles
│
├── server/                    # Express API Backend
│   ├── index.ts              # Main server setup (Express config + routes)
│   └── routes/               # API Route Handlers
│       ├── ai-agents.ts      # AI chat agents (destination, itinerary, booking)
│       ├── flights.ts        # Flight search & Skyscanner integration
│       ├── trips.ts          # Trip CRUD operations
│       └── demo.ts           # Demo/example endpoint
│
├── shared/                    # Shared Types & Interfaces
│   └── api.ts                # TypeScript interfaces for API contracts
│
├── public/                    # Static assets
├── netlify/                   # Netlify deployment configuration
└── .builder/                  # Build artifacts
```

## 🎯 Core Features

### 🤖 AI-Powered Travel Planning
- **3 Specialized AI Agents**:
  - **🌍 Destination Research Agent**: Discovers destinations based on preferences
  - **🗺️ Itinerary Planning Agent**: Creates detailed day-by-day travel plans
  - **✈️ Flight Booking Agent**: Finds and books flights via Skyscanner integration
- **💬 Conversational Interface**: Natural language trip planning with chat UI
- **📈 Progressive Trip Building**: Step-by-step guided planning process

### ✈️ Flight Search & Booking (Skyscanner Integration)
- **🔍 Real-time Flight Search**: Search flights with origin, destination, dates, passengers
- **🎛️ Filter Options**: Class selection, price limits, passenger count
- **📋 Flight Details**: Complete flight information including amenities, carbon emissions
- **🔗 Direct Booking**: Integration with Skyscanner for seamless booking experience
- **🧪 Mock Data System**: Comprehensive flight data generation for development/testing

### 📅 Trip Management System
- **📝 Trip CRUD Operations**: Create, read, update, delete trips
- **📊 Trip Status Tracking**: Planning, confirmed, completed, cancelled states
- **💰 Budget Tracking**: Budget vs. actual spending monitoring
- **📈 Booking Progress**: Visual progress indicators for trip completion
- **🗓️ Itinerary Management**: Day-by-day activity planning and organization

### 🎨 Modern UI/UX
- **🧩 50+ Pre-built Components**: Complete Radix UI component library
- **📱 Responsive Design**: Mobile-first approach with TailwindCSS
- **🌈 Beautiful Gradients**: Travel-themed color schemes and visual design
- **⚡ Interactive Elements**: Smooth animations and transitions
- **♿ Accessibility**: WCAG compliant components with keyboard navigation

## 🔧 API Endpoints

### Core Routes
```
GET  /api/ping              # Health check
GET  /api/demo              # Demo endpoint
```

### AI Agents
```
POST /api/chat              # Chat with AI travel agents
```

### Trip Management
```
GET    /api/trips           # Get all trips
GET    /api/trips/:tripId   # Get trip by ID
POST   /api/trips           # Create new trip
PUT    /api/trips/:tripId   # Update trip
DELETE /api/trips/:tripId   # Delete trip
```

### Flight Search (Skyscanner)
```
POST /api/flights/search       # Search flights
GET  /api/flights/:flightId    # Get flight details
```

## 📊 Data Models

### Key Interfaces

```typescript
interface Trip {
  id: string;
  title: string;
  destination: string;
  dates: string;
  travelers: number;
  budget: number;
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
  itinerary: ItineraryDay[];
  flights: Flight[];
  bookings: Booking[];
}

interface FlightResult {
  id: string;
  airline: string;
  flightNumber: string;
  departure: AirportInfo;
  arrival: AirportInfo;
  price: PriceInfo;
  amenities: string[];
  bookingLink: string; // Links to Skyscanner
}

interface ChatRequest {
  message: string;
  agentType: 'destination' | 'itinerary' | 'booking';
  conversationHistory: Array<{
    sender: 'user' | 'agent';
    content: string;
    timestamp: string;
  }>;
  tripData: {
    destination: string;
    dates: string;
    budget: string;
    travelers: number;
  };
}
```

## 🎨 UI Component Library

### Form Components
- Input, Textarea, Select, Checkbox, Radio Group
- Calendar, Date Picker, Time Picker
- Form validation and error handling

### Layout Components
- Card, Sheet, Dialog, Popover
- Tabs, Accordion, Collapsible
- Sidebar, Navigation Menu

### Data Display
- Table, Badge, Avatar, Progress
- Chart (for analytics), Calendar
- Toast notifications, Alert dialogs

### Interactive Components
- Button (multiple variants), Toggle, Switch
- Command palette, Context Menu
- Carousel, Resizable panels

## 🚀 Development

### Available Scripts

```bash
npm run dev          # Start development server (port 8080)
npm run build        # Build for production
npm run build:client # Build client only
npm run build:server # Build server only
npm start           # Start production server
npm test            # Run tests
npm run typecheck   # TypeScript type checking
```

### Development Features
- **🔄 Single-port Development**: Vite + Express integration
- **⚡ Hot Module Replacement**: Full hot reload for rapid development
- **🔒 TypeScript Throughout**: Type safety across client, server, and shared code
- **🤝 Type-safe API Communication**: Shared interfaces ensure consistency

### Adding New Routes

1. **Create page component** in `client/pages/MyPage.tsx`
2. **Add route** in `client/App.tsx`:
   ```typescript
   <Route path="/my-page" element={<MyPage />} />
   ```

### Adding New API Endpoints

1. **Create handler** in `server/routes/my-route.ts`
2. **Add types** in `shared/api.ts`
3. **Register route** in `server/index.ts`
4. **Use with type safety**:
   ```typescript
   import { MyRouteResponse } from '@shared/api';
   const response = await fetch('/api/my-endpoint');
   const data: MyRouteResponse = await response.json();
   ```

## 📦 Recent Updates

### ✅ Skyscanner Integration Fix
- **Fixed Invalid URL Issue**: Updated booking links to use correct Skyscanner domain (`www.skyscanner.com`)
- **Enhanced URL Format**: Now generates valid Skyscanner URLs with proper route and query parameters
- **Parameter Handling**: Added support for flight class and passenger count in booking URLs

### Example Fixed URL:
```
Before: https://skyscanner.com/booking/AA-1234
After:  https://www.skyscanner.com/transport/flights/lax/nrt/20240315/?adults=2&cabinclass=economy&ref=external
```

## 🌐 Deployment Options

### Standard Deployment
```bash
npm run build  # Creates dist/ folder
npm start      # Runs production server
```

### Cloud Deployment
- **Netlify**: Optimized configuration included
- **Vercel**: Compatible with provided setup
- **Docker**: Containerization support with `.dockerignore`

### Binary Deployment
Self-contained executables for:
- Linux
- macOS  
- Windows

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Client build configuration |
| `vite.config.server.ts` | Server build configuration |
| `tailwind.config.ts` | TailwindCSS theme configuration |
| `components.json` | Radix UI component configuration |

## 🔍 Key Components

| Component | Size | Description |
|-----------|------|-------------|
| `client/pages/Index.tsx` | 24KB | Main AI chat interface (feature-rich) |
| `client/pages/FlightSearch.tsx` | 16KB | Flight search functionality |
| `server/routes/flights.ts` | 13KB | Flight API with Skyscanner integration |
| `server/routes/ai-agents.ts` | 13KB | AI agent logic |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** for the excellent component primitives
- **TailwindCSS** for the utility-first CSS framework
- **Skyscanner** for flight search integration
- **Vite** for the blazing fast build tool

---

<div align="center">

**Built with ❤️ by the TripMind AI Team**

[🌐 Live Demo](https://tripmind-ai.netlify.app) • [📚 Documentation](https://docs.tripmind-ai.com) • [🐛 Report Bug](https://github.com/tripmind-ai/issues)

</div>