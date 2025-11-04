# Coaching Management Platform - 10-Week Roadmap Analysis & Execution Plan

## Current State Assessment (as of today)

### ✅ Completed (Sprint 0 & Early Sprint 1)

**Sprint 0 - Foundations:**
- ✅ Audit pipeline with partitions (`audit_logs` table)
- ✅ Basic RLS policies on some tables
- ✅ Audit logging in transactions (`auditLogger.ts`)
- ✅ Admin permissions system (`adminPermissions.ts`)

**Sprint 1 - Admin Shell:**
- ✅ BaseScreen wrapper implemented
- ✅ Safe navigation (`navigationService.ts`)
- ✅ Analytics tracking (`navigationAnalytics.ts`)
- ✅ UserManagementScreenV2 with CRUD operations
- ✅ ConfirmDialog provider (Sprint 1 Phase 3)
- ✅ Snackbar provider (Sprint 1 Phase 3)
- ✅ Access denied screen with RBAC gates

### ⚠️ Partially Complete

**Sprint 1:**
- ⚠️ Bottom Tab Navigator - Needs permission-based visibility
- ⚠️ TopAppBar - Not yet implemented
- ⚠️ Theme tokens - Colors defined but not fully systemized
- ⚠️ Data contracts - Not formally locked
- ⚠️ Keyset pagination - Still using OFFSET in most places

### ❌ Not Started

**Sprint 0:**
- ❌ Branch-scoped access (ABAC)
- ❌ RLS on high-traffic tables (payments, support_tickets)
- ❌ Secure RPC pattern for all writes
- ❌ Sentry integration
- ❌ Performance budgets defined
- ❌ Rate limiting

**Sprint 1:**
- ❌ Dashboard KPIs with real data
- ❌ Support Center
- ❌ Financial daily metrics
- ❌ Per-card skeletons
- ❌ Degraded mode UI
- ❌ Offline banner

**Sprints 2-5:**
- ❌ All features pending

---

## Execution Priority Matrix

### 🔴 Critical Path (Blocks everything else)

1. **Complete Sprint 0 Security Foundations** (3-4 days)
   - RLS on all admin tables
   - Secure RPC pattern established
   - Branch-scoped access

2. **Lock Data Contracts** (1-2 days)
   - Dashboard KPIs
   - User list
   - Support tickets list
   - Financial metrics

3. **Keyset Pagination Infrastructure** (2-3 days)
   - Replace OFFSET with keyset
   - Create composite indexes

### 🟡 High Priority (Enables Sprint 1 completion)

4. **Complete Admin Shell** (3-4 days)
   - Bottom Tab Navigator with permissions
   - TopAppBar component
   - Theme token system
   - Degraded mode + offline banner

5. **Dashboard KPIs** (2-3 days)
   - Active users count
   - MTD revenue
   - Open tickets
   - Attendance rate

6. **Support Center (Phase 1)** (4-5 days)
   - List view with filters
   - Real-time updates
   - Basic actions (assign/resolve)

### 🟢 Medium Priority (Sprint 2-3 features)

7. **Financial Reports** (3-4 days)
   - Revenue trends
   - Branch breakdown
   - Dues aging

8. **Jobs & Exports Center** (3-4 days)
   - Queue system
   - Status tracking
   - Export generation

9. **System Settings** (2-3 days)
   - Read-only view
   - Permission gates

### 🔵 Low Priority (Sprint 4-5 features)

10. **Automation & Messaging** (Week 7-8)
11. **AI Insights** (Week 9-10)

---

## Week-by-Week Execution Plan

### Week 0 (NOW - 2 days remaining)

**Goal:** Finish Sprint 0 security foundations

**Day 1-2:**
- [ ] Complete RLS policies on all admin tables
- [ ] Create secure RPC pattern for writes
- [ ] Document branch-scoped access model
- [ ] Set up Sentry with correlation IDs
- [ ] Define rate limiting strategy

**Deliverables:**
- `supabase/migrations/sprint0_rls_complete.sql`
- `supabase/functions/secure-write-rpc/` (pattern)
- `SECURITY_MODEL.md`
- Sentry integrated

