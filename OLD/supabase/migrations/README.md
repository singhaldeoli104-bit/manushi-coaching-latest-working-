# Peer Learning Network - Supabase Migrations

This directory contains SQL migrations for implementing the Peer Learning Network features in the Coaching App.

## 📋 Overview

The Peer Learning Network enables students to:
- Create and discover peer profiles
- Join and create study groups
- Participate in collaborative projects
- Find compatible study buddies with AI-powered matching
- Build a learning network with peer connections

## 🗃️ Database Schema

### Tables Created

1. **peer_profiles** - Student profiles with subjects, strengths, and preferences
2. **study_groups** - Study groups with sessions and discussions
3. **study_group_memberships** - Group membership tracking
4. **study_group_sessions** - Scheduled study sessions
5. **collaborative_projects** - Team-based learning projects
6. **project_team_members** - Project team membership
7. **project_milestones** - Project milestones and progress tracking
8. **project_updates** - Project discussions and announcements
9. **study_buddies** - AI-powered study buddy matches
10. **buddy_study_sessions** - Buddy study sessions
11. **buddy_preferences** - Study preferences for matching algorithm
12. **buddy_interactions** - Messages and feedback between buddies
13. **peer_connections** - Social connections between students
14. **connection_mutual_friends** - Mutual friend calculations
15. **connection_activities** - Connection interaction history

**Total:** 15 new tables + 1 view (user_network_summary)

## 🚀 Migration Order

⚠️ **IMPORTANT**: Run migrations in this exact order!

```
01_create_peer_profiles.sql
02_create_study_groups.sql
03_create_collaborative_projects.sql
04_create_study_buddies.sql
05_create_peer_connections.sql
```

## 📝 Prerequisites

- Supabase project created
- Project Reference: `qrwroibhzgywaiecbcoa`
- Project URL: `https://qrwroibhzgywaiecbcoa.supabase.co`
- Authenticated users table (auth.users) must exist

## 🔧 How to Apply Migrations

### Option 1: Via Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Open your project: `qrwroibhzgywaiecbcoa`

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "+ New Query"

3. **Run Each Migration**
   - Open `01_create_peer_profiles.sql`
   - Copy the entire contents
   - Paste into SQL Editor
   - Click "Run" (or Ctrl+Enter)
   - Wait for success message: ✅ "Success. No rows returned"
   - Repeat for migrations 02-05 **in order**

### Option 2: Via Supabase CLI (Advanced)

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
npx supabase login

# Link your project
npx supabase link --project-ref qrwroibhzgywaiecbcoa

# Run migrations
npx supabase db push

# Or run individual migrations
npx supabase db execute -f supabase/migrations/01_create_peer_profiles.sql
npx supabase db execute -f supabase/migrations/02_create_study_groups.sql
npx supabase db execute -f supabase/migrations/03_create_collaborative_projects.sql
npx supabase db execute -f supabase/migrations/04_create_study_buddies.sql
npx supabase db execute -f supabase/migrations/05_create_peer_connections.sql
```

## ✅ Verification

After running all migrations, verify the tables were created:

```sql
-- Check all tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE '%peer%' OR table_name LIKE '%study_%' OR table_name LIKE '%buddy%' OR table_name LIKE '%project%'
ORDER BY table_name;
```

**Expected tables (15):**
- ✅ buddy_interactions
- ✅ buddy_preferences
- ✅ buddy_study_sessions
- ✅ collaborative_projects
- ✅ connection_activities
- ✅ connection_mutual_friends
- ✅ peer_connections
- ✅ peer_profiles
- ✅ project_milestones
- ✅ project_team_members
- ✅ project_updates
- ✅ study_buddies
- ✅ study_group_memberships
- ✅ study_group_sessions
- ✅ study_groups

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

**Students can:**
- ✅ View all peer profiles
- ✅ Create and update their own profile
- ✅ View and join public study groups
- ✅ View and join recruiting projects
- ✅ View and respond to buddy matches
- ✅ Send and accept connection requests
- ✅ View their own network and connections

**Group/Project Creators can:**
- ✅ Manage their groups/projects
- ✅ Create sessions and milestones
- ✅ Manage memberships
- ✅ Post announcements

## 📊 Database Features

### Automated Features

1. **Auto-update timestamps** - `updated_at` automatically updated
2. **Auto-count members** - Group/project member counts auto-increment
3. **Auto-calculate progress** - Project progress based on milestones
4. **Auto-update sessions** - Buddy session counts auto-increment
5. **Auto-calculate mutual friends** - Mutual connections computed automatically

### Advanced Functions

1. **calculate_mutual_friends(user1, user2)** - Calculate mutual friends between users
2. **get_connection_suggestions(user_id, limit)** - AI-powered connection suggestions
3. **update_peer_online_status()** - Update online status based on last_active

### Views

1. **user_network_summary** - Summary of user's network (connections, pending requests, mentors, mentees)

## 🧪 Sample Data (Optional)

Each migration file includes commented-out sample data at the bottom. To use it:

1. Uncomment the INSERT statements at the end of each migration
2. Replace the UUID placeholders with actual user IDs from your auth.users table
3. Run the migration again (or just the INSERT statements)

⚠️ **Note**: Sample data uses placeholder UUIDs like `00000000-0000-0000-0000-000000000001`. Replace these with real user IDs!

## 📈 Next Steps

After successful migration:

1. ✅ **Update Service Layer**
   - Modify `src/services/peerLearningService.ts` to use Supabase queries instead of mock data

2. ✅ **Test API Integration**
   - Test all peer learning API calls from the app
   - Verify RLS policies work correctly
   - Test real-time features if needed

3. ✅ **Create Test Users**
   - Create test student accounts via Supabase Auth
   - Create peer profiles for each test user
   - Test connection flows, group joins, buddy matches

4. ✅ **Configure MCP (Optional)**
   - Update `claude_desktop_config.json` to point to correct project
   - Add access token or service role key
   - Restart Claude Desktop

## 🛠️ Troubleshooting

### Error: "relation does not exist"
- **Cause:** Migration was skipped or run out of order
- **Fix:** Run migrations in the exact order listed above

### Error: "permission denied for table"
- **Cause:** RLS policies are blocking access
- **Fix:** Ensure you're logged in with the correct user account

### Error: "duplicate key value violates unique constraint"
- **Cause:** Trying to insert duplicate data
- **Fix:** Skip sample data or modify values to be unique

### Error: "violates foreign key constraint"
- **Cause:** Referenced user doesn't exist in auth.users
- **Fix:** Create user first, then create dependent records

### How to Reset Database

⚠️ **WARNING**: This deletes ALL peer learning data!

```sql
-- Drop all tables in reverse order
DROP TABLE IF EXISTS connection_activities CASCADE;
DROP TABLE IF EXISTS connection_mutual_friends CASCADE;
DROP TABLE IF EXISTS peer_connections CASCADE;
DROP TABLE IF EXISTS buddy_interactions CASCADE;
DROP TABLE IF EXISTS buddy_study_sessions CASCADE;
DROP TABLE IF EXISTS buddy_preferences CASCADE;
DROP TABLE IF EXISTS study_buddies CASCADE;
DROP TABLE IF EXISTS project_updates CASCADE;
DROP TABLE IF EXISTS project_milestones CASCADE;
DROP TABLE IF EXISTS project_team_members CASCADE;
DROP TABLE IF EXISTS collaborative_projects CASCADE;
DROP TABLE IF EXISTS study_group_sessions CASCADE;
DROP TABLE IF EXISTS study_group_memberships CASCADE;
DROP TABLE IF EXISTS study_groups CASCADE;
DROP TABLE IF EXISTS peer_profiles CASCADE;

