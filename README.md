# Documents App — Setup Guide

A secure, user-specific document storage application built with React and Supabase.

---

## Prerequisites

Make sure the following are installed on your machine before proceeding:

| Tool | Minimum Version | Download |
|------|----------------|----------|
| Node.js | v18+ | https://nodejs.org |
| npm | v9+ | Comes with Node.js |

You will also need a **Supabase account** and project. Sign up for free at https://supabase.com.

---

## Environment Setup

### 1. Clone the repository

```bash
git clone git@github.com:UsamaMushtaq16/Documents-Supabase-App.git
cd Documents-Supabase-App
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root of the `Documents-Supabase-App` folder:

```bash
# Documents-Supabase-App/.env

REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-public-key
```

> **Where to find these values:**
> 1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
> 2. Select your project
> 3. Navigate to **Project Settings → API**
> 4. Copy the **Project URL** and the **`anon` `public`** key

### 4. Set up Supabase — Database Table

Run the following SQL in the **Supabase SQL Editor** (Dashboard → SQL Editor → New query):

```sql
create table documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  file_url text not null,
  created_at timestamptz default now()
);
```

### 5. Set up Supabase — Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name it exactly: `documents`
4. Leave it as **Private** (access is controlled via signed URLs)

### 6. Enable Row Level Security (RLS)

RLS ensures each user can only see and manage their own documents. Run in the SQL Editor:

```sql
-- Enable RLS on the table
alter table documents enable row level security;

-- Users can only read their own documents
create policy "Users can view own documents"
  on documents for select
  using (auth.uid() = user_id);

-- Users can only insert their own documents
create policy "Users can insert own documents"
  on documents for insert
  with check (auth.uid() = user_id);

-- Users can only delete their own documents
create policy "Users can delete own documents"
  on documents for delete
  using (auth.uid() = user_id);
```

Also apply a storage policy so users can only access their own files:

```sql
-- Allow users to upload files to their own folder
create policy "Users can upload own files"
  on storage.objects for insert
  with check (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to read their own files
create policy "Users can read own files"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own files
create policy "Users can delete own files"
  on storage.objects for delete
  using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 7. Create a user account

In Supabase Dashboard, go to **Authentication → Users → Add user** and create a user with an email and password. This is the account you will log in with.

---

## Running the App

```bash
npm start
```

Opens the app at [http://localhost:3000](http://localhost:3000). The page hot-reloads on file changes.

---

## How to Use the App

1. **Sign in** — Enter your email and password on the login screen and click **Sign in**.

2. **Upload a document** — On the home screen, enter a title for your document, select a file from your machine, and click **Upload**. The file is securely stored in Supabase Storage and its metadata is saved to the database.

3. **Open a document** — Click **Open** next to any document to view it in a new browser tab. Links are valid for 7 days (signed URLs).

4. **Delete a document** — Click **Delete** next to a document and confirm the prompt. Both the database record and the file in storage are permanently removed.

5. **Sign out** — Click **Sign out** in the header to end your session securely.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the development server at `localhost:3000` |
| `npm run build` | Create an optimised production build in `/build` |
| `npm test` | Run the test suite in watch mode |