---

### Week 1 (Days 1-7)

**Goal:** Complete Sprint 1 Admin Shell + Data Contracts

**Days 1-2: Data Contracts**
- [ ] Lock Dashboard KPI contract (`types/dashboardKPIs.ts`)
- [ ] Lock User Management contract (`types/userManagement.ts`)
- [ ] Lock Support Tickets contract (`types/supportTickets.ts`)
- [ ] Lock Financial Metrics contract (`types/financialMetrics.ts`)
- [ ] Document filter/sort/pagination patterns

**Days 3-4: UI Shell**
- [ ] Build Bottom Tab Navigator with permission visibility
- [ ] Create TopAppBar component
- [ ] Implement theme token system (replace hardcoded colors)
- [ ] Add offline banner component
- [ ] Add degraded mode states

**Days 5-7: Performance Primitives**
- [ ] Implement keyset pagination for Users
- [ ] Implement keyset pagination for Tickets
- [ ] Create composite indexes
- [ ] Add per-card skeleton loaders
- [ ] Set up placeholderData pattern

**Deliverables:**
- `navigation/AdminBottomTabNavigator.tsx`
- `ui/TopAppBar.tsx`
- `theme/tokens.ts`
- `shared/components/OfflineBanner.tsx`
- `types/` - All contracts locked
- Database indexes created

---

### Week 2 (Days 8-14)

**Goal:** Dashboard KPIs + Support Center (Phase 1)

**Days 8-10: Dashboard**
- [ ] Build Dashboard KPI cards
  - Active Users (real-time count)
  - MTD Revenue (from payments)
  - Open Tickets (from support_tickets)
  - Attendance Rate (from attendance)
- [ ] Add per-card skeletons
- [ ] Implement staleTime policies
- [ ] Wire up analytics tracking

**Days 11-14: Support Center**
- [ ] Build SupportCenterScreen scaffold
- [ ] Implement filters (Unassigned/Mine/Open/Resolved/High)
- [ ] Add ticket list with keyset pagination
- [ ] Create ticket detail modal
- [ ] Implement basic actions (Assign/Resolve)
- [ ] Add SLA timers
- [ ] Wire up real-time updates

**Deliverables:**
- `screens/admin/DashboardScreenV2.tsx`
- `screens/admin/SupportCenterScreen.tsx`
- `hooks/useDashboardKPIs.ts`
- `hooks/useSupportTickets.ts`
- Real-time subscription setup

---

### Week 3 (Days 15-21)

**Goal:** Complete Sprint 2 - Management & Support (actionable)

**Days 15-17: User Management Polish**
- [ ] Add search with debounce
- [ ] Add filters (role, status, branch)
- [ ] Require reason for Suspend/Delete
- [ ] Ensure all actions use RPC
- [ ] Verify audit trail completeness
- [ ] Add bulk actions UI (select mode)

**Days 18-21: Support Center (Phase 2)**
- [ ] Implement Escalate action
- [ ] Add comment/note system
- [ ] Build SLA breach alerts
- [ ] Add first-response metrics
- [ ] Create assignment rules UI
- [ ] Implement ticket routing logic
- [ ] Add attachment support

**Deliverables:**
- Enhanced `UserManagementScreenV2.tsx`
- Complete `SupportCenterScreen.tsx`
- `supabase/functions/support-actions/`
- SLA monitoring system

---

### Week 4 (Days 22-28)

**Goal:** System Settings + Jobs Center scaffold

**Days 22-24: System Settings**
- [ ] Create SystemSettingsScreen
- [ ] Add read-only toggle cards
- [ ] Implement deep-link to edit screens
- [ ] Add two-person approval flow UI
- [ ] Build OTP verification for critical toggles
- [ ] Add settings audit log viewer

**Days 25-28: Jobs & Exports Center**
- [ ] Create JobsCenterScreen
- [ ] Build job queue UI
- [ ] Add status tracking
- [ ] Implement result download (signed URLs)
- [ ] Add job history with filters
- [ ] Create export job templates

