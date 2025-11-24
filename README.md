# Nuxt 4 + Supabase Todo App with Authentication

This project showcases how to build a full-stack application using **Supabase's frontend client library directly** for both authentication and database operations - demonstrating the simplicity and power of Supabase's client-side SDK.

It was built for the course Studio Web and Mobile I at HSLU Digital Ideation in Autumn 2025 by Nick Schneeberger.

### Quicklinks

- [Tailwind CSS v4 Setup & Customization Guide](tailwind.md)
- [Tutorial for Media Uploads (Avatar)](profile.md)
- [Tutorial for Google Login](google-login.md)

## 🎯 What This Project Demonstrates

### 1. **Frontend-First Supabase Architecture**

This application uses Supabase's frontend client library directly in Vue components for both authentication and todo management. This approach:

- **Simplified architecture** - Direct database access from components using Supabase SDK
- **Rapid development** - No need for custom API routes or backend logic
- **Built-in authentication** - Leverage Supabase's auth system seamlessly
- ⚠️ **Requires RLS policies** - Database security is handled by Supabase Row Level Security

### 2. **Direct Client-Side Database Access**

The application uses a simple, straightforward architecture:

```
┌─────────────────────────────────────────────────────────────┐
│  Vue Components (Pages & Components)                        │
│  • app/pages/index.vue (Todo list + User profile)           │
│  • app/pages/login.vue (Authentication)                     │
│  • app/pages/register.vue (User registration)               │
│                                                              │
│  Components interact directly with Supabase client          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Supabase Client (Frontend Library)                         │
│  • app/composables/useSupabaseClient.js                     │
│  • Handles all auth & database operations                   │
│  • Uses anon key (public, safe to expose)                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Supabase Cloud                                             │
│  • Authentication & user management                         │
│  • PostgreSQL database with todos table                     │
│  • Row Level Security (RLS) policies for security           │
└─────────────────────────────────────────────────────────────┘
```

**Why This Approach Works Well:**

- Perfect for apps with user-specific data (todos belong to users)
- Supabase handles authentication and authorization automatically
- RLS policies ensure users can only access their own data
- No custom backend code needed - focus on the frontend

### 3. **Supabase Authentication + Row Level Security**

This project uses Supabase's **anon/public key** with authentication and RLS:

- **Secure authentication** - Built-in email/password authentication
- **Row Level Security** - Database policies ensure data isolation per user
- **Public key is safe** - Designed to be used in the browser
- **User context** - Supabase automatically tracks the authenticated user

> **Note**: You must configure proper RLS policies in Supabase to ensure users can only access their own todos. This provides security without custom backend logic.

## 🚀 Features

- **User Authentication** - Register, login, logout functionality
- **User Profile Page** - View profile with profile picture upload (simple example)
- **Create** new todos (tied to authenticated user)
- **Read** todos from database (user-specific, automatically filtered by RLS)
- **Update** todo status (mark as complete)
- **Delete** todos
- **Auth Protection** - Redirects to login if not authenticated
- **Input validation** on the frontend
- **Error handling** with user-friendly messages
- **Empty state** when no todos exist
- **Row Level Security** - Users can only access their own todos (database-level security)

## 📁 Project Structure

```
stuw1-demo-todo-with-login/
├── app/
│   ├── pages/
│   │   ├── index.vue              # Main page (todos + user profile)
│   │   ├── login.vue              # Login page
│   │   ├── register.vue           # Registration page
│   │   └── profile.vue            # Profile page with picture upload (optional)
│   ├── composables/
│   │   └── useSupabaseClient.js   # Supabase client setup
│   └── components/
│       ├── TodoForm.vue           # Todo input form component (optional)
│       └── TodoList.vue           # Todo list display component (optional)
├── nuxt.config.ts                 # Nuxt configuration
├── package.json                   # Dependencies
├── profile.md                     # Tutorial: How to add profile pictures
└── README.md                      # This file
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project (free tier works!)

### 1. Clone the Repository

```bash
git clone https://github.com/digitalideation/stuw1-demo-todo-with-login.git
cd stuw1-demo-todo-with-login
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Todos Table

