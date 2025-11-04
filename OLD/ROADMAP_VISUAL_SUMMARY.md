# 10-Week Roadmap - Visual Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COACHING MANAGEMENT PLATFORM                             │
│                         10-Week Execution Plan                              │
└─────────────────────────────────────────────────────────────────────────────┘

CURRENT STATE: Sprint 0 (60% complete) + Sprint 1 (40% complete)
GOAL: Production-ready admin platform in 10 weeks


┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  SPRINT 0   │  │  SPRINT 1   │  │  SPRINT 2   │  │  SPRINT 3   │  │  SPRINT 4   │
│   Week 0    │  │  Week 1-2   │  │  Week 3-4   │  │  Week 5-6   │  │  Week 7-8   │
│─────────────│  │─────────────│  │─────────────│  │─────────────│  │─────────────│
│ ⚠️ 60% DONE │  │ ⚠️ 40% DONE │  │ ❌ PENDING  │  │ ❌ PENDING  │  │ ❌ PENDING  │
│             │  │             │  │             │  │             │  │             │
│ Security    │  │ Admin Shell │  │ Management  │  │ Finance     │  │ Automation  │
│ • RLS       │  │ • TabNav    │  │ • UserMgmt  │  │ • Reports   │  │ • n8n       │
│ • RPC       │  │ • TopBar    │  │ • Support   │  │ • Exports   │  │ • Messaging │
│ • ABAC      │  │ • Theme     │  │ • Settings  │  │ • Dunning   │  │ • Broadcast │
│ • Audit     │  │ • Keyset    │  │ • Jobs      │  │ • IntegrationHealth │         │
│ • Sentry    │  │ • Dashboard │  │ • Realtime  │  │ • Predictive│  │             │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘

┌─────────────┐
│  SPRINT 5   │
│  Week 9-10  │
│─────────────│
│ ❌ PENDING  │
│             │
│ AI Insights │
│ • Forecast  │
│ • Churn     │
│ • Teacher   │
│ • ModelOps  │
│ • Compliance│
└─────────────┘


═══════════════════════════════════════════════════════════════════════════════
                            CRITICAL PATH (BLOCKS ALL)
═══════════════════════════════════════════════════════════════════════════════

  1. Complete Sprint 0 RLS ────────────────────────┐
                                                    │
  2. Establish Secure RPC Pattern ─────────────────┼─→ BLOCKS ALL WRITES
                                                    │
  3. Lock Data Contracts ──────────────────────────┼─→ BLOCKS ALL SCREENS
                                                    │
  4. Implement Keyset Pagination ──────────────────┼─→ BLOCKS SCALABILITY
                                                    │
  5. Build Bottom Tab Navigator ───────────────────┘─→ BLOCKS NAVIGATION


═══════════════════════════════════════════════════════════════════════════════
                              WEEK-BY-WEEK BREAKDOWN
═══════════════════════════════════════════════════════════════════════════════

┌─────────┬────────────────────────────────────────────────────────────────────┐
│ WEEK 0  │ 🔴 CRITICAL - Security Foundations                                 │
│ (2 days)│                                                                    │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 1   │ • Complete RLS on all admin tables                                │
│         │ • Create secure RPC pattern                                       │
│         │ • Document branch-scoped access                                   │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 2   │ • Integrate Sentry with correlation IDs                           │
│         │ • Define performance budgets                                      │
│         │ • Implement rate limiting                                         │
│         │ • ✅ SPRINT 0 SIGN-OFF                                            │
└─────────┴────────────────────────────────────────────────────────────────────┘

┌─────────┬────────────────────────────────────────────────────────────────────┐
│ WEEK 1  │ 🟡 HIGH PRIORITY - Admin Shell + Data Contracts                   │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 1-2 │ • Lock Dashboard KPI contract                                     │
│         │ • Lock User Management contract                                   │
│         │ • Lock Support Tickets contract                                   │
│         │ • Lock Financial Metrics contract                                 │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 3-4 │ • Build Bottom Tab Navigator (permission-based)                   │
│         │ • Create TopAppBar component                                      │
│         │ • Implement theme token system                                    │
│         │ • Add offline banner + degraded mode                              │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 5-7 │ • Implement keyset pagination (Users + Tickets)                   │
│         │ • Create composite indexes                                        │
│         │ • Add per-card skeleton loaders                                   │
│         │ • Set up placeholderData pattern                                  │
└─────────┴────────────────────────────────────────────────────────────────────┘

