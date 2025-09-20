# REST Client App

A modern, full-stack REST API client built with Next.js, featuring authentication, request history, variables management, and multi-language support.

## ⚡ Quick Start for Reviewers

**Ready to test in 3 steps:**

1. **Clone and install:**

   ```bash
   git clone https://github.com/Daniilka48/rest-client-app.git
   cd rest-client-app
   npm install
   ```

2. **Create `.env.local` file in the root directory:**

   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=nX1lm3FU7lKlrmn5eKn/uOaavLwB7rQOL866tTfqMcI=
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_SUPABASE_URL=https://brjjybqngljiagmfukfa.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyamp5YnFuZ2xqaWFnbWZ1a2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTAyNjcsImV4cCI6MjA3Mzg4NjI2N30.vDkS5TUOO9V_y9pjMySKx74orts5WPt6w5ecOxQjnBU
   ```

3. **Run the app:**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

**🎉 Open [http://localhost:3000](http://localhost:3000) - Everything is ready!**

_All secrets are pre-configured for testing. No additional setup needed._

## 🚀 Features

- **RESTful Client**: Send HTTP requests with full method support (GET, POST, PUT, DELETE, etc.)
- **Authentication**: Secure user authentication with NextAuth.js and Prisma
- **Request History**: Track and restore previous API requests with full analytics
- **Variables Management**: Create and manage environment variables for API testing
- **Code Generation**: Generate code snippets in multiple languages (curl, JavaScript, Python, etc.)
- **Internationalization**: Multi-language support (English/Russian)
- **Modern UI**: Beautiful, responsive design with dark/light mode support

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Authentication**: NextAuth.js with Prisma adapter
- **Database**: SQLite with Prisma ORM
- **Styling**: CSS Modules with custom design system
- **Storage**: Supabase for request history
- **Internationalization**: react-i18next
- **Testing**: Jest with React Testing Library
- **Code Quality**: ESLint, Prettier, Husky

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** (version 8.0 or higher)
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Daniilka48/rest-client-app.git
cd rest-client-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create environment files for your local development:

#### Create `.env.local` file:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=nX1lm3FU7lKlrmn5eKn/uOaavLwB7rQOL866tTfqMcI=

# Database Configuration
DATABASE_URL="file:./dev.db"

# Supabase Configuration (for request history)
NEXT_PUBLIC_SUPABASE_URL=https://brjjybqngljiagmfukfa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyamp5YnFuZ2xqaWFnbWZ1a2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMTAyNjcsImV4cCI6MjA3Mzg4NjI2N30.vDkS5TUOO9V_y9pjMySKx74orts5WPt6w5ecOxQjnBU
```

**📝 Note**: These are the working keys for the demo environment. You can use them directly for testing.

#### Environment Variables Setup:

**Required Environment Variables:**

1. **NEXTAUTH_SECRET**: Already provided in the demo configuration above

2. **DATABASE_URL**: SQLite database path (already configured for local development)

3. **Supabase Variables** (for request history):
   - **Already configured!** Use the provided keys above - no setup needed.

### 4. Database Setup

Initialize and set up the database:

```bash
# Generate Prisma client
npx prisma generate

# Create and apply database migrations
npx prisma db push

# (Optional) View database with Prisma Studio
npx prisma studio
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

**🎉 That's it!** The Supabase database is already configured and ready to use with the provided keys.

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format-fix   # Fix formatting issues

# Testing
npm run test         # Run tests with coverage report

# Database
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to database
npx prisma studio    # Open Prisma Studio
```

## 🎯 Usage Guide

### 1. User Registration & Authentication

1. Visit the application at `http://localhost:3000`
2. Click "Sign Up" to create a new account
3. Or "Sign In" if you already have an account

### 2. Making API Requests

1. Navigate to the REST Client section
2. Select HTTP method (GET, POST, PUT, DELETE, etc.)
3. Enter the API endpoint URL
4. Add headers if needed
5. Add request body for POST/PUT requests
6. Click "Send" to execute the request

### 3. Managing Variables

1. Go to the Variables section
2. Create environment variables using `{{variableName}}` syntax
3. Use variables in URLs, headers, or request bodies

### 4. Viewing Request History

1. Visit the History section
2. View all previous requests with analytics
3. Click on any request to restore it in the REST client

### 5. Language Support

- Use the language switcher in the header
- Supports English and Russian

## 🧪 Testing

Run the test suite:

```bash
# Run all tests with coverage
npm run test


# Run specific test file
npm run test -- HistorySection.test.tsx
```

## 🔧 Development Tools

The project includes several development tools:

- **ESLint**: Code linting and quality checks
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **TypeScript**: Type safety
- **Jest**: Testing framework

## 🚀 Deployment

### Local Production Build

```bash
# Build the application
npm run build

# Start production server
npm run start
```


## 🌍 Environment Variables Reference

| Variable                        | Description           | Required | Example                                        |
| ------------------------------- | --------------------- | -------- | ---------------------------------------------- |
| `NEXTAUTH_URL`                  | Application URL       | Yes      | `http://localhost:3000`                        |
| `NEXTAUTH_SECRET`               | Authentication secret | Yes      | `nX1lm3FU7lKlrmn5eKn/uOaavLwB7rQOL866tTfqMcI=` |
| `DATABASE_URL`                  | Database connection   | Yes      | `file:./dev.db`                                |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL  | Yes      | `https://brjjybqngljiagmfukfa.supabase.co`     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key     | Yes      | `eyJhbGciOiJIUzI1NiIs...`                      |

**� Ready-to-use Configuration:**
The provided Supabase keys above are for the demo environment and can be used directly for testing and development.



## 👥 Team

- **Daniil Terekhin** - Frontend Developer - [GitHub](https://github.com/daniilka48)
- **Gulia Isaeva Çöloğlu** - Frontend Developer - [GitHub](https://github.com/guliaisaeva)

## 🆘 Troubleshooting

### Common Issues:

1. **Prisma Client Error**:

   ```bash
   npx prisma generate
   ```

2. **Port Already in Use**:

   ```bash
   npm run dev -- -p 3001
   ```

3. **Module Not Found**:

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Database Issues**:
   ```bash
   npx prisma db push --force-reset
   ```

### Getting Help:

- Check the [Issues](https://github.com/Daniilka48/rest-client-app/issues) section
- Create a new issue with detailed error information

---

**Happy API Testing! 🚀**
