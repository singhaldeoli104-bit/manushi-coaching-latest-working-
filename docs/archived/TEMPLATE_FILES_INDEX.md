# React Query + API Service Templates - Complete Index

## Overview

This document provides an index of all template files created for implementing a production-ready API service layer with React Query integration.

**Created:** October 19, 2025
**Purpose:** Provide comprehensive templates and guides for building scalable, type-safe, and performant API integrations

---

## Template Files (4 Total)

### 1. Service Layer Template

**File:** `C:\PC\src\services\api\parent\TEMPLATE_parentService.ts`
**Size:** 24 KB
**Lines:** ~670

**Purpose:** Complete template showing how to create API service functions that interact with Supabase.

**Contains:**
- ✅ 13 different patterns (simple queries, RPC calls, pagination, filtering, mutations)
- ✅ Extensive JSDoc comments explaining each pattern
- ✅ TypeScript type safety examples
- ✅ Error handling with custom error classes
- ✅ Retry logic for resilience
- ✅ Real-world examples using actual Supabase client
- ✅ Best practices checklist
- ✅ When to use each pattern guide

**Key Patterns:**
1. Simple Single Record Query - `getParentProfile()`
2. Simple List Query - `getParentChildRelationships()`
3. RPC Function Call - `getParentChildren()`
4. RPC with Aggregations - `getParentDashboardSummary()`
5. Paginated Query - `getParentChildrenPaginated()`
6. Simple Update - `updateParentProfile()`
7. Specialized Update - `updateNotificationPreferences()`
8. Update with Side Effects - `completeOnboarding()`
9. Multiple Filters - `getParentChildrenFiltered()`
10. Existence Check - `parentExists()`
11. Calculated Fields - `getProfileCompletionPercentage()`
12. Compound Update - `acceptTermsAndPrivacy()`
13. Tracking Update - `updateLastLogin()`

---

### 2. React Query Hooks Template

**File:** `C:\PC\src\hooks\TEMPLATE_useParentAPI.ts`
**Size:** 33 KB
**Lines:** ~1100

**Purpose:** Complete template showing how to create React Query hooks that wrap service functions.

**Contains:**
- ✅ 15 hook patterns (queries, mutations, compound hooks)
- ✅ Query key factory pattern
- ✅ Cache invalidation strategies
- ✅ Optimistic updates example
- ✅ Prefetching utilities
- ✅ Error handling in hooks
- ✅ TypeScript generics and types
- ✅ Performance optimization tips
- ✅ Extensive inline documentation

**Key Patterns:**
1. Basic Query Hook - `useParentProfile()`
2. Array Query Hook - `useParentChildren()`
3. Complex Query Hook - `useDashboardSummary()`
4. Query with Filters - `useParentChildrenFiltered()`
5. Paginated Query - `useParentChildrenPaginated()`
6. Utility Query - `useProfileCompletion()`
7. Boolean Query - `useParentExists()`
8. Simple Mutation - `useUpdateParentProfile()`
9. Optimistic Mutation - `useUpdateNotificationPreferences()`
10. Action Mutation - `useCompleteOnboarding()`
11. Tracking Mutation - `useUpdateLastLogin()`
12. Multi-field Mutation - `useAcceptTerms()`
13. Compound Hook - `useParentDashboardData()`
14. Prefetch Hook - `usePrefetchParentData()`
15. Invalidation Hook - `useInvalidateParentCache()`

---

### 3. Setup and Configuration Guide

**File:** `C:\PC\REACT_QUERY_SETUP_GUIDE.md`
**Size:** 29 KB

**Purpose:** Complete step-by-step guide for setting up React Query in your React Native application.

