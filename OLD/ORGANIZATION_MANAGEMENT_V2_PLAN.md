# OrganizationManagementScreen v2.0 - Implementation Plan

**Status:** Phase 2b - Core Management Screens (Batches Management)
**Target:** Replace complex organizational structure with simple batches management
**Strategy:** Simplification - Focus on batches (class groups) CRUD

---

## Current State Analysis

**File:** `src/screens/admin/OrganizationManagementScreen.tsx`
**Size:** 1321 lines
**Problem:** Overly complex with 5 entity types, no real Supabase queries

### Entities in Current Screen:
1. **Department** - Complex hierarchical structure (not in database)
2. **ClassStructure** - Complex with schedules and subjects (over-engineered)
3. **TeacherAssignment** - Teacher workload management (complex)
4. **StudentGroup** - Student grouping system (complex)
5. **StaffHierarchy** - Staff organizational chart (complex)

### Reality Check:
- ❌ No branches table exists in database
- ❌ No departments table exists
- ✅ **batches** table EXISTS (actual schema)
- Strategy mentions "branches" but database has "batches"
- Batches = Class groups (Grade 10A, Grade 11 Science, etc.)

---

## v2.0 Simplification Strategy

### Phase 2b (THIS PHASE): Batches Management
**Target Lines:** ~500 lines (down from 1321)
**Focus:** Simple batch/class management

**Features:**
- List batches (with grade, section, academic year)
- Create batch
- Edit batch
- Activate/Deactivate batch
- Search and filter
- Stats cards (total, active, inactive)
- RBAC gate at screen entry
- Audit logging for mutations
- BaseScreen wrapper

**NOT INCLUDED:**
- Departments (doesn't exist in DB)
- Class schedules (too complex, future phase)
- Teacher assignments (separate screen, future)
- Student groups (separate feature, future)
- Staff hierarchy (separate screen, future)

---

## Data Contract

### 1. Batches Table Schema (EXISTS)

**Database Table:** `batches`

**Schema:**
```sql
CREATE TABLE batches (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  grade_level VARCHAR NOT NULL,
  section VARCHAR,
  academic_year VARCHAR,
  start_date DATE,
  end_date DATE,
  max_students INTEGER,
  current_enrollment INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**TypeScript Interface:**
```typescript
interface Batch {
  id: string;
  name: string;
  grade_level: string;
  section: string | null;
  academic_year: string | null;
  start_date: string | null;
  end_date: string | null;
  max_students: number | null;
  current_enrollment: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

---

### 2. Fetch Batches Query

**Interface:**
```typescript
interface FetchBatchesParams {
  academicYear?: string;
  gradeLevel?: string;
  isActive?: boolean;
  search?: string;
}
```

**Supabase Query:**
```typescript
const fetchBatches = async (params: FetchBatchesParams): Promise<Batch[]> => {
  let query = supabase
    .from('batches')
    .select('*')
    .order('grade_level', { ascending: true })
    .order('section', { ascending: true });

  if (params.academicYear) {
    query = query.eq('academic_year', params.academicYear);
  }

  if (params.gradeLevel) {
    query = query.eq('grade_level', params.gradeLevel);
  }

  if (params.isActive !== undefined) {
    query = query.eq('is_active', params.isActive);
  }

  if (params.search) {
    query = query.or(`name.ilike.%${params.search}%,section.ilike.%${params.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};
```

---

### 3. Create Batch Mutation

**Implementation:**
```typescript
const createBatchMutation = useMutation({
  mutationFn: async (batchData: Omit<Batch, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase
      .from('batches')
      .insert({
        ...batchData,
        current_enrollment: 0,
        is_active: true,
      });

    if (error) throw error;

    // MANDATORY AUDIT LOG
    await logAudit({
      action: 'create_branch', // Using closest action type
      targetType: 'branch',
      metadata: {
        batch_name: batchData.name,
        grade_level: batchData.grade_level,
        section: batchData.section,
        timestamp: new Date().toISOString(),
      },
    });

    return { success: true };
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['batches'] });
    Alert.alert('Success', 'Batch created successfully');
  },
});
```

---

### 4. Update Batch Mutation

**Implementation:**
```typescript
const updateBatchMutation = useMutation({
  mutationFn: async ({ batchId, updates }: { batchId: string; updates: Partial<Batch> }) => {
    const { error } = await supabase
      .from('batches')
      .update(updates)
      .eq('id', batchId);

    if (error) throw error;

    // MANDATORY AUDIT LOG
    await logAudit({
      action: 'update_branch',
      targetId: batchId,
      targetType: 'branch',
      changes: updates,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });

    return { success: true };
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['batches'] });
    Alert.alert('Success', 'Batch updated successfully');
  },
});
```

---

### 5. Toggle Batch Status (Activate/Deactivate)

**Implementation:**
```typescript
const toggleBatchStatusMutation = useMutation({
  mutationFn: async ({ batchId, currentStatus }: { batchId: string; currentStatus: boolean }) => {
    const newStatus = !currentStatus;

    const { error } = await supabase
      .from('batches')
      .update({ is_active: newStatus })
      .eq('id', batchId);

    if (error) throw error;

    // MANDATORY AUDIT LOG
    await logAudit({
      action: 'update_branch',
      targetId: batchId,
      targetType: 'branch',
      changes: {
        is_active: { from: currentStatus, to: newStatus },
      },
      metadata: {
        action_type: newStatus ? 'activate' : 'deactivate',
        timestamp: new Date().toISOString(),
      },
    });

    return { success: true };
  },
  onSuccess: (_, variables) => {
    queryClient.invalidateQueries({ queryKey: ['batches'] });
    const action = variables.currentStatus ? 'deactivated' : 'activated';
    Alert.alert('Success', `Batch ${action} successfully`);
  },
});
```

---

## RBAC Integration

**Screen-Level RBAC Gate:**
```typescript
export const OrganizationManagementScreenV2: React.FC = () => {
  const { user } = useAuth();
  const currentRole = (user as any)?.role as AdminRole;

  // RBAC check at screen entry
  useEffect(() => {
    if (!can(currentRole, 'manage_branches')) {
      trackAction('access_denied', 'OrganizationManagementV2', {
        role: currentRole,
        requiredPermission: 'manage_branches',
      });
      safeNavigate('AccessDeniedScreen', {
        requiredPermission: 'manage_branches',
        userRole: currentRole,
        attemptedAction: 'Organization Management',
      });
    }
  }, [currentRole]);

  // ... rest of component
};
```

---

## UI Structure

```
OrganizationManagementScreenV2
├── BaseScreen (wrapper)
│   ├── Loading state (when fetching)
│   ├── Error state (on fetch error)
│   └── Empty state (no batches found)
└── Content
    ├── Header
    │   ├── Title: "Batches Management"
    │   ├── Subtitle: "Manage class batches and groups"
    │   └── Create Button (FAB or header button)
    ├── Stats Cards (3 cards)
    │   ├── Total Batches
    │   ├── Active Batches
    │   └── Total Students (sum of current_enrollment)
    ├── Filters Section
    │   ├── Search Input (name, section)
    │   ├── Academic Year Filter
    │   ├── Grade Level Filter
    │   └── Status Filter (all, active, inactive)
    └── Batches List (FlatList)
        └── BatchCard (for each batch)
            ├── Batch Name
            ├── Grade Level + Section
            ├── Academic Year
            ├── Enrollment (current/max)
            ├── Status Badge (active/inactive)
            └── Actions Menu
                ├── Edit
                └── Activate/Deactivate