┌─────────┬────────────────────────────────────────────────────────────────────┐
│ WEEK 2  │ 🟡 HIGH PRIORITY - Dashboard KPIs + Support Center                │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 8-10│ • Build Dashboard KPI cards (Active Users, MTD Revenue, etc.)     │
│         │ • Add per-card skeletons + staleTime policies                     │
│         │ • Wire up analytics tracking                                      │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 11-14│ • Build SupportCenterScreen with filters                         │
│         │ • Implement ticket actions (Assign/Resolve)                       │
│         │ • Add SLA timers + real-time updates                              │
│         │ • ✅ SPRINT 1 SIGN-OFF                                            │
└─────────┴────────────────────────────────────────────────────────────────────┘

┌─────────┬────────────────────────────────────────────────────────────────────┐
│ WEEK 3  │ 🟢 MEDIUM PRIORITY - Management & Support (actionable)            │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 15-17│ • Polish UserManagementScreenV2 (search, filters, bulk actions) │
│         │ • Require reason for destructive actions                          │
│         │ • Verify all actions use RPC + audit                              │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 18-21│ • Complete SupportCenterScreen (Escalate, comments, attachments)│
│         │ • Build SLA breach alerts                                         │
│         │ • Add first-response metrics                                      │
└─────────┴────────────────────────────────────────────────────────────────────┘

┌─────────┬────────────────────────────────────────────────────────────────────┐
│ WEEK 4  │ 🟢 MEDIUM PRIORITY - System Settings + Jobs Center                │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 22-24│ • Create SystemSettingsScreen (read-only toggles)               │
│         │ • Add two-person approval flow + OTP verification                 │
│         │ • Build settings audit log viewer                                 │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 25-28│ • Create JobsCenterScreen (queue, status, results)              │
│         │ • Implement job templates                                         │
│         │ • ✅ SPRINT 2 SIGN-OFF                                            │
└─────────┴────────────────────────────────────────────────────────────────────┘

┌─────────┬────────────────────────────────────────────────────────────────────┐
│ WEEK 5  │ 🟢 MEDIUM PRIORITY - Financial Reports (operational)              │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 29-31│ • Create FinancialReportsScreenV2                                │
│         │ • Build daily revenue trend (materialized view)                   │
│         │ • Add branch breakdown + dues aging                               │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 32-35│ • Implement CSV/PDF exports via Jobs Center                      │
│         │ • Build dunning ladder configuration UI                           │
│         │ • Create message templates + bulk send                            │
└─────────┴────────────────────────────────────────────────────────────────────┘

┌─────────┬────────────────────────────────────────────────────────────────────┐
│ WEEK 6  │ 🟢 MEDIUM PRIORITY - Integration Health + Dashboard Complete      │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 36-38│ • Create IntegrationHealthScreen                                 │
│         │ • Monitor payment gateway, email, WhatsApp                        │
│         │ • Add token expiry warnings + backlog viewer                      │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 39-42│ • Complete all Dashboard KPI cards                               │
│         │ • Add trend indicators + drill-down navigation                    │
│         │ • Add predictive payment risk score (advisory)                    │
│         │ • ✅ SPRINT 3 SIGN-OFF                                            │
└─────────┴────────────────────────────────────────────────────────────────────┘

┌─────────┬────────────────────────────────────────────────────────────────────┐
│ WEEK 7  │ 🔵 LOW PRIORITY - Automation (n8n workflows)                      │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 43-45│ • Create WorkflowLibraryScreen                                   │
│         │ • List workflows with metadata (version, owner, risk)             │
│         │ • Add enable/disable controls                                     │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 46-49│ • Build workflow error queue + retry mechanism                   │
│         │ • Implement correlation ID tracking                               │
│         │ • Create workflow analytics + testing UI                          │
└─────────┴────────────────────────────────────────────────────────────────────┘

┌─────────┬────────────────────────────────────────────────────────────────────┐
│ WEEK 8  │ 🔵 LOW PRIORITY - Messaging Center + Emergency Comms              │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 50-53│ • Create MessagingCenterScreen                                   │
│         │ • Build template library + channel selection                      │
│         │ • Add quiet hours, throttling, A/B tests                          │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 54-56│ • Create EmergencyBroadcastScreen                                │
│         │ • Add acknowledgment tracking + re-contact logic                  │
│         │ • ✅ SPRINT 4 SIGN-OFF                                            │
└─────────┴────────────────────────────────────────────────────────────────────┘

