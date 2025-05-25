# KidSafe Project - Deployment Guide

This guide will walk you through deploying the KidSafe project with Supabase for backend and Vercel for frontend.

## 1. Supabase Setup

### Create a Supabase Project

1. Go to [https://app.supabase.com/](https://app.supabase.com/) and sign in
2. Click "New Project"
3. Enter project details:
   - Name: `kidsafe`
   - Database Password: Create a strong password
   - Region: Choose the closest to your users
4. Click "Create new project" and wait for it to be created

### Run Database Migrations

1. Once your project is created, go to the SQL Editor
2. Copy the contents of `supabase/migration-setup.sql` from this repository
3. Paste it into the SQL Editor and run the query
4. This will create all the necessary tables and security policies

### Get API Keys

1. In your Supabase project, go to Project Settings > API
2. Copy the "URL" and "anon public" key
3. You'll need these for your frontend deployment

## 2. Frontend Setup with Vercel

### Push Code to GitHub

If you haven't already, push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Deploy to Vercel

1. Go to [https://vercel.com/](https://vercel.com/) and sign in
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `apps/web`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
6. Click "Deploy"

## 3. Data Migration

To migrate your existing localStorage data to Supabase:

1. After deployment, open your application
2. Open the browser console (F12)
3. Run the following code:

```javascript
import { migrateToSupabase } from './lib/migrateToSupabase';
migrateToSupabase().then(() => console.log('Migration complete!'));
```

Alternatively, add a migration button to your application that calls this function.

## 4. Verify Deployment

1. Test the application thoroughly, ensuring that:
   - Child profiles load correctly
   - Approved channels are displayed
   - Videos from approved channels are shown
   - Adding/removing channels works properly

## 5. Common Issues and Troubleshooting

### CORS Errors
If you encounter CORS errors, ensure that your application's domain is added to the Supabase CORS allowed list:
1. Go to Supabase Project Settings > API
2. Under CORS, add your Vercel domain to the allowed origins

### Authentication Issues
If user authentication fails:
1. Check that you're using the correct Supabase URL and anon key
2. Verify that RLS policies are correctly configured

### Data Not Loading
If data doesn't load properly:
1. Check browser console for errors
2. Verify that localStorage migration was successful
3. Check that the Supabase tables are properly created with the expected schema
