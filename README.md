# StudyHub - Academic Assignment Platform

A modern, minimalistic platform where college students can post assignments and collaborate with peers for academic success. Built with React, TypeScript, and TailwindCSS.

## 🎯 Features

### Current Implementation

- **Assignment Dashboard**: Browse and filter academic assignments
- **Smart Filtering**: Filter by subject, budget, difficulty, and deadline
- **Modern UI**: Clean, academic-focused design with responsive layout
- **User Authentication**: Complete login/signup interface
- **Placeholder Pages**: Notes and messaging system foundations

### Coming Soon

- **Assignment Management**: Post, edit, and manage assignments
- **Real-time Messaging**: Direct communication between students
- **Notes Sharing**: Upload and share study materials
- **Payment Integration**: Secure payment processing
- **Database Integration**: Full backend implementation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd studyhub

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run test       # Run tests
npm run typecheck  # Type checking
npm run format.fix # Format code with Prettier
```

## 🏗️ Architecture

### Tech Stack

- **Framework**: React 18 with TypeScript
- **Routing**: React Router 6
- **Styling**: TailwindCSS + CSS Variables
- **UI Components**: Radix UI primitives with custom styling
- **Build Tool**: Vite
- **State Management**: React Query for server state
- **Testing**: Vitest
- **Icons**: Lucide React

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI component library
│   ├── layout/         # Layout components (Header, Footer)
│   └── assignment/     # Assignment-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── App.tsx             # Root component with routing
└── main.tsx           # Application entry point
```

### Design System

The application uses a custom design system built on TailwindCSS:

- **Colors**: Academic blue primary with semantic color scales
- **Typography**: Clean, readable font hierarchy
- **Spacing**: Consistent 8px grid system
- **Components**: Accessible UI components using Radix UI
- **Responsiveness**: Mobile-first responsive design

## 📱 Features Overview

### Homepage (Assignment Dashboard)

- Grid layout of assignment cards
- Advanced filtering and sorting
- Real-time statistics
- Responsive design for all screen sizes

### Authentication

- Sign in/Sign up tabs
- Social login options (GitHub, Google)
- Form validation
- Loading states

### Assignment Cards

- Subject categorization
- Difficulty indicators
- Budget and deadline information
- Applicant count
- Quick actions (Apply, View Details)

### Filtering System

- Subject-based filtering
- Budget range slider
- Difficulty levels
- Multiple sort options
- Active filter indicators

## 🎨 Design Principles

### Minimalistic Interface

- Clean, uncluttered layouts
- Purposeful use of whitespace
- Consistent visual hierarchy
- No unnecessary decorative elements

### Academic Focus

- Professional color scheme
- Trust-building design elements
- Clear information architecture
- Accessibility-first approach

### User Experience

- Intuitive navigation
- Fast loading times
- Responsive across devices
- Smooth animations and transitions

## 🔧 Customization

### Theming

The design system can be customized through:

1. **CSS Variables** in `src/index.css`
2. **Tailwind Config** in `tailwind.config.ts`
3. **Component Variants** using class-variance-authority

### Adding New Features

1. **New Pages**: Add to `src/pages/` and update routing in `App.tsx`
2. **UI Components**: Extend the component library in `src/components/ui/`
3. **Layouts**: Create layout components in `src/components/layout/`

## 🚦 Development Guidelines

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Consistent naming conventions
- Component composition over inheritance

### Testing

- Unit tests for utility functions
- Component testing with Vitest
- E2E testing setup ready

### Performance

- Lazy loading for route components
- Optimized bundle size with Vite
- Efficient state management

## 🗺️ Roadmap

### Phase 1: Core Platform ✅

- [x] UI/UX Design Implementation
- [x] Authentication Interface
- [x] Assignment Browsing
- [x] Filtering System

### Phase 2: Functionality (In Progress)

- [ ] Backend API Integration
- [ ] Database Setup
- [ ] User Registration/Login
- [ ] Assignment CRUD Operations

### Phase 3: Advanced Features

- [ ] Real-time Messaging
- [ ] Payment Integration
- [ ] Notes Sharing System
- [ ] Notification System

### Phase 4: Platform Growth

- [ ] Mobile App
- [ ] Advanced Analytics
- [ ] Institution Partnerships
- [ ] API for Third-party Integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@studyhub.com or join our Discord community.

---

**StudyHub** - Connecting students for academic success 🎓