┌─────────┬────────────────────────────────────────────────────────────────────┐
│ WEEK 9  │ 🔵 LOW PRIORITY - AI Insights (Phase 1 advisory)                  │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 57-60│ • Create AIInsightsScreen                                        │
│         │ • Build revenue forecast card (6-month)                           │
│         │ • Add churn/at-risk cohorts + suggested interventions             │
│         │ • Build teacher performance insights                              │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 61-63│ • Create capacity snapshot card                                  │
│         │ • Add room saturation + teacher workload metrics                  │
│         │ • Implement risk alerts + optimization suggestions                │
└─────────┴────────────────────────────────────────────────────────────────────┘

┌─────────┬────────────────────────────────────────────────────────────────────┐
│ WEEK 10 │ 🔵 LOW PRIORITY - ModelOps & Governance foundation                │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 64-66│ • Create ModelRegistryScreen                                     │
│         │ • List model versions + metrics                                   │
│         │ • Build A/B flag management + baseline revert controls            │
├─────────┼────────────────────────────────────────────────────────────────────┤
│ Day 67-70│ • Create ComplianceConsoleScreen                                 │
│         │ • Build consent log viewer + retention schedules                  │
│         │ • Implement export/delete request handling                        │
│         │ • Add feedback loop UI + drift alert dashboard                    │
│         │ • ✅ SPRINT 5 SIGN-OFF                                            │
│         │ • 🎉 PROJECT COMPLETE                                             │
└─────────┴────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                             PARALLEL WORK STREAMS
═══════════════════════════════════════════════════════════════════════════════

Week 1-2: Three teams working in parallel
  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
  │  Platform Team  │  │    UX Team      │  │   Data Team     │
  │  (RLS + RPC)    │  │  (UI Shell)     │  │  (Contracts)    │
  └─────────────────┘  └─────────────────┘  └─────────────────┘

Week 3-4: Two teams working in parallel
  ┌─────────────────┐  ┌─────────────────┐
  │   Ops Team      │  │   UX Team       │
  │  (Support)      │  │  (Settings)     │
  └─────────────────┘  └─────────────────┘

Week 5-6: Two teams working in parallel
  ┌─────────────────┐  ┌─────────────────┐
  │  Finance Team   │  │   Data Team     │
  │  (Reports)      │  │  (Materialized) │
  └─────────────────┘  └─────────────────┘

Week 7-8: Two teams working in parallel
  ┌─────────────────┐  ┌─────────────────┐
  │ Automation Team │  │   UX Team       │
  │  (n8n + Msg)    │  │  (UI Polish)    │
  └─────────────────┘  └─────────────────┘

Week 9-10: Two teams working in parallel
  ┌─────────────────┐  ┌─────────────────┐
  │   AI Team       │  │  Compliance     │
  │  (Insights)     │  │  (Governance)   │
  └─────────────────┘  └─────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                            SUCCESS METRICS (SLOs)
═══════════════════════════════════════════════════════════════════════════════

┌────────────────────────┬─────────────┬────────────────────────────────────┐
│ Metric                 │ Target SLO  │ Tracking Method                    │
├────────────────────────┼─────────────┼────────────────────────────────────┤
│ API Read (p95)         │ < 300ms     │ Supabase Logs + Sentry             │
│ API Write (p95)        │ < 500ms     │ Supabase Logs + Sentry             │
│ Dashboard First Content│ < 1s        │ React Native Performance Monitor   │
│ Screen Interactive     │ < 2s        │ React Native Performance Monitor   │
│ Export (100k rows)     │ < 3min      │ Jobs Center Metrics                │
│ Support First Response │ < 15min     │ Support Center Analytics           │
│ SLA Breaches           │ < 5%        │ Support Center Dashboard           │
│ RLS Coverage           │ 100%        │ Database Policy Audit              │
│ Audit Coverage         │ 100%        │ Audit Log Query                    │
│ 2FA Adoption (Admins)  │ 100%        │ User Roles Table                   │
│ Forecast MAPE          │ < 15%       │ AI Model Registry                  │
│ Uptime                 │ 99.9%       │ Monitoring Dashboard               │
└────────────────────────┴─────────────┴────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                           RISK MITIGATION MATRIX
═══════════════════════════════════════════════════════════════════════════════