**Deliverables:**
- `screens/admin/SystemSettingsScreen.tsx`
- `screens/admin/JobsCenterScreen.tsx`
- `hooks/useJobsQueue.ts`
- `supabase/functions/job-processor/`

---

### Week 5 (Days 29-35)

**Goal:** Sprint 3 - Financial Reports (operational)

**Days 29-31: Financial Views**
- [ ] Create FinancialReportsScreenV2 (replace current)
- [ ] Build daily revenue trend (materialized view)
- [ ] Add branch breakdown chart
- [ ] Implement dues aging report
- [ ] Add payment status filters
- [ ] Create revenue vs target comparison

**Days 32-35: Exports & Dunning Setup**
- [ ] Implement CSV export via Jobs Center
- [ ] Add PDF report generation
- [ ] Add export watermarking
- [ ] Build dunning ladder configuration UI
- [ ] Create message templates UI
- [ ] Add bulk send via Jobs Center

**Deliverables:**
- Complete `FinancialReportsScreenV2.tsx`
- `supabase/materialized_views/daily_revenue.sql`
- Export jobs integrated
- Dunning configuration UI

---

### Week 6 (Days 36-42)

**Goal:** Integration Health + Dashboard KPIs complete

**Days 36-38: Integration Health**
- [ ] Create IntegrationHealthScreen
- [ ] Monitor payment gateway status
- [ ] Track email delivery metrics
- [ ] Monitor WhatsApp API health
- [ ] Add token expiry warnings
- [ ] Build backlog viewer

**Days 39-42: Dashboard Polish**
- [ ] Complete all KPI cards
- [ ] Add trend indicators (↑↓)
- [ ] Implement drill-down navigation
- [ ] Add date range selector
- [ ] Build export dashboard report
- [ ] Add predictive payment risk score (advisory)

**Deliverables:**
- `screens/admin/IntegrationHealthScreen.tsx`
- Complete dashboard with all KPIs
- Risk score preview integration

---

### Week 7 (Days 43-49)

**Goal:** Sprint 4 - Automation (n8n workflows)

**Days 43-45: n8n Integration**
- [ ] Create WorkflowLibraryScreen
- [ ] List workflows with metadata
- [ ] Add enable/disable controls
- [ ] Build version viewer
- [ ] Add owner/risk level display
- [ ] Create run history viewer

**Days 46-49: Workflow Monitoring**
- [ ] Build workflow error queue
- [ ] Add retry mechanism
- [ ] Implement correlation ID tracking
- [ ] Create workflow analytics
- [ ] Add webhook endpoint health
- [ ] Build workflow testing UI

**Deliverables:**
- `screens/admin/WorkflowLibraryScreen.tsx`
- `hooks/useWorkflows.ts`
- n8n webhook integrations
- Workflow monitoring dashboard

---

### Week 8 (Days 50-56)

**Goal:** Sprint 4 - Messaging Center + Emergency Comms

**Days 50-53: Messaging Center**
- [ ] Create MessagingCenterScreen
- [ ] Build template library UI
- [ ] Add channel selection (WhatsApp/Email/SMS/Push)
- [ ] Implement quiet hours configuration
- [ ] Add throttling controls
- [ ] Build A/B test setup UI
- [ ] Add deliverability stats

**Days 54-56: Emergency Broadcast**
- [ ] Create EmergencyBroadcastScreen
- [ ] Build recipient selector
- [ ] Add acknowledgment tracking
- [ ] Implement re-contact logic
- [ ] Add broadcast history
- [ ] Create emergency templates

**Deliverables:**
- `screens/admin/MessagingCenterScreen.tsx`
- `screens/admin/EmergencyBroadcastScreen.tsx`
- Messaging compliance enforcement
- Emergency broadcast system

---

### Week 9 (Days 57-63)

**Goal:** Sprint 5 - AI Insights (Phase 1 advisory)

**Days 57-60: AI Insights Tab**
- [ ] Create AIInsightsScreen
- [ ] Build revenue forecast card (6-month)
- [ ] Add confidence bands visualization
- [ ] Implement churn/at-risk cohorts
- [ ] Add suggested interventions
- [ ] Build teacher performance insights
- [ ] Add coaching tips

