# How to Run Migrations Using Supabase MCP in Cursor

Since Supabase MCP is connected to your Cursor environment, you can run the migrations directly using Cursor's MCP integration.

## Method 1: Using Cursor Composer (Recommended)

1. Open **Cursor Composer** (Cmd/Ctrl + I)

2. Run each migration in order by typing:

```
@supabase apply migration from C:\PC\supabase_migrations\001_create_parent_tables.sql
```

3. Repeat for all migrations:

```
@supabase apply migration from C:\PC\supabase_migrations\002_create_ai_insights_tables.sql
@supabase apply migration from C:\PC\supabase_migrations\003_create_school_announcement_tables.sql
@supabase apply migration from C:\PC\supabase_migrations\004_create_calendar_attendance_tables.sql
@supabase apply migration from C:\PC\supabase_migrations\005_create_helper_functions.sql
@supabase apply migration from C:\PC\supabase_migrations\006_create_triggers_and_automations.sql
```

4. (Optional) For test data:
```
@supabase apply migration from C:\PC\supabase_migrations\007_create_seed_data.sql
```

## Method 2: Direct Chat Commands

Open Cursor Chat and paste this:

```
Use the apply_migration MCP tool to run these migrations in order:

1. C:\PC\supabase_migrations\001_create_parent_tables.sql
2. C:\PC\supabase_migrations\002_create_ai_insights_tables.sql
3. C:\PC\supabase_migrations\003_create_school_announcement_tables.sql
4. C:\PC\supabase_migrations\004_create_calendar_attendance_tables.sql
5. C:\PC\supabase_migrations\005_create_helper_functions.sql
6. C:\PC\supabase_migrations\006_create_triggers_and_automations.sql

Run them one by one and confirm each completes successfully.
```

## Method 3: Copy-Paste SQL

For each migration file:

1. Open the file in Cursor
2. Copy all content (Ctrl+A, Ctrl+C)
3. Go to Cursor Chat
4. Type: "Apply this migration using apply_migration MCP tool:"
5. Paste the SQL
6. Cursor will execute it via Supabase MCP

## Method 4: Using Supabase Dashboard (Alternative)

If MCP doesn't work for any reason:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of each migration file
4. Paste and run in SQL Editor
5. Repeat for all migrations

## Verification Commands

After running all migrations, verify in Cursor Chat:

```
@supabase list all tables in my database
```

Or:

```
@supabase execute this SQL:
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see 28 tables.

## Check Functions

```
@supabase execute this SQL:
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
ORDER BY routine_name;
```

You should see 12 functions.

## Check Triggers

```
@supabase execute this SQL:
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;
```

You should see 14+ triggers.

## Expected Results

After all migrations:
- ✅ 28 tables created
- ✅ 12 helper functions
- ✅ 14 automated triggers
- ✅ 50+ RLS policies
- ✅ 100+ indexes

## Troubleshooting

**If you get "MCP tool not found":**
- Make sure you're in Cursor (not VS Code)
- Verify Supabase MCP is connected: run `claude mcp list` in terminal
- Restart Cursor if needed

**If migrations fail:**
- Run them one at a time
- Check error messages carefully
- Some errors are OK if re-running (e.g., "already exists")

**If RLS blocks access:**
- Make sure you're authenticated in Supabase
- Check your user ID matches the RLS policies

## Next Steps After Migrations

1. Verify all tables exist
2. Test helper functions
3. Update frontend API calls to use Supabase
4. Remove mock data from React Native components
5. Test with real authentication

---

**Need Help?**

If MCP tools aren't working, provide me with your Supabase PostgreSQL connection string and I can run the migrations using direct psql connection.

Format:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```