```

---

## Implementation Checklist

**Before Starting:**
- [x] Verify batches table schema
- [x] Confirm RBAC permission (manage_branches)
- [x] Plan simplified feature set

**Core Implementation:**
- [ ] Create OrganizationManagementScreenV2.tsx
- [ ] Add RBAC gate (can(role, 'manage_branches'))
- [ ] Implement fetchBatches with TanStack Query
- [ ] Add search input with debounce
- [ ] Add academic year filter
- [ ] Add grade level filter
- [ ] Add status filter (active/inactive)
- [ ] Add stats cards (computed from batches data)
- [ ] Add batches FlatList with optimization
- [ ] Add BatchCard component with React.memo
- [ ] Implement createBatchMutation with audit
- [ ] Implement updateBatchMutation with audit
- [ ] Implement toggleBatchStatusMutation with audit
- [ ] Add Create/Edit batch modal/screen
- [ ] Add analytics tracking (trackScreenView, trackAction)
- [ ] Wrap with BaseScreen
- [ ] Add pull-to-refresh

**Acceptance Checklist:**
- [ ] Real Supabase data (no mock arrays)
- [ ] Data contract defined and locked
- [ ] RBAC check at screen entry
- [ ] BaseScreen wrapper with all states
- [ ] Confirmation dialogs for activate/deactivate
- [ ] Audit logging for all mutations
- [ ] All buttons have accessibilityLabel
- [ ] Components memoized (React.memo, useMemo)
- [ ] Analytics events tracked
- [ ] Safe navigation used
- [ ] TypeScript errors: 0
- [ ] ESLint warnings: 0
- [ ] Tested on real device
- [ ] No console errors
- [ ] Dark mode compatible
- [ ] Theme colors used (no hardcoded hex)
- [ ] Performance checked (queries cached with staleTime)

---

## Create/Edit Batch Form Fields

**Form Fields:**
```typescript
interface BatchFormData {
  name: string;                  // Required: e.g., "Grade 10 Science A"
  grade_level: string;           // Required: e.g., "10", "11", "12"
  section: string;               // Optional: e.g., "A", "B", "Science", "Commerce"
  academic_year: string;         // Optional: e.g., "2024-2025"
  start_date: string;            // Optional: ISO date
  end_date: string;              // Optional: ISO date
  max_students: number;          // Optional: e.g., 40, 50
}
```

**Validation:**
- name: Required, min 3 characters
- grade_level: Required
- section: Optional
- academic_year: Optional, format "YYYY-YYYY"
- max_students: Optional, must be > 0

---

## Testing Plan

**Manual Tests:**
1. Load screen with real batches from Supabase
2. Search batches by name
3. Filter by academic year
4. Filter by grade level
5. Filter by status (active/inactive)
6. Create new batch → confirmation → success
7. Edit batch → confirmation → success
8. Deactivate batch → confirmation → success
9. Activate batch → confirmation → success
10. Pull-to-refresh → list updates
11. RBAC gate → redirects if no permission
12. Empty state → shows when no batches found
13. Loading state → shows while fetching
14. Error state → shows on network error

---

## Success Criteria

**Phase 2b is complete when:**
1. OrganizationManagementScreenV2.tsx exists with real Supabase data
2. All acceptance checklist items pass
3. Tested on real device with 0 errors
4. Screen performs well (< 2s load, smooth scrolling)
5. All mutations work with audit logging
6. RBAC gate prevents unauthorized access
7. Analytics tracking works
8. TypeScript and ESLint show 0 errors

---

**Next Steps:**
1. Implement OrganizationManagementScreenV2.tsx
2. Test thoroughly
3. Apply acceptance checklist
4. Document Phase 2b completion
