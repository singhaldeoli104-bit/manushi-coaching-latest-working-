# Supabase Database Migrations - Parent Section

This directory contains all database migrations for the Parent Section of the educational platform. The migrations are designed to work with Supabase (PostgreSQL) and include tables, functions, triggers, RLS policies, and seed data.

## Migration Files Overview

| File | Description | Tables Created |
|------|-------------|----------------|
| **001_create_parent_tables.sql** | Core parent section tables | parents, schools, children, parent_child_relationships, academic_records, financial_transactions, communications, action_items, notifications |
| **002_create_ai_insights_tables.sql** | AI-powered insights and predictions | ai_insights, risk_factors, opportunities, behavior_trends, academic_predictions, recommended_actions |
| **003_create_school_announcement_tables.sql** | School communications and events | school_announcements, announcement_reads, school_contacts, school_events, event_rsvps, school_documents, document_downloads |
| **004_create_calendar_attendance_tables.sql** | Calendar and attendance tracking | calendar_events, attendance_records, attendance_summary, homework_assignments, study_sessions, exam_schedule |
| **005_create_helper_functions.sql** | Utility functions and stored procedures | 12+ helper functions |
| **006_create_triggers_and_automations.sql** | Automated business logic | 14+ triggers for notifications and data sync |
| **007_create_seed_data.sql** | Sample data for testing | Seed data for all tables (DEV ONLY) |

## Total Database Schema

### Tables Created: 28
### Functions Created: 12
### Triggers Created: 14
### RLS Policies: 50+

## Prerequisites

Before running migrations:

1. **Supabase Project**: You must have a Supabase project set up
2. **Supabase MCP**: Supabase MCP server should be connected
3. **Database Access**: Admin access to your Supabase PostgreSQL database
4. **UUID Extension**: Ensure `uuid-ossp` extension is enabled (Supabase enables by default)

## Running Migrations

### Option 1: Using Supabase Dashboard (Recommended)

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run migrations in order:

```sql
-- 1. Core tables
\i 001_create_parent_tables.sql

-- 2. AI insights
\i 002_create_ai_insights_tables.sql

-- 3. School communications
\i 003_create_school_announcement_tables.sql

-- 4. Calendar & attendance
\i 004_create_calendar_attendance_tables.sql

-- 5. Helper functions
\i 005_create_helper_functions.sql

-- 6. Triggers & automations
\i 006_create_triggers_and_automations.sql

-- 7. Seed data (DEVELOPMENT ONLY!)
-- \i 007_create_seed_data.sql
```

### Option 2: Using Supabase CLI

```bash
# Make sure you're in the project directory
cd C:\PC

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push --include-seed
```

### Option 3: Using psql (Direct PostgreSQL Connection)

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Run each migration file
\i supabase_migrations/001_create_parent_tables.sql
\i supabase_migrations/002_create_ai_insights_tables.sql
\i supabase_migrations/003_create_school_announcement_tables.sql
\i supabase_migrations/004_create_calendar_attendance_tables.sql
\i supabase_migrations/005_create_helper_functions.sql
\i supabase_migrations/006_create_triggers_and_automations.sql
# \i supabase_migrations/007_create_seed_data.sql  # DEV ONLY
```

## Important Notes

### 1. Migration Order
**CRITICAL**: Migrations MUST be run in numerical order (001 → 007) as they have dependencies on each other.

### 2. Seed Data (007)
- **DO NOT** run `007_create_seed_data.sql` in production!
- This file is for development and testing only
- It contains sample schools, parents, children, and other test data
- Requires manual creation of test users in Supabase Auth

### 3. Row Level Security (RLS)
All tables have RLS enabled with policies that ensure:
- Parents can only access their own children's data
- Users can only read their own notifications
- School-specific data is isolated by school_id

### 4. Triggers
Several triggers are enabled for:
- Auto-updating `updated_at` timestamps
- Creating notifications automatically
- Syncing school events to calendars
- Updating attendance summaries
- Tracking view counts and downloads

## Key Functions Available

After running migrations, these functions are available:

1. `get_parent_children(user_id)` - Get all children for a parent
2. `calculate_attendance_percentage(child_id, start_date, end_date)` - Calculate attendance %
3. `get_academic_performance_summary(child_id, academic_year)` - Get grades summary
4. `get_unread_notifications_count(user_id)` - Count unread notifications
5. `mark_notification_read(notification_id, user_id)` - Mark notification as read
6. `get_financial_summary(parent_id, academic_year)` - Get financial overview
7. `get_upcoming_events(user_id, days_ahead)` - Get upcoming calendar events
8. `get_action_items_summary(parent_id)` - Get action items summary
9. `get_child_dashboard_data(child_id)` - Get comprehensive dashboard data
10. `search_communications(user_id, search_term)` - Search messages
11. `get_active_risk_factors(child_id)` - Get risk factors for child
12. `update_attendance_summary_for_month(child_id, year, month)` - Update attendance stats

## Testing the Setup

After migrations complete, verify setup:

```sql
-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Check functions exist
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION';