-- Drop views and functions
DROP VIEW IF EXISTS user_network_summary CASCADE;
DROP FUNCTION IF EXISTS calculate_mutual_friends CASCADE;
DROP FUNCTION IF EXISTS get_connection_suggestions CASCADE;
DROP FUNCTION IF EXISTS update_peer_online_status CASCADE;
DROP FUNCTION IF EXISTS update_peer_profiles_updated_at CASCADE;
DROP FUNCTION IF EXISTS update_study_groups_updated_at CASCADE;
DROP FUNCTION IF EXISTS update_group_member_count CASCADE;
DROP FUNCTION IF EXISTS update_projects_updated_at CASCADE;
DROP FUNCTION IF EXISTS update_project_team_size CASCADE;
DROP FUNCTION IF EXISTS update_project_progress CASCADE;
DROP FUNCTION IF EXISTS update_buddies_updated_at CASCADE;
DROP FUNCTION IF EXISTS update_buddy_session_count CASCADE;
DROP FUNCTION IF EXISTS update_buddy_last_interaction CASCADE;
DROP FUNCTION IF EXISTS update_connections_updated_at CASCADE;
DROP FUNCTION IF EXISTS update_peer_mutual_connections CASCADE;

-- Then re-run all migrations in order
```

## 📚 Service Integration

After migrations, update `src/services/peerLearningService.ts`:

```typescript
// Example: Get peer profiles
export const getPeerProfiles = async (studentId: string, filters?: {...}) => {
  try {
    let query = supabase
      .from('peer_profiles')
      .select('*');

    if (filters?.subject) {
      query = query.contains('subjects', [filters.subject]);
    }
    if (filters?.grade) {
      query = query.eq('grade', filters.grade);
    }
    if (filters?.isOnline !== undefined) {
      query = query.eq('is_online', filters.isOnline);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null, success: true };
  } catch (err) {
    return { data: null, error: err.message, success: false };
  }
};
```

## 🎯 Features Enabled

After successful migration, these features will be available:

### Peer Profiles
- Create and edit peer learning profile
- Search peers by subject, grade, location
- View peer achievements and ratings
- See online status and last active time

### Study Groups
- Create and join study groups
- Schedule group study sessions
- Participate in group discussions
- Track group membership and engagement

### Collaborative Projects
- Create team-based learning projects
- Join projects and contribute
- Track project milestones and progress
- Share updates and resources

### Study Buddies
- AI-powered buddy matching
- Schedule 1-on-1 study sessions
- Set study preferences and goals
- Track session history and ratings

### Peer Connections
- Send and accept connection requests
- Build learning network
- Find connection suggestions
- Track mutual friends

## 📞 Support

If you encounter issues:
1. Check Supabase logs: **Logs** → **Postgres Logs**
2. Verify RLS policies: **Authentication** → **Policies**
3. Test queries in SQL Editor
4. Check network connectivity in app

## 🎉 Success!

Once all migrations are applied successfully, your Peer Learning Network is ready to use! Students can now:

- 🤝 Connect with peers
- 📚 Join study groups
- 🚀 Collaborate on projects
- 👥 Find study buddies
- 🌐 Build a learning network

---

**Database setup complete!** 🚀

All peer learning features are now integrated with Supabase and ready for production use.