**Days 61-63: Capacity & Risk**
- [ ] Create capacity snapshot card
- [ ] Add room saturation metrics
- [ ] Build teacher workload view
- [ ] Implement risk alerts
- [ ] Add capacity forecasting
- [ ] Build resource optimization suggestions

**Deliverables:**
- `screens/admin/AIInsightsScreen.tsx`
- AI insight cards (advisory only)
- Data source citations
- Confidence/limitations display

---

### Week 10 (Days 64-70)

**Goal:** Sprint 5 - ModelOps & Governance foundation

**Days 64-66: Model Registry**
- [ ] Create ModelRegistryScreen
- [ ] List model versions
- [ ] Display metrics per version
- [ ] Add rollout status
- [ ] Build A/B flag management
- [ ] Add baseline revert controls

**Days 67-70: Compliance & Feedback**
- [ ] Create ComplianceConsoleScreen
- [ ] Build consent log viewer
- [ ] Add retention schedule display
- [ ] Implement export/delete request handling
- [ ] Create feedback loop UI (accept/override)
- [ ] Add drift alert dashboard
- [ ] Build model performance tracking

**Deliverables:**
- `screens/admin/ModelRegistryScreen.tsx`
- `screens/admin/ComplianceConsoleScreen.tsx`
- Model governance system
- Compliance baseline

---

## File Structure Plan

```
C:\PC\OLD\
├── src/
│   ├── screens/admin/
│   │   ├── DashboardScreenV2.tsx ⭐ Week 2
│   │   ├── UserManagementScreenV2.tsx ✅ Complete
│   │   ├── SupportCenterScreen.tsx ⭐ Week 2-3
│   │   ├── SystemSettingsScreen.tsx ⭐ Week 4
│   │   ├── JobsCenterScreen.tsx ⭐ Week 4
│   │   ├── FinancialReportsScreenV2.tsx ⭐ Week 5
│   │   ├── IntegrationHealthScreen.tsx ⭐ Week 6
│   │   ├── WorkflowLibraryScreen.tsx ⭐ Week 7
│   │   ├── MessagingCenterScreen.tsx ⭐ Week 8
│   │   ├── EmergencyBroadcastScreen.tsx ⭐ Week 8
│   │   ├── AIInsightsScreen.tsx ⭐ Week 9
│   │   ├── ModelRegistryScreen.tsx ⭐ Week 10
│   │   └── ComplianceConsoleScreen.tsx ⭐ Week 10
│   ├── hooks/
│   │   ├── useDashboardKPIs.ts ⭐ Week 2
│   │   ├── useSupportTickets.ts ⭐ Week 2
│   │   ├── useJobsQueue.ts ⭐ Week 4
│   │   ├── useWorkflows.ts ⭐ Week 7
│   │   ├── useMessaging.ts ⭐ Week 8
│   │   └── useAIInsights.ts ⭐ Week 9
│   ├── types/
│   │   ├── dashboardKPIs.ts ⭐ Week 1
│   │   ├── supportTickets.ts ⭐ Week 1
│   │   ├── financialMetrics.ts ⭐ Week 1
│   │   ├── workflows.ts ⭐ Week 7
│   │   └── aiInsights.ts ⭐ Week 9
│   ├── navigation/
│   │   └── AdminBottomTabNavigator.tsx ⭐ Week 1
│   ├── ui/
│   │   └── TopAppBar.tsx ⭐ Week 1
│   ├── theme/
│   │   └── tokens.ts ⭐ Week 1
│   └── shared/components/
│       ├── OfflineBanner.tsx ⭐ Week 1
│       ├── DegradedMode.tsx ⭐ Week 1
│       └── SkeletonCard.tsx ⭐ Week 1
├── supabase/
│   ├── migrations/
│   │   ├── sprint0_rls_complete.sql ⭐ Week 0
│   │   ├── sprint1_indexes.sql ⭐ Week 1
│   │   ├── sprint2_support_tickets.sql ⭐ Week 3
│   │   ├── sprint3_financial_views.sql ⭐ Week 5
│   │   └── sprint5_ai_models.sql ⭐ Week 10
│   └── functions/
│       ├── secure-write-rpc/ ⭐ Week 0
│       ├── support-actions/ ⭐ Week 3
│       ├── job-processor/ ⭐ Week 4
│       └── export-generator/ ⭐ Week 5
└── docs/
    ├── SECURITY_MODEL.md ⭐ Week 0
    ├── DATA_CONTRACTS.md ⭐ Week 1
    ├── PERFORMANCE_BUDGETS.md ⭐ Week 1
    └── ACCEPTANCE_GATES.md ⭐ Ongoing
```

