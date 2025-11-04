# Master Execution Checklist - 10-Week Roadmap

**Use this as your daily reference. Check off items as you complete them.**

---

## 🔴 SPRINT 0: Security Foundations (Week 0 - Days 1-2)

### Day 1: RLS & RPC Pattern

#### Morning (4 hours)
- [ ] **Team Standup** (30 min)
  - [ ] Present roadmap to team
  - [ ] Assign DRIs for each workstream
  - [ ] Create Slack channels

- [ ] **Create Sprint 0 Branch** (15 min)
  ```bash
  git checkout -b sprint0-security-foundations
  git push -u origin sprint0-security-foundations
  ```

- [ ] **RLS Migration: profiles table** (45 min)
  - [ ] Create migration file
  - [ ] Add SELECT policy (admin all, user own)
  - [ ] Add UPDATE policy (admin only)
  - [ ] Test with non-admin token

- [ ] **RLS Migration: support_tickets** (45 min)
  - [ ] Add SELECT policy (admin all, user own)
  - [ ] Add INSERT policy (authenticated)
  - [ ] Add UPDATE policy (admin + ticket owner)
  - [ ] Test policies

- [ ] **RLS Migration: payments** (45 min)
  - [ ] Add SELECT policy (finance admin + branch admin only)
  - [ ] Add UPDATE policy (finance admin only)
  - [ ] Test with non-finance user

#### Afternoon (4 hours)
- [ ] **Secure RPC Pattern** (2 hours)
  - [ ] Create `supabase/functions/secure-write-rpc/index.ts`
  - [ ] Implement permission checking
  - [ ] Add transactional audit logging
  - [ ] Add correlation ID generation
  - [ ] Test suspend_user action

- [ ] **Client Hook** (1 hour)
  - [ ] Create `src/hooks/useSecureRPC.ts`
  - [ ] Add executeSecureRPC function
  - [ ] Add useSecureWrite hook
  - [ ] Test from React Native

- [ ] **Branch Access (ABAC)** (1 hour)
  - [ ] Create `user_branch_access` table
  - [ ] Add `has_branch_access` function
  - [ ] Update RLS policies with branch scope
  - [ ] Test branch filtering

#### End of Day
- [ ] **Verification** (30 min)
  - [ ] Run RLS tests
  - [ ] Verify RPC works
  - [ ] Check audit logs created
  - [ ] Commit changes

- [ ] **Documentation** (30 min)
  - [ ] Document RLS policies
  - [ ] Document RPC pattern
  - [ ] Update tracking board

---

### Day 2: Observability & Sign-off

#### Morning (4 hours)
- [ ] **Sentry Integration** (2 hours)
  - [ ] Install `@sentry/react-native`
  - [ ] Run sentry wizard
  - [ ] Create `src/config/sentry.ts`
  - [ ] Add initSentry() to App.tsx
  - [ ] Test error capture
  - [ ] Verify in Sentry dashboard

- [ ] **Performance Budgets** (1 hour)
  - [ ] Create `src/config/performanceBudgets.ts`
  - [ ] Define API/screen/export budgets
  - [ ] Add monitoring wrapper
  - [ ] Test budget violations

- [ ] **Rate Limiting** (1 hour)
  - [ ] Create `rate_limit_log` table
  - [ ] Add `check_rate_limit` function
  - [ ] Document rate limits
  - [ ] Test rate limit enforcement

#### Afternoon (4 hours)
- [ ] **Sprint 0 Verification** (2 hours)
  - [ ] Run RLS verification script
  - [ ] Run RPC verification tests
  - [ ] Run audit verification query
  - [ ] Run performance tests
  - [ ] Fix any issues found

- [ ] **Documentation** (1 hour)
  - [ ] Complete `SECURITY_MODEL.md`
  - [ ] Document all RLS policies
  - [ ] Document branch access model
  - [ ] Create runbook for ops

- [ ] **Sprint 0 Sign-off** (1 hour)
  - [ ] Team review
  - [ ] Security audit
  - [ ] Get DRI sign-off
  - [ ] Create PR
  - [ ] Merge to main

#### End of Sprint 0
- [ ] ✅ All RLS policies in place
- [ ] ✅ Secure RPC pattern established
- [ ] ✅ Branch-scoped access working
- [ ] ✅ Sentry integrated
- [ ] ✅ Performance budgets defined
- [ ] ✅ Rate limiting active
- [ ] ✅ Documentation complete
- [ ] ✅ All tests pass

---

## 🟡 SPRINT 1: Admin Shell & Performance (Weeks 1-2)

### Week 1: Data Contracts + UI Shell

#### Days 1-2: Data Contracts
- [ ] **Dashboard KPIs Contract** (2 hours)
  - [ ] Create `src/types/dashboardKPIs.ts`
  - [ ] Define KPI interfaces
  - [ ] Define query filters
  - [ ] Define response shapes
  - [ ] Document contract

