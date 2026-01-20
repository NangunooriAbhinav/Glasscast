# Glasscast - Weather App

## Project Overview

Glasscast is a modern weather application built with React Native and Expo, featuring a beautiful glassmorphism UI design. The app provides real-time weather information, forecasts, and location-based weather updates with a sleek, translucent interface that mimics glass surfaces.

## Tech Stack

- **React Native** with **Expo SDK** - Cross-platform mobile development
- **TypeScript** - Type safety and better developer experience
- **Supabase** - Backend as a service for authentication and data storage
- **React Navigation** - Navigation between screens
- **Axios** - HTTP client for API calls
- **Expo Blur** - Glassmorphism visual effects
- **React Native Safe Area Context** - Device-safe layouts

## Architecture Pattern

**MVVM (Model-View-ViewModel)** with clean separation of concerns:

- **Models**: Data structures and business logic (`src/types/`)
- **Views**: UI components and screens (`src/components/`, `src/screens/`)
- **ViewModels**: Business logic and state management (`src/hooks/`, `src/context/`)
- **Services**: External API integrations (`src/services/`)
- **Utils**: Helper functions and utilities (`src/utils/`)

## Coding Standards

### TypeScript
- Strict mode enabled
- Explicit type annotations for all props and state
- Interface definitions for component props and API responses
- Avoid `any` type - use proper type unions or generics

### React Components
- Functional components only (no class components)
- Custom hooks for business logic and state management
- Proper prop destructuring and default values
- Meaningful component and prop names

### Error Handling
- Try-catch blocks for async operations
- Proper error states in components
- User-friendly error messages
- Graceful fallbacks for failed API calls

## Design System

### Glassmorphism Principles
- **Translucent surfaces**: Semi-transparent backgrounds with blur effects
- **Depth layers**: Multiple elevation levels using shadows and borders
- **Subtle borders**: Thin, low-opacity borders for definition
- **Smooth animations**: Fluid transitions and micro-interactions

### Visual Hierarchy
- Primary glass: `rgba(255, 255, 255, 0.1)` - Main containers
- Secondary glass: `rgba(255, 255, 255, 0.05)` - Supporting elements
- Tertiary glass: `rgba(255, 255, 255, 0.03)` - Subtle backgrounds
- Accent glass: `rgba(255, 255, 255, 0.15)` - Interactive elements

### Spacing Scale
- Base unit: 4px (xs)
- Scale: 4, 8, 16, 24, 32, 48, 64, 80, 96, 128px
- Consistent margins and padding across all components

## API Structure

### Supabase Integration
- **Authentication**: User login/signup with email/password
- **User preferences**: Saved locations, favorite cities
- **Data persistence**: Weather history and user settings

### Weather API Integration
- **OpenWeatherMap/WeatherAPI**: Real-time weather data
- **Geolocation**: Current location weather
- **Forecasts**: 5-day weather predictions
- **Search**: City/location autocomplete

### API Response Handling
- Consistent error handling across all services
- Type-safe response interfaces
- Caching strategies for weather data
- Rate limiting and retry logic

## Key Conventions

### File Naming
- PascalCase for components: `WeatherCard.tsx`
- camelCase for utilities: `formatTemperature.ts`
- kebab-case for assets: `weather-icon.png`

### Imports and Exports
- Named exports preferred over default exports
- Group imports: React, third-party libraries, local components
- Relative imports with `../../` for parent directories

### Async Operations
- `async/await` syntax for all asynchronous code
- Proper error boundaries for async components
- Loading states during data fetching
- Optimistic updates for better UX

### State Management
- Local state with `useState` for component-specific data
- Context API for app-wide state (theme, user preferences)
- Custom hooks for complex state logic
- Avoid prop drilling with proper state distribution

## Environment Variables and Security

### Required Environment Variables
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anonymous_key
WEATHER_API_KEY=your_weather_api_key
```

### Security Practices
- Never commit `.env` files to version control
- Use environment-specific configuration
- Validate API keys on app startup
- Implement proper error handling for invalid keys
- Use HTTPS for all API communications
- Store sensitive data securely using device keychain

### Development vs Production
- Separate environment files for dev/staging/production
- Different Supabase projects for each environment
- Mock data for development and testing
- Proper logging levels for different environments

## File Structure

```
src/
├── components/        # Reusable UI components
│   └── Glass/        # Glassmorphism components
├── screens/          # Screen components
├── services/         # API services
├── hooks/           # Custom React hooks
├── types/           # TypeScript definitions
├── utils/           # Utility functions
├── context/         # React context providers
└── theme/          # Design system tokens
```

## Development Workflow

1. **Feature Development**: Create components in appropriate directories
2. **Type Safety**: Define interfaces before implementation
3. **Testing**: Manual testing on iOS/Android/Web platforms
4. **Code Review**: Ensure adherence to coding standards
5. **Deployment**: Use Expo Application Services (EAS) for builds

## Performance Considerations

- Optimize image loading and caching
- Implement proper list virtualization
- Use React.memo for expensive components
- Minimize bridge communication in React Native
- Profile and optimize bundle size

## Accessibility

- Proper contrast ratios for text on glass backgrounds
- Screen reader support for weather data
- Keyboard navigation for interactive elements
- Reduced motion preferences respect
- High contrast mode compatibility