---

## Critical Dependencies

### Blocking Dependencies (Must complete first)

1. **Sprint 0 RLS** → Blocks all writes
2. **Data Contracts** → Blocks all screen development
3. **Keyset Pagination** → Blocks list screens at scale
4. **Bottom Tab Navigator** → Blocks navigation to new screens
5. **Secure RPC Pattern** → Blocks all mutations

### Parallel Work Streams

**Can work in parallel:**
- UI shell (TopAppBar, theme tokens) ∥ Data contracts
- Dashboard KPIs ∥ Support Center list
- Financial reports ∥ Jobs Center
- Workflow monitoring ∥ Messaging Center
- AI Insights ∥ Model Registry

**Cannot parallelize:**
- RLS must finish before any writes
- Data contracts must finish before screens
- Jobs Center must finish before exports

---

## Resource Allocation (DRIs)

### Team 1: Platform & Security
**Owner:** Backend/Supabase DRI
**Focus:** Weeks 0-1, ongoing security
- Sprint 0 RLS completion
- Secure RPC pattern
- Branch-scoped access
- Rate limiting
- Sentry integration

### Team 2: Admin UX & Navigation
**Owner:** RN Lead + Designer
**Focus:** Weeks 1-2, 4, 8-10
- Bottom Tab Navigator
- TopAppBar
- Theme tokens
- All screen layouts
- UI polish

### Team 3: Data & Performance
**Owner:** Data Engineer
**Focus:** Weeks 1, 5-6, 9-10
- Data contracts
- Keyset pagination
- Indexes
- Materialized views
- AI model infrastructure

### Team 4: Ops & Support
**Owner:** RN Engineer + Product Ops
**Focus:** Weeks 2-4
- Dashboard KPIs
- Support Center
- System Settings
- Jobs Center
- Integration Health

### Team 5: Finance & Analytics
**Owner:** Backend + Analyst
**Focus:** Weeks 5-6
- Financial reports
- Exports
- Dunning configuration
- Payment risk scoring

### Team 6: Automation & Integrations
**Owner:** n8n Specialist
**Focus:** Weeks 7-8
- Workflow library
- n8n integration
- Messaging Center
- Emergency broadcast

### Team 7: AI Insights & Governance
**Owner:** Data Scientist + Product Owner
**Focus:** Weeks 9-10
- AI insights screens
- Model registry
- Compliance console
- Governance framework

### Team 8: QA/Release/Compliance
**Owner:** QA Lead + Security Analyst
**Focus:** All weeks, continuous
- Testing all features
- Security audits
- Compliance verification
- Release management

---

## Success Metrics Tracking

### Week 0-1 Gates
- [ ] 100% admin tables have RLS
- [ ] All writes go through RPC
- [ ] Correlation IDs in 100% of logs
- [ ] p95 API read < 300ms

### Week 2 Gates
- [ ] Dashboard first content < 1s
- [ ] Real-time updates working
- [ ] Zero TS/ESLint errors
- [ ] Min touch target 48dp everywhere

### Week 3-4 Gates
- [ ] Support first-response < 15min
- [ ] < 5% SLA breaches
- [ ] All actions audited
- [ ] Jobs complete within SLA

### Week 5-6 Gates
- [ ] Export < 3min for 100k rows
- [ ] Finance views match gateway
- [ ] Integration health 99%+
- [ ] Risk score accuracy tracked