- [ ] **User Management Contract** (2 hours)
  - [ ] Update `src/types/userManagement.ts`
  - [ ] Lock query filters
  - [ ] Lock sort options
  - [ ] Lock pagination params
  - [ ] Document contract

- [ ] **Support Tickets Contract** (2 hours)
  - [ ] Create `src/types/supportTickets.ts`
  - [ ] Define ticket interfaces
  - [ ] Define filter/sort options
  - [ ] Define action payloads
  - [ ] Document contract

- [ ] **Financial Metrics Contract** (2 hours)
  - [ ] Create `src/types/financialMetrics.ts`
  - [ ] Define report interfaces
  - [ ] Define date ranges
  - [ ] Define aggregation options
  - [ ] Document contract

#### Days 3-4: UI Shell
- [ ] **Bottom Tab Navigator** (4 hours)
  - [ ] Create `src/navigation/AdminBottomTabNavigator.tsx`
  - [ ] Add 5 tabs (Dashboard/Management/Analytics/System/More)
  - [ ] Implement permission-based visibility
  - [ ] Add tab icons
  - [ ] Test navigation flow

- [ ] **TopAppBar Component** (2 hours)
  - [ ] Create `src/ui/TopAppBar.tsx`
  - [ ] Add title + subtitle
  - [ ] Add back button
  - [ ] Add action buttons
  - [ ] Test on 3 screens

- [ ] **Theme Token System** (2 hours)
  - [ ] Create `src/theme/tokens.ts`
  - [ ] Extract all colors to tokens
  - [ ] Replace hardcoded colors
  - [ ] Update Colors in designSystem
  - [ ] Verify no hardcoded colors remain

- [ ] **Offline Banner** (1 hour)
  - [ ] Create `src/shared/components/OfflineBanner.tsx`
  - [ ] Add network detection
  - [ ] Add banner UI
  - [ ] Test offline mode

- [ ] **Degraded Mode** (1 hour)
  - [ ] Create `src/shared/components/DegradedMode.tsx`
  - [ ] Add degraded state detection
  - [ ] Add fallback UI
  - [ ] Test degraded scenarios

#### Days 5-7: Keyset Pagination
- [ ] **Users Pagination** (4 hours)
  - [ ] Create composite index on users (created_at, id)
  - [ ] Update useUsersList hook
  - [ ] Replace OFFSET with cursor
  - [ ] Test pagination forward/backward
  - [ ] Test with 10k+ records

- [ ] **Tickets Pagination** (4 hours)
  - [ ] Create composite index on tickets (created_at, id, status)
  - [ ] Create useSupportTickets hook
  - [ ] Implement keyset pagination
  - [ ] Test pagination with filters
  - [ ] Test with 10k+ records

- [ ] **Skeleton Loaders** (2 hours)
  - [ ] Create `src/shared/components/SkeletonCard.tsx`
  - [ ] Add to Dashboard cards
  - [ ] Add to list items
  - [ ] Test loading states

- [ ] **PlaceholderData Pattern** (2 hours)
  - [ ] Update useUsersList with placeholderData
  - [ ] Update useSupportTickets with placeholderData
  - [ ] Test reduced layout shift
  - [ ] Verify staleTime policies

---

### Week 2: Dashboard + Support Center

#### Days 8-10: Dashboard KPIs
- [ ] **Create DashboardScreenV2** (2 hours)
  - [ ] Create `src/screens/admin/DashboardScreenV2.tsx`
  - [ ] Add BaseScreen wrapper
  - [ ] Add TopAppBar
  - [ ] Add grid layout

- [ ] **Active Users KPI** (1 hour)
  - [ ] Create useDashboardKPIs hook
  - [ ] Query active users count
  - [ ] Add trend indicator
  - [ ] Add skeleton loader
  - [ ] Add drill-down navigation

- [ ] **MTD Revenue KPI** (1 hour)
  - [ ] Query revenue sum for current month
  - [ ] Add currency formatting
  - [ ] Add trend vs last month
  - [ ] Add skeleton loader
  - [ ] Add drill-down to reports

- [ ] **Open Tickets KPI** (1 hour)
  - [ ] Query unresolved tickets count
  - [ ] Add SLA breach indicator
  - [ ] Add skeleton loader
  - [ ] Add drill-down to Support Center

- [ ] **Attendance Rate KPI** (1 hour)
  - [ ] Query attendance percentage
  - [ ] Add trend indicator
  - [ ] Add skeleton loader
  - [ ] Add drill-down to attendance

- [ ] **Analytics Tracking** (2 hours)
  - [ ] Add screenView tracking
  - [ ] Add KPI click tracking
  - [ ] Add navigation tracking
  - [ ] Verify events in console