**Sections:**
1. **Introduction** - Why React Query and benefits
2. **Installation** - Dependencies and setup
3. **Project Structure** - Recommended folder organization
4. **QueryClient Configuration** - Stale time, cache time, retry logic
5. **Provider Setup** - Wrapping your app
6. **Using Hooks in Components** - 5 complete component examples
7. **Advanced Patterns** - Conditional fetching, polling, infinite scroll
8. **Best Practices** - Query keys, error handling, performance
9. **Troubleshooting** - Common issues and solutions
10. **Migration Guide** - From useState/Redux to React Query

**Component Examples:**
- Simple query with loading/error states
- Form with mutation and validation
- List with pull-to-refresh
- Dashboard with multiple queries
- Optimistic updates toggle

**Topics Covered:**
- Query lifecycle
- Mutation lifecycle
- Cache management
- Stale time vs cache time
- Request deduplication
- Background refetching
- Error handling
- Performance optimization

---

### 4. Quick Reference Guide

**File:** `C:\PC\TEMPLATE_QUICK_REFERENCE.md`
**Size:** 14 KB

**Purpose:** Quick-reference cheat sheet for common patterns and code snippets.

**Sections:**
1. **Quick Start Guide** - 5-step process
2. **Pattern Index** - Table of all patterns
3. **Common Code Snippets** - Copy-paste templates
4. **Key Concepts** - Query keys, stale time, lifecycle
5. **React Query Configuration** - Recommended settings
6. **Error Handling** - Service and component examples
7. **Best Practices Checklist** - What to do/avoid
8. **Replication Checklist** - How to create new services
9. **Common Pitfalls** - What NOT to do

**Quick Reference Tables:**
- Pattern index with use cases
- Recommended stale/cache times by data type
- Configuration presets for different scenarios

---

## Documentation Files (2 Total)

### 5. Architecture Diagram

**File:** `C:\PC\ARCHITECTURE_DIAGRAM.md`
**Size:** 33 KB

**Purpose:** Visual diagrams explaining the complete architecture and data flow.

**Diagrams:**
1. **Complete Data Flow** - App → Component → Hook → Service → Supabase
2. **Query Lifecycle** - From mount to cache garbage collection
3. **Mutation Lifecycle** - From user action to cache invalidation
4. **Cache Invalidation Flow** - How updates propagate
5. **Hierarchical Query Keys** - Tree structure and invalidation
6. **Component-Hook-Service Flow** - Complete request flow
7. **Multi-Component Data Sharing** - How cache deduplicates
8. **Performance Optimization Flow** - All optimizations visualized
9. **Error Flow Diagram** - Error handling at each layer

**ASCII Diagrams:**
- Full architecture layers
- Query lifecycle states
- Mutation flow with optimistic updates
- Cache hierarchy with examples
- Request flow from component to database

---

### 6. Phase 1 Completion Summary

**File:** `C:\PC\PHASE1_COMPLETION_SUMMARY.md`
**Size:** 8.3 KB

**Purpose:** Summary of the parent section backend implementation (Phase 1).

**Content:**
- What was built in Phase 1
- Database schema overview
- API functions implemented
- Testing and validation
- Performance considerations
- Security measures
- Next steps for Phase 2

---

## How to Use These Templates

### For New Developers

1. **Start Here:** Read `REACT_QUERY_SETUP_GUIDE.md` from start to finish
2. **Study Patterns:** Open `TEMPLATE_parentService.ts` and read all comments
3. **Learn Hooks:** Open `TEMPLATE_useParentAPI.ts` and understand query keys
4. **Visual Learning:** Review `ARCHITECTURE_DIAGRAM.md` for visual understanding
5. **Quick Reference:** Bookmark `TEMPLATE_QUICK_REFERENCE.md` for daily use

### For Building New Services

**Example: Creating Academic Service**

1. **Copy Service Template**
   ```bash
   cp src/services/api/parent/TEMPLATE_parentService.ts \
      src/services/api/parent/academicService.ts
   ```

2. **Modify for Academic Data**
   - Update table names (`academic_summary`, `subject_performance`, etc.)
   - Update function names (`getAcademicSummary`, `getSubjectPerformance`, etc.)
   - Update TypeScript types from `supabase-parent.types.ts`
   - Keep the same patterns, just change the data