### Week 7-8 Gates
- [ ] Messaging rate limits enforced
- [ ] Workflow correlation IDs
- [ ] Template approvals documented
- [ ] Emergency broadcast < 1min

### Week 9-10 Gates
- [ ] AI confidence displayed
- [ ] Forecast MAPE < 15%
- [ ] A/B rollback functional
- [ ] Compliance logs complete

---

## Risk Mitigation Plan

### Risk 1: Scope Creep in AI
**Mitigation:** Start advisory only; gate automations behind confirms
**Contingency:** Defer AI automation to Phase 2 if timeline tight

### Risk 2: Performance Regressions
**Mitigation:** Create indexes before screens; use materialized views
**Contingency:** Performance budget per screen; revert if violated

### Risk 3: Messaging Compliance
**Mitigation:** Enforce quiet hours, opt-out, throttling from day 1
**Contingency:** Legal review before launch; disable on violation

### Risk 4: Policy Drift
**Mitigation:** DB-driven RBAC/RLS; no UI-only checks
**Contingency:** Monthly RLS audit; automated tests for permissions

### Risk 5: Data Contract Changes
**Mitigation:** Lock contracts Week 1; versioning system
**Contingency:** Migration path for breaking changes

### Risk 6: Team Availability
**Mitigation:** Cross-training; documentation; parallel work streams
**Contingency:** Priority matrix; defer low-priority features

---

## Next Immediate Actions (This Week)

### Day 1 (Today)
1. [ ] Review and approve this execution plan
2. [ ] Assign DRIs for each work stream
3. [ ] Set up project tracking (Jira/Linear/GitHub Projects)
4. [ ] Create Sprint 0 completion checklist
5. [ ] Start RLS policy migration

### Day 2 (Tomorrow)
6. [ ] Complete RLS on all admin tables
7. [ ] Create secure RPC pattern example
8. [ ] Set up Sentry integration
9. [ ] Document security model
10. [ ] Begin data contracts definition

### Day 3-5 (Rest of Week 0)
11. [ ] Finish Sprint 0 deliverables
12. [ ] Begin Week 1 work (data contracts + UI shell)
13. [ ] Set up performance monitoring
14. [ ] Create composite indexes
15. [ ] Weekly team sync on progress

---

## Communication Plan

### Daily Standups
- Blockers discussion
- Dependency check-ins
- Quick wins sharing

### Weekly Reviews (Fridays)
- Sprint progress review
- Success metrics check
- Risk assessment
- Next week planning

### Bi-weekly Demos
- Feature showcase
- Stakeholder feedback
- Acceptance gate review

### Monthly Retrospectives
- Process improvements
- Team velocity
- Technical debt review

---

## Acceptance Checklist Template

Use this for every feature:

```markdown
## Feature: [Name]

### Security ✅
- [ ] RLS verified with non-admin token
- [ ] All writes via RPC
- [ ] Audit events generated
- [ ] Correlation IDs present

### Performance ✅
- [ ] p95 < 300ms for reads
- [ ] Keyset pagination used
- [ ] Indexes present
- [ ] Skeleton loaders added

### UX ✅
- [ ] BaseScreen wrapper
- [ ] Loading/error/empty states
- [ ] Min touch target 48dp
- [ ] Accessibility labels
- [ ] Analytics events

### Code Quality ✅
- [ ] Zero TS errors
- [ ] Zero ESLint warnings
- [ ] Follows data contracts
- [ ] Theme tokens used
- [ ] No hardcoded strings

### Testing ✅
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E smoke test
- [ ] Manual QA complete
```

---

## Summary

**Current State:** Sprint 0 ~60% complete, Sprint 1 ~40% complete

**Next Milestone:** Complete Sprint 0 + Sprint 1 (Week 0-2)

**Critical Path:** RLS → Data Contracts → Keyset Pagination → UI Shell

**Team Size Needed:** 8 DRIs across workstreams

**Timeline:** 10 weeks (can be compressed to 8 with parallel execution)

**Success Criteria:** All acceptance gates passed, metrics within SLOs

**Ready to Execute:** ✅ This plan is actionable starting today