In your Supabase project, create a table named `todos`:

```sql
CREATE TABLE todos (
  id BIGSERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Set Up Row Level Security (RLS) Policies

Enable RLS and create policies to ensure users can only access their own todos:

```sql
-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own todos
CREATE POLICY "Users can view their own todos"
  ON todos FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own todos
CREATE POLICY "Users can insert their own todos"
  ON todos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own todos
CREATE POLICY "Users can update their own todos"
  ON todos FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own todos
CREATE POLICY "Users can delete their own todos"
  ON todos FOR DELETE
  USING (auth.uid() = user_id);
```

#### Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy your:
   - Project URL
   - `anon public` key (✅ This is the **public** key, safe for browser use)

### 4. Configure Supabase Client

Update the `app/composables/useSupabaseClient.js` file with your credentials:

```javascript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://your-project.supabase.co",
  "your-anon-public-key-here"
);
```

⚠️ **Important**:

- The anon/public key is safe to use in the browser
- RLS policies protect your data at the database level
- Never use the service_role key in frontend code

### 5. Run the Development Server

```bash
npm run dev
```

If that doesn't work, try:

```bash
nuxt dev
```

The application will be available at `http://localhost:3000`

### 6. (Optional) Add Profile Pictures

Want to add profile picture uploads? See **[profile.md](./profile.md)** for a simple 5-minute tutorial on using Supabase Storage.

## 🔄 How It Works (Request Flow)

Let's trace what happens when you add a new todo:

1. **User types** in the input field and clicks "Add"
2. **`index.vue`** validates the input and calls `addTodo()`
3. **Supabase client** directly inserts the todo into the database:
   - Uses the authenticated user's session automatically
   - Supabase checks RLS policies to ensure user has permission
   - Database inserts the todo with the user's `user_id`
4. **`index.vue`** fetches the updated todo list from Supabase
5. **Component re-renders** with the new todo displayed

**Authentication Flow:**

1. User registers/logs in via `login.vue` or `register.vue`
2. Supabase creates an auth session stored in browser
3. User is redirected to `index.vue` which shows their profile and todos
4. All subsequent database requests include the user's session automatically
5. RLS policies ensure users only see/modify their own todos
6. User can logout directly from the index page

## 🔐 Security Notes

**How security works in this app:**

- **Row Level Security (RLS)** - Database-level security policies ensure data isolation
- **Authenticated sessions** - Supabase manages JWT tokens automatically
- **Public key is safe** - The anon/public key is designed for browser use
- **User context** - RLS policies use `auth.uid()` to filter data per user
- **Automatic filtering** - Users automatically only see their own todos (no manual filtering needed in code!)

**Why this is secure:**

- Users can **only** access their own todos (enforced by RLS policies at the database level)
- No sensitive keys exposed in the frontend
- Supabase handles authentication, session management, and security
- Even if someone inspects the network requests, they can't access other users' data
- The `user_id` column is automatically set and checked by RLS policies

**Best practices:**

- Always enable RLS on tables containing user data
- Test your RLS policies thoroughly
- Use Supabase's built-in auth features (email verification, password reset, etc.)
- Add rate limiting for production apps (Supabase has this built-in for auth)

### 🎓 Important: How RLS Automatically Filters Data

One of the most powerful features of this approach is that **you don't need to manually filter data by user**. Notice in `index.vue` that we simply query:

```javascript
const { data } = await supabase.from("todos").select("*");
```

We **don't** need to do:

```javascript
// NOT NEEDED with RLS! ❌
const { data } = await supabase
  .from("todos")
  .select("*")
  .eq("user_id", user.id);
```

**Why?** Because the RLS policies automatically filter the results based on the authenticated user's session! Supabase knows who is logged in and only returns/allows modifications to that user's data. This makes your code simpler AND more secure.

## 📚 Additional Resources

- [Nuxt 4 Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/)
- [Supabase Documentation](https://supabase.com/docs)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 📝 License

MIT - Feel free to use this for educational purposes!

## 🤝 Contributing

This is an educational project. Feel free to fork and experiment!

---

**Happy Coding! 🚀**
