# Supabase Setup Guide

This project uses Supabase for both database (PostgreSQL) and file storage.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Name: `diecast-tracker` (or any name you prefer)
   - Database Password: Create a strong password (save this!)
   - Region: Choose closest to you
4. Wait for the project to be created (takes ~2 minutes)

## Step 2: Get Your Database Connection String

1. In your Supabase dashboard, go to **Project Settings** (gear icon)
2. Click on **Database** in the left sidebar
3. Scroll down to **Connection string**
4. Select **URI** tab
5. Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
6. Replace `[YOUR-PASSWORD]` with the database password you created in Step 1
7. Paste this into your `.env` file as `DATABASE_URL`

## Step 3: Get Your Supabase API Keys

1. Still in **Project Settings**, click on **API** in the left sidebar
2. You'll see:
   - **Project URL** - Copy this as `SUPABASE_URL`
   - **anon public** key - Copy this as `SUPABASE_ANON_KEY` (optional, for client-side if needed)
   - **service_role** key - Copy this as `SUPABASE_SERVICE_ROLE_KEY` (required for storage)

3. Add these to your `.env` file

## Step 4: Create Storage Bucket

1. In your Supabase dashboard, go to **Storage** in the left sidebar
2. Click **New bucket**
3. Name it: `images`
4. Make it **Public** (so images can be accessed via URL)
5. Click **Create bucket**

## Step 5: Set Up Your .env File

Your `.env` file should look like this:

```env
DATABASE_URL=postgresql://postgres:your-actual-password@db.xxxxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 6: Initialize Database

Run the database setup script to create tables:

```bash
npm run db:setup
```

This will:
- Create the necessary database tables
- Set up the schema
- Seed initial brand data

## Step 7: Start Development

```bash
npm run dev
```

Your app should now be connected to Supabase!

## Troubleshooting

### "DATABASE_URL environment variable is not set"
- Make sure your `.env` file is in the project root
- Restart your dev server after adding environment variables

### "Storage not configured"
- Make sure you've set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env`
- Make sure you've created the `images` storage bucket in Supabase

### Connection errors
- Verify your database password is correct in the connection string
- Make sure you replaced `[YOUR-PASSWORD]` with your actual password
- Check that your Supabase project is active (not paused)

