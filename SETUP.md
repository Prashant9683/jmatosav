# Environment Setup

## Supabase Configuration

To fix the volunteer form submission error, you need to set up your Supabase environment variables.

### Steps:

1. Create a `.env.local` file in the root directory of your project
2. Add the following environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### How to get your Supabase credentials:

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project (or create a new one)
3. Go to Settings → API
4. Copy the "Project URL" and "anon public" key
5. Replace the placeholder values in your `.env.local` file

### Example:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Database Table

Make sure your Supabase database has a `volunteers` table with the following columns:

- `id` (serial, primary key)
- `full_name` (text, not null)
- `email` (text, not null)
- `phone_number` (text, nullable)
- `reason_for_volunteering` (text, nullable)
- `status` (text, default: 'pending')
- `created_at` (timestamp, default: now())

After setting up the environment variables, restart your development server:

```bash
npm run dev
```

The volunteer form should now work correctly!