3. **Copy Hooks Template**
   ```bash
   cp src/hooks/TEMPLATE_useParentAPI.ts \
      src/hooks/useAcademicAPI.ts
   ```

4. **Modify for Academic Hooks**
   - Update query key factory: `academicKeys = { ... }`
   - Update hook names: `useAcademicSummary`, `useSubjectPerformance`, etc.
   - Update import paths to `academicService.ts`
   - Keep the same React Query patterns

5. **Use in Components**
   ```typescript
   // In your component
   import { useAcademicSummary } from '../hooks/useAcademicAPI';

   function AcademicScreen({ studentId }) {
     const { data, isLoading, error } = useAcademicSummary(studentId);
     // ... rest of component
   }
   ```

### For Existing Services

If you already have service functions but want to add React Query:

1. **Review Your Functions** - Compare with patterns in template
2. **Add Error Handling** - Use `parseSupabaseError()` and custom errors
3. **Add Retry Logic** - Use `retryWithBackoff()` for reads
4. **Create Hooks** - Use `TEMPLATE_useParentAPI.ts` as reference
5. **Setup React Query** - Follow `REACT_QUERY_SETUP_GUIDE.md`

---

## File Purposes Summary

| File | Purpose | When to Use |
|------|---------|-------------|
| `TEMPLATE_parentService.ts` | Service function patterns | Creating/reviewing service layer |
| `TEMPLATE_useParentAPI.ts` | React Query hook patterns | Creating hooks for services |
| `REACT_QUERY_SETUP_GUIDE.md` | Setup and usage guide | Initial setup, learning, reference |
| `TEMPLATE_QUICK_REFERENCE.md` | Quick cheat sheet | Daily development, quick lookup |
| `ARCHITECTURE_DIAGRAM.md` | Visual architecture | Understanding flow, onboarding |
| `PHASE1_COMPLETION_SUMMARY.md` | Implementation summary | Project status, handoff |

---

## Pattern Coverage

### Service Layer (13 Patterns)

✅ **Read Operations:**
- Single record queries
- List queries with filtering
- Paginated queries
- RPC function calls
- Aggregations and summaries
- Existence checks

✅ **Write Operations:**
- Simple updates
- Specialized updates
- Multi-field updates
- Tracking updates

✅ **Utilities:**
- Calculated fields
- Validation helpers

### Hooks Layer (15 Patterns)

✅ **Query Hooks:**
- Basic queries
- Array queries
- Complex queries
- Filtered queries
- Paginated queries
- Utility queries
- Boolean queries

✅ **Mutation Hooks:**
- Simple mutations
- Optimistic mutations
- Action mutations
- Tracking mutations
- Multi-field mutations

✅ **Utility Hooks:**
- Compound hooks
- Prefetch hooks
- Invalidation hooks

---

## Best Practices Enforced

### Type Safety
- ✅ All functions fully typed
- ✅ TypeScript strict mode compatible
- ✅ Return types specified
- ✅ Parameter types explicit
- ✅ Generics used appropriately

### Error Handling
- ✅ Custom error classes
- ✅ Centralized error parsing
- ✅ User-friendly messages
- ✅ Proper error propagation
- ✅ Retry logic for transient errors

### Performance
- ✅ Request deduplication
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ Prefetching strategies
- ✅ Appropriate cache times

### Code Quality
- ✅ Extensive JSDoc comments
- ✅ Clear function names
- ✅ Single responsibility
- ✅ DRY principles
- ✅ Consistent patterns

### Developer Experience
- ✅ IntelliSense support
- ✅ Auto-completion
- ✅ Clear error messages
- ✅ Helpful examples
- ✅ Copy-paste ready code

---

## Production Readiness

All templates are production-ready and include:

