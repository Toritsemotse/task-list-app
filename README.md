# Task List Application

A feature-rich task management application built with Vue 3, TypeScript, and Tailwind CSS. This application provides a clean, modern interface for managing tasks with authentication, filtering, search, and dark mode support.

## Features Implemented

- **User Authentication**: Secure login system with mock authentication
- **Task Management**: Complete CRUD (Create, Read, Update, Delete) operations for tasks
- **Task Dashboard**: Expandable task rows with details, status indicators, assignees, and due dates
- **Search & Filter**: Search tasks by keyword and filter by status (All, In Progress, Completed)
- **Dark Mode**: User preference toggle for light/dark theme with localStorage persistence
- **Responsive Design**: Mobile-first approach with responsive layouts for all screen sizes
- **Form Validation**: Proper validation for adding and editing tasks
- **State Management**: Centralized state management using Pinia
- **Task Editing**: In-place editing of task details with modal interface
- **Task Status Management**: Ability to mark tasks as completed/in-progress with visual indicators

## Login Credentials

For testing the application, you can use the following credentials:

- **User Account**: 
  - Email: `user@example.com`
  - Password: `password123`
  
- **Admin Account**:
  - Email: `admin@example.com`
  - Password: `adminpass`

## Architecture & Codebase Structure

The application follows modern Vue.js best practices with a well-organized component structure:

```
src/
├── assets/              # Static assets and styles
├── components/          # Reusable Vue components
│   ├── LoginForm.vue    # Authentication form
│   ├── TaskList.vue     # Main task listing component
│   ├── TaskRow.vue      # Individual task row
│   ├── TaskDetails.vue  # Task detail view
│   └── TaskEditModal.vue # Task editing modal
├── composables/         # Reusable logic (useApi)
├── mock-api/            # Mock data files and API implementation
│   ├── login.json       # Authentication credentials
│   └── tasks.json       # Sample task data
├── router/              # Vue Router configuration
├── stores/              # Pinia state management
│   ├── auth.ts          # Authentication store
│   └── tasks.ts         # Tasks store
├── types/               # TypeScript interfaces
└── views/               # Route-level components
    ├── LoginView.vue
    └── DashboardView.vue
```

**Key Technologies:**
- Vue 3 (Composition API)
- TypeScript
- Pinia (State Management)
- Vue Router
- Tailwind CSS
- Vite (Build Tool)

## Trade-offs & Shortcuts

This application implements several trade-offs for rapid development:

- **Mock API**: Uses JSON files instead of a real backend, storing data in memory (data is lost on refresh)
- **Basic Authentication**: Simple token-based auth with hardcoded credentials in JSON files
- **In-memory Storage**: Task data persists only during the session
- **Simplified Validation**: Basic form validation without comprehensive field checks
- **Client-side Only**: No server-side rendering or complex backend integration
- **Shared Auth Token**: Uses a global variable for authentication instead of proper session management
- **Development Logs**: Console logs left in the code for debugging

## Potential Improvements

- **Enhanced UI/UX**: Drag-and-drop functionality, bulk operations, advanced filtering
- **File Attachments**: Allow attaching files to tasks
- **Task Categories**: Add tagging or categorization system
- **Notifications**: Email or push notifications for task updates

## Getting Started

### Prerequisites

- Node.js (version 20.19.0 or >=22.12.0)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd task-list-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To build the application for production deployment:

```bash
npm run build
```

This will create a `dist` folder with the optimized build ready for deployment.

### Development Scripts

- `npm run dev`: Start development server with hot reloading
- `npm run build`: Build for production
- `npm run preview`: Preview the production build locally
- `npm run type-check`: Run TypeScript type checking
- `npm run format`: Format code using Prettier

## Project Configuration

- **TypeScript**: Configured with strict type checking
- **Tailwind CSS**: Customized for the glass morphism design
- **Vite**: Optimized for fast development and building
- **Prettier**: Code formatting configured for consistency

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
