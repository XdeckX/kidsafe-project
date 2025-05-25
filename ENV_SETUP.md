# Environment Variables Setup for KidSafe Project

When deploying the KidSafe project to Vercel, you'll need to set up the following environment variables to ensure proper connection to your Supabase backend.

## Required Environment Variables

### For Local Development

Create a `.env.local` file in the `apps/web` directory with these variables:

```
# Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Optional: Feature flags
NEXT_PUBLIC_ENABLE_MIGRATION=true
```

### For Vercel Deployment

Add these same variables in the Vercel project settings:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add each of the variables mentioned above
4. Deploy or redeploy your application

## Where to Find These Values

### Supabase Variables

1. Log in to [Supabase](https://app.supabase.com/)
2. Select your project
3. Go to Project Settings > API
4. Under "Project API keys" you'll find:
   - Project URL: Use this as `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public`: Use this as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key: Use this as `SUPABASE_SERVICE_ROLE_KEY` (Keep this secure! Only use for trusted admin operations)

## Important Security Notes

- Never commit `.env.local` files to your repository
- The `SUPABASE_SERVICE_ROLE_KEY` has admin privileges - only use it for server-side operations
- The `anon` key is public and can be used in the browser, but should only have access to data permitted by your Row Level Security policies

## Testing Your Configuration

After setting up these environment variables, you can verify they're working by:

1. Running your application locally with `npm run dev`
2. Navigating to `/migration` to test the Supabase connection
3. Check the browser console for any connection errors
