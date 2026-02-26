# Limited Drop - Product Reservation Platform

A modern React-based e-commerce platform designed for limited product releases with real-time stock management and reservation system.

## Features

- **Product Drop System**: Time-limited product releases with countdown timers
- **Real-time Stock Polling**: Live stock availability updates
- **Reservation System**: Secure product reservations with expiration
- **Order Management**: Complete checkout and order confirmation flow
- **Responsive Design**: Mobile-first UI built with Tailwind CSS

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **Form Validation**: Zod
- **Routing**: React Router DOM 7

## Project Structure

```
src/
├── assets/              # Static assets (images, fonts, etc.)
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Navbar, Footer)
│   ├── product/        # Product-related components
│   └── ui/             # Generic UI components
├── context/            # React context providers
│   └── AuthContext.tsx # Authentication context
├── hooks/              # Custom React hooks
│   ├── useCountdown.ts       # Countdown timer logic
│   ├── useProduct.ts         # Product data management
│   ├── useReservation.ts     # Reservation logic
│   └── useStockPolling.ts    # Real-time stock updates
├── pages/              # Page components
│   ├── AddProductPage.tsx   # Product creation page
│   ├── CheckoutPage.tsx     # Checkout flow
│   ├── ConfirmationPage.tsx  # Order confirmation
│   ├── DropPage.tsx         # Product listing/drops
│   ├── NotFoundPage.tsx     # 404 page
│   ├── ProductDetailPage.tsx # Product details
│   └── SoldOutPage.tsx      # Sold out state
├── services/           # API service layer
│   ├── ApiSetter.ts    # Axios configuration & interceptors
│   ├── orders.ts       # Order API functions
│   ├── products.ts     # Product API functions
│   └── reservations.ts # Reservation API functions
├── types/              # TypeScript type definitions
│   ├── order.ts
│   ├── product.ts
│   └── reservation.ts
├── utils/              # Utility functions
│   ├── errorHandler.ts # Error handling utilities
│   └── formatTime.ts   # Time formatting helpers
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css         # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```
bash
git clone <repository-url>
cd MPC_fn
```

2. Install dependencies:
```
bash
npm install
```

3. Configure environment variables:
```
bash
# Create .env file in root directory
VITE_APP_API_URL=http://localhost:5000
```

4. Start development server:
```
bash
npm run dev
```

### Building for Production

```
bash
npm run build
```

### Linting

```
bash
npm run lint
```

## API Configuration

The application connects to a backend API. Configure the API URL using environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_API_URL` | Backend API base URL | `http://localhost:5000` (dev) or `https://mpc-bn.onrender.com` (prod) |

### API Endpoints

The frontend expects these backend endpoints:

- `GET /products` - List all products
- `GET /products/:id` - Get product details
- `POST /products` - Create new product
- `POST /reservations` - Create reservation
- `GET /reservations/:id` - Get reservation
- `POST /orders` - Create order
- `GET /orders/:id` - Get order

## Authentication

The application uses JWT-based authentication. Tokens are stored in `localStorage` and automatically included in API requests via the `ApiSetter` service.

## Key Concepts

### Reservation Flow
1. User views product on Drop Page
2. User clicks "Reserve" to create a reservation
3. Reservation is valid for 5 minutes
4. User completes checkout before expiration
5. Order is confirmed

### Stock Polling
Real-time stock updates are fetched every 3 seconds using the `useStockPolling` hook to prevent overselling during high-demand drops.

## License

MIT