┌──────────────────┬────────────┬─────────────────────────┬─────────────────┐
│ Risk             │ Likelihood │ Mitigation              │ Contingency     │
├──────────────────┼────────────┼─────────────────────────┼─────────────────┤
│ Scope Creep (AI) │ HIGH       │ Start advisory only     │ Defer Phase 2   │
│ Performance      │ MEDIUM     │ Indexes + mat views     │ Budget per page │
│ Compliance       │ MEDIUM     │ Enforce from day 1      │ Legal review    │
│ Policy Drift     │ LOW        │ DB-driven RBAC/RLS      │ Monthly audit   │
│ Team Availability│ MEDIUM     │ Cross-training + docs   │ Priority matrix │
│ Data Contracts   │ LOW        │ Lock Week 1 + versioning│ Migration path  │
└──────────────────┴────────────┴─────────────────────────┴─────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                            RESOURCE ALLOCATION
═══════════════════════════════════════════════════════════════════════════════

┌────────────────────────────┬────────────────┬────────────────────────────┐
│ Team/DRI                   │ Focus Weeks    │ Primary Deliverables       │
├────────────────────────────┼────────────────┼────────────────────────────┤
│ Platform & Security        │ 0-1, ongoing   │ RLS, RPC, ABAC, Sentry     │
│ Admin UX & Navigation      │ 1-2, 4, 8-10   │ UI Shell, Screens, Polish  │
│ Data & Performance         │ 1, 5-6, 9-10   │ Contracts, Indexes, ML     │
│ Ops & Support              │ 2-4            │ Dashboard, Support, Jobs   │
│ Finance & Analytics        │ 5-6            │ Reports, Exports, Dunning  │
│ Automation & Integrations  │ 7-8            │ n8n, Messaging, Emergency  │
│ AI Insights & Governance   │ 9-10           │ Forecasts, ModelOps        │
│ QA/Release/Compliance      │ All weeks      │ Testing, Security, Release │
└────────────────────────────┴────────────────┴────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                              QUICK START GUIDE
═══════════════════════════════════════════════════════════════════════════════

TODAY (Next 2 hours):
  ✅ 1. Read ROADMAP_ANALYSIS_AND_PLAN.md
  ✅ 2. Assign DRIs
  ✅ 3. Create sprint0-security-foundations branch
  ✅ 4. Set up project tracking
  ✅ 5. Start RLS migration

THIS WEEK (Days 1-2):
  ✅ Complete Sprint 0 (RLS, RPC, ABAC, Sentry, Rate Limits)
  ✅ Lock data contracts
  ✅ Start Sprint 1 (UI Shell + Keyset Pagination)

NEXT WEEK (Days 3-7):
  ✅ Complete Sprint 1 (Dashboard KPIs + Support Center)
  ✅ Sprint 1 sign-off
  ✅ Start Sprint 2 (Management & Support actionable)


═══════════════════════════════════════════════════════════════════════════════
                              DOCUMENT INDEX
═══════════════════════════════════════════════════════════════════════════════

📄 ROADMAP_ANALYSIS_AND_PLAN.md           - Full 10-week detailed plan
📄 SPRINT0_COMPLETION_TRACKER.md          - Tactical Sprint 0 checklist
📄 IMMEDIATE_ACTION_PLAN.md               - What to do right now (2 hours)
📄 ROADMAP_VISUAL_SUMMARY.md (this file)  - Visual overview
📄 USER_MANAGEMENT_SPRINT1_PHASE3_COMPLETE.md - Recent completion proof


═══════════════════════════════════════════════════════════════════════════════
                              STATUS LEGEND
═══════════════════════════════════════════════════════════════════════════════

✅ Complete      - Feature shipped and verified
⚠️  In Progress  - Work started, not complete
❌ Not Started   - Future work
🔴 Critical      - Blocks everything else
🟡 High Priority - Blocks major features
🟢 Medium Priority - Important but not blocking
🔵 Low Priority  - Nice to have, can defer


═══════════════════════════════════════════════════════════════════════════════
                              PROJECT MOTTO
═══════════════════════════════════════════════════════════════════════════════

  "Security first, ship vertical slices, measure everything, iterate fast"

                          🚀 LET'S BUILD THIS! 🚀
═══════════════════════════════════════════════════════════════════════════════