#### Days 11-14: Support Center
- [ ] **Create SupportCenterScreen** (3 hours)
  - [ ] Create `src/screens/admin/SupportCenterScreen.tsx`
  - [ ] Add BaseScreen wrapper
  - [ ] Add TopAppBar with filters
  - [ ] Add ticket list with keyset pagination

- [ ] **Filters Implementation** (2 hours)
  - [ ] Add filter chips (Unassigned/Mine/Open/Resolved/High)
  - [ ] Wire up filter state
  - [ ] Test filter combinations
  - [ ] Add clear filters button

- [ ] **Ticket Actions** (3 hours)
  - [ ] Add Assign action with user picker
  - [ ] Add Resolve action with reason required
  - [ ] Wire actions to secure RPC
  - [ ] Add success/error feedback
  - [ ] Test all actions

- [ ] **Real-time Updates** (2 hours)
  - [ ] Subscribe to support_tickets changes
  - [ ] Update UI on new tickets
  - [ ] Update UI on status changes
  - [ ] Test with 2 devices

- [ ] **SLA Timers** (2 hours)
  - [ ] Calculate time since creation
  - [ ] Show timer on each ticket
  - [ ] Highlight breaches in red
  - [ ] Add SLA breach alerts

- [ ] **First-Response Metrics** (2 hours)
  - [ ] Calculate avg first response time
  - [ ] Show metric on dashboard
  - [ ] Track by team member
  - [ ] Add to analytics

#### End of Sprint 1
- [ ] ✅ Data contracts locked
- [ ] ✅ Bottom Tab Navigator with permissions
- [ ] ✅ TopAppBar on all screens
- [ ] ✅ Theme tokens everywhere
- [ ] ✅ Keyset pagination working
- [ ] ✅ Dashboard KPIs complete
- [ ] ✅ Support Center functional
- [ ] ✅ Real-time updates working
- [ ] ✅ Zero TS/ESLint errors
- [ ] ✅ Sprint 1 sign-off obtained

---

## 🟢 SPRINT 2: Management & Support (Weeks 3-4)

### Week 3: User Management Polish

#### Days 15-17: User Management Enhancements
- [ ] **Search Implementation** (2 hours)
  - [ ] Add search debounce
  - [ ] Search by name + email
  - [ ] Show search results count
  - [ ] Clear search button

- [ ] **Advanced Filters** (2 hours)
  - [ ] Add role filter dropdown
  - [ ] Add status filter (active/suspended)
  - [ ] Add branch filter (if ABAC)
  - [ ] Test filter combinations

- [ ] **Reason Required** (2 hours)
  - [ ] Add reason input to Suspend dialog
  - [ ] Add reason input to Delete dialog
  - [ ] Validate reason (min 10 chars)
  - [ ] Store reason in audit log

- [ ] **Bulk Actions UI** (3 hours)
  - [ ] Add select mode toggle
  - [ ] Add checkboxes to user cards
  - [ ] Add bulk action bar
  - [ ] Implement bulk suspend
  - [ ] Implement bulk export

- [ ] **Verification** (1 hour)
  - [ ] Verify all actions use RPC
  - [ ] Verify audit logs complete
  - [ ] Test permission gates
  - [ ] Performance test with 1k users

#### Days 18-21: Support Center Phase 2
- [ ] **Escalate Action** (2 hours)
  - [ ] Add Escalate button
  - [ ] Show escalation level picker
  - [ ] Wire to secure RPC
  - [ ] Add escalation audit

- [ ] **Comment System** (3 hours)
  - [ ] Create comments table
  - [ ] Add comment input
  - [ ] Show comment history
  - [ ] Real-time comment updates

- [ ] **SLA Breach Alerts** (2 hours)
  - [ ] Calculate breach risk
  - [ ] Show alert when risk > 80%
  - [ ] Send notification to assignee
  - [ ] Track breach rate

- [ ] **First-Response Metrics** (2 hours)
  - [ ] Calculate median first response
  - [ ] Show per-agent metrics
  - [ ] Add to dashboard KPI
  - [ ] Track trend over time

- [ ] **Assignment Rules** (3 hours)
  - [ ] Create assignment rules UI
  - [ ] Implement round-robin logic
  - [ ] Implement skill-based routing
  - [ ] Test auto-assignment

- [ ] **Ticket Routing** (2 hours)
  - [ ] Route by category
  - [ ] Route by priority
  - [ ] Route by branch
  - [ ] Test routing logic

- [ ] **Attachment Support** (2 hours)
  - [ ] Add file upload button
  - [ ] Store in Supabase Storage
  - [ ] Show attachments list
  - [ ] Add download link

---

### Week 4: System Settings + Jobs Center

