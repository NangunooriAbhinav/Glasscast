# Glasscast

A modern weather application built with React Native and Expo, featuring a beautiful glassmorphism UI design.

## Tech Stack

- **React Native** with **Expo SDK**
- **TypeScript** for type safety
- **Supabase** for backend services
- **Axios** for API calls
- **React Navigation** for screen navigation
- **Expo Blur** for glassmorphism effects

## Project Structure

```
src/
├── components/    # Reusable UI components
├── screens/       # Screen components
├── services/      # API and external services
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── context/       # React context providers
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your API keys:
   ```bash
   cp .env.example .env
   ```
4. Run the app:
   ```bash
   npm run ios     # for iOS
   npm run android # for Android
   npm run web     # for web
   ```

## Environment Variables

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `WEATHER_API_KEY` - Weather API key (e.g., OpenWeatherMap)

## License

MIT