✅ **Error Handling:**
- Network errors with retry
- Authentication errors
- Authorization errors
- Validation errors
- Not found errors

✅ **Performance:**
- Caching strategies
- Request deduplication
- Background refetching
- Optimistic updates
- Lazy loading

✅ **Security:**
- Input validation
- Error message sanitization
- Proper authentication flow
- RLS policy compatible

✅ **Maintainability:**
- Clear code structure
- Extensive documentation
- Consistent patterns
- Easy to test
- Scalable architecture

---

## Integration with Existing Code

These templates work with:

- ✅ Existing Supabase client (`src/services/supabase/client.ts`)
- ✅ Existing types (`src/types/supabase-parent.types.ts`)
- ✅ Existing error handler (`src/services/api/errorHandler.ts`)
- ✅ React Native navigation
- ✅ AsyncStorage for cache persistence
- ✅ TypeScript strict mode

---

## Learning Path

**Beginner:** (New to React Query)
1. Read Introduction in `REACT_QUERY_SETUP_GUIDE.md`
2. Follow installation steps
3. Study one simple example from service template
4. Study corresponding hook
5. Build a simple component using the hook
6. Review `ARCHITECTURE_DIAGRAM.md` for understanding

**Intermediate:** (Familiar with React Query basics)
1. Review `TEMPLATE_QUICK_REFERENCE.md`
2. Study advanced patterns in hooks template
3. Learn optimistic updates
4. Implement pagination
5. Study compound hooks
6. Practice cache invalidation

**Advanced:** (Ready to build production features)
1. Study all patterns in both templates
2. Understand query key factory pattern
3. Implement prefetching strategies
4. Optimize for performance
5. Build reusable compound hooks
6. Create new services using patterns

---

## Support Resources

### Within Templates
- Extensive inline comments
- JSDoc documentation
- Code examples
- Usage examples
- Best practices notes

### External Resources
- [React Query Official Docs](https://tanstack.com/query/latest)
- [Supabase Documentation](https://supabase.com/docs)
- [TkDodo's React Query Blog](https://tkdodo.eu/blog/practical-react-query)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)

---

## Next Steps

After reviewing these templates:

1. **Set Up React Query** (if not already done)
   - Install dependencies
   - Create configuration files
   - Wrap app with provider

2. **Create Your First Service**
   - Choose simplest domain (e.g., academic)
   - Copy template
   - Modify for your data
   - Test thoroughly

3. **Create Corresponding Hooks**
   - Copy hooks template
   - Update query keys
   - Update hook names
   - Test in components

4. **Build Components**
   - Import hooks
   - Handle loading/error states
   - Implement user interactions
   - Add pull-to-refresh

5. **Iterate and Expand**
   - Create remaining services
   - Build compound hooks
   - Add prefetching
   - Optimize performance

---

## File Checklist

Before starting development, ensure you have:

- [ ] Read `REACT_QUERY_SETUP_GUIDE.md`
- [ ] Reviewed `TEMPLATE_parentService.ts`
- [ ] Reviewed `TEMPLATE_useParentAPI.ts`
- [ ] Studied `ARCHITECTURE_DIAGRAM.md`
- [ ] Bookmarked `TEMPLATE_QUICK_REFERENCE.md`
- [ ] Installed React Query dependencies
- [ ] Created QueryClient configuration
- [ ] Set up QueryProvider
- [ ] Ready to build!

---

## Summary

These templates provide:
- **1,770+ lines** of production-ready code
- **13 service patterns** covering all common use cases
- **15 hook patterns** for queries, mutations, and utilities
- **86 KB** of comprehensive documentation
- **9 visual diagrams** explaining architecture and flow
- **Complete examples** ready to copy and modify
- **Best practices** enforced throughout
- **Type safety** with full TypeScript support

**Goal:** Make it easy for anyone to build scalable, performant, and maintainable API integrations following industry best practices.

---

**Ready to build production-ready API integrations!** 🚀