#### Days 22-24: System Settings
- [ ] **Create SystemSettingsScreen** (2 hours)
  - [ ] Create `src/screens/admin/SystemSettingsScreen.tsx`
  - [ ] Add BaseScreen wrapper
  - [ ] Add categories (General/Security/Finance/Notifications)
  - [ ] Add read-only toggle cards

- [ ] **Two-Person Approval** (3 hours)
  - [ ] Add approval required flag
  - [ ] Create approval request flow
  - [ ] Notify approver
  - [ ] Verify approval before applying

- [ ] **OTP Verification** (2 hours)
  - [ ] Add OTP for critical toggles
  - [ ] Send OTP via email/SMS
  - [ ] Verify OTP input
  - [ ] Timeout after 5 min

- [ ] **Settings Audit Log** (1 hour)
  - [ ] Log all setting changes
  - [ ] Show audit log viewer
  - [ ] Filter by setting key
  - [ ] Export audit log

#### Days 25-28: Jobs Center
- [ ] **Create JobsCenterScreen** (2 hours)
  - [ ] Create `src/screens/admin/JobsCenterScreen.tsx`
  - [ ] Add BaseScreen wrapper
  - [ ] Add job list with status

- [ ] **Job Queue UI** (3 hours)
  - [ ] Show pending jobs
  - [ ] Show running jobs
  - [ ] Show completed jobs
  - [ ] Show failed jobs with retry

- [ ] **Status Tracking** (2 hours)
  - [ ] Real-time status updates
  - [ ] Progress bar for running jobs
  - [ ] ETA calculation
  - [ ] Completion notification

- [ ] **Result Download** (2 hours)
  - [ ] Generate signed URLs
  - [ ] Show download button
  - [ ] Track download events
  - [ ] Auto-expire URLs after 24h

- [ ] **Job History** (2 hours)
  - [ ] Show last 100 jobs
  - [ ] Filter by type/status/date
  - [ ] Search by job ID
  - [ ] Pagination

- [ ] **Export Templates** (3 hours)
  - [ ] Create export job template
  - [ ] Add template selector
  - [ ] Configure export fields
  - [ ] Save custom templates

#### End of Sprint 2
- [ ] ✅ User Management enhanced
- [ ] ✅ Support Center complete
- [ ] ✅ System Settings working
- [ ] ✅ Jobs Center functional
- [ ] ✅ All writes via RPC
- [ ] ✅ Audit trail complete
- [ ] ✅ Sprint 2 sign-off obtained

---

## (Continue for Sprints 3-5 in similar detail...)

---

## Daily Standup Template

**Copy this for daily standups:**

```
## Daily Standup - [Date]

### ✅ Completed Yesterday
1. [Task 1]
2. [Task 2]

### 🚧 Working on Today
1. [Task 1] - [Est: X hours]
2. [Task 2] - [Est: X hours]

### 🚫 Blockers
- None / [Describe blocker + who can help]

### 📊 Sprint Progress
- Sprint X: [XX]% complete
- On track / Behind / Ahead

### 🎯 Next Milestone
- [Milestone name] - [Days remaining]
```

---

## Weekly Review Template

**Copy this for Friday reviews:**

```
## Weekly Review - Week [X]

### 📈 Progress This Week
- [ ] Sprint [X]: [XX]% → [YY]%
- [ ] Features shipped: [List]
- [ ] Bugs fixed: [Count]

### 🎯 Metrics
- API p95: [Xms] (Target: <300ms)
- Dashboard load: [Xs] (Target: <1s)
- Tests passing: [X]% (Target: 100%)

### 🚨 Risks
- [Risk 1] - [Mitigation]
- [Risk 2] - [Mitigation]

### 📋 Next Week Plan
- [ ] Complete [Feature 1]
- [ ] Start [Feature 2]
- [ ] Sprint [X] sign-off

### 💡 Learnings
- [What went well]
- [What to improve]
```

---

## Final Sign-off Checklist (End of Week 10)

- [ ] **Sprint 0** ✅ Security foundations complete
- [ ] **Sprint 1** ✅ Admin shell + performance
- [ ] **Sprint 2** ✅ Management & support
- [ ] **Sprint 3** ✅ Finance & analytics
- [ ] **Sprint 4** ✅ Automation & messaging
- [ ] **Sprint 5** ✅ AI insights & governance

- [ ] **All Acceptance Gates** ✅ Passed
- [ ] **All Success Metrics** ✅ Within SLOs
- [ ] **Security Audit** ✅ Complete
- [ ] **Performance Tests** ✅ Passed
- [ ] **Documentation** ✅ Complete
- [ ] **Production Deploy** ✅ Successful

---

🎉 **PROJECT COMPLETE!** 🎉

**Total Duration:** 10 weeks
**Features Delivered:** [Count]
**Success Rate:** [Metrics]
**Team Size:** 8 DRIs

**Celebration:** 🍕🍾🥳