-- Check triggers exist
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

## Sample API Usage (After Migration)

### TypeScript/JavaScript with Supabase Client

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Get parent's children
const { data: children } = await supabase
  .rpc('get_parent_children', { p_user_id: userId });

// Get attendance percentage
const { data: percentage } = await supabase
  .rpc('calculate_attendance_percentage', {
    p_child_id: childId,
    p_start_date: '2024-01-01',
    p_end_date: '2024-12-31'
  });

// Get unread notifications count
const { data: count } = await supabase
  .rpc('get_unread_notifications_count', { p_user_id: userId });

// Subscribe to notifications (real-time)
const channel = supabase
  .channel('notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('New notification:', payload.new);
  })
  .subscribe();
```

## Real-time Subscriptions

The following tables support real-time updates:

- `notifications` - Live notification updates
- `communications` - New messages
- `school_announcements` - New announcements
- `attendance_records` - Attendance updates
- `academic_records` - New grades
- `financial_transactions` - Payment updates
- `ai_insights` - New AI insights

## Security Considerations

1. **RLS Policies**: All tables have Row Level Security enabled
2. **User Isolation**: Parents can only access their children's data
3. **Function Security**: Helper functions use `SECURITY DEFINER` where needed
4. **Triggers**: Automated notifications respect RLS policies
5. **Data Validation**: Triggers validate data before insert/update

## Troubleshooting

### Issue: "relation does not exist"
**Solution**: Run migrations in order starting from 001

### Issue: "function does not exist"
**Solution**: Ensure 005_create_helper_functions.sql has been run

### Issue: "permission denied"
**Solution**: Check that you have admin access to the database

### Issue: RLS blocking queries
**Solution**: Ensure you're authenticating with the correct user_id

### Issue: Triggers not firing
**Solution**: Check that 006_create_triggers_and_automations.sql completed successfully

## Next Steps After Migration

1. **Create Test Users**: Set up test users in Supabase Auth
2. **Update API Service**: Update frontend API calls to use real Supabase queries
3. **Replace Mock Data**: Remove all hardcoded mock data from React Native components
4. **Test RLS**: Verify RLS policies work correctly with different users
5. **Setup Real-time**: Implement real-time subscriptions for live updates
6. **Add Indexes**: Monitor query performance and add additional indexes if needed
7. **Setup Backup**: Configure automated backups for production

## Rollback Plan

If you need to rollback migrations:

```sql
-- Drop all triggers
DROP TRIGGER IF EXISTS trigger_name ON table_name;

-- Drop all functions
DROP FUNCTION IF EXISTS function_name;

-- Drop all tables (in reverse order)
DROP TABLE IF EXISTS table_name CASCADE;
```

## Migration Checklist

- [ ] Verify Supabase project is set up
- [ ] Confirm database access credentials
- [ ] Run migration 001 (core tables)
- [ ] Run migration 002 (AI insights)
- [ ] Run migration 003 (school communications)
- [ ] Run migration 004 (calendar & attendance)
- [ ] Run migration 005 (helper functions)
- [ ] Run migration 006 (triggers & automations)
- [ ] (Optional) Run migration 007 (seed data - DEV ONLY)
- [ ] Verify all tables exist
- [ ] Verify RLS is enabled
- [ ] Test helper functions
- [ ] Test real-time subscriptions
- [ ] Update frontend API calls
- [ ] Remove mock data from components
- [ ] Test with real user authentication

## Support

If you encounter issues:

1. Check Supabase dashboard logs
2. Review migration error messages
3. Verify user authentication setup
4. Test RLS policies in SQL editor
5. Check trigger execution logs

## Database Schema Diagram

```
┌─────────────┐
│   parents   │
└──────┬──────┘
       │
       │ 1:N
       ▼
┌──────────────────────────┐      ┌──────────────┐
│ parent_child_relationships├──────┤   children   │
└──────────────────────────┘ N:M  └──────┬───────┘
                                          │
                              ┌───────────┼───────────┐
                              │           │           │
                              ▼           ▼           ▼
                    ┌──────────────┐ ┌──────────┐ ┌──────────────┐
                    │ ai_insights  │ │academic_ │ │ attendance_  │
                    │              │ │records   │ │ records      │
                    └──────────────┘ └──────────┘ └──────────────┘
```

## License

This migration set is part of the Parent Section backend infrastructure for an educational platform.

---

**Created**: October 2024
**Last Updated**: October 2024
**Version**: 1.0.0
**Compatible with**: Supabase PostgreSQL 15+
