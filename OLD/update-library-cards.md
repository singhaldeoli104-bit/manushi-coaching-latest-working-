# Updates to NewStudyLibraryScreen.tsx

## Changes Needed:

### 1. Update StudyMaterial Interface (Line 29-43):

Replace:
```typescript
interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  type: 'PDF' | 'VIDEO' | 'DOC' | 'QUIZ';
  file_size: string;
  tags: string[];
  rating: number;  // REMOVE THIS
  views: string;
  isBookmarked: boolean;
  iconColor: string;
  iconBgColor: string;
  icon: string;
  tagColor: string;
}
```

With:
```typescript
interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  type: 'PDF' | 'VIDEO' | 'DOC' | 'QUIZ';
  file_size: string;
  tags: string[];
  views: string;
  downloads: string;  // ADD THIS
  uploadedAt: string;  // ADD THIS
  duration?: string;  // ADD THIS (for videos)
  isBookmarked: boolean;
  iconColor: string;
  iconBgColor: string;
  icon: string;
  tagColor: string;
}
```

### 2. Update Data Mapping (around line 93-104):

Add these fields to the return statement:
```typescript
downloads: m.downloads_count >= 1000 ? `${(m.downloads_count / 1000).toFixed(1)}k` : (m.downloads_count || 0).toString(),
uploadedAt: (() => {
  const date = new Date(m.uploaded_at || m.created_at);
  const diffDays = Math.floor((new Date().getTime() - date.getTime()) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
})(),
duration: m.duration_seconds ? `${Math.floor(m.duration_seconds / 60)}:${(m.duration_seconds % 60).toString().padStart(2, '0')}` : undefined,
```

Remove this line:
```typescript
rating: parseFloat(m.rating) || 4.5,  // REMOVE THIS
```

### 3. Update Card Rendering (around line 515-522):

Replace the rating section:
```typescript
{/* Rating and Views */}
<View style={styles.ratingRow}>
  <View style={styles.starsContainer}>
    {renderStars(material.rating)}
  </View>
  <T variant="caption" style={styles.views}>{material.views}</T>
</View>
```

With this new stats section:
```typescript
{/* Stats: Views, Downloads, Upload Date */}
<View style={styles.statsRow}>
  <T variant="caption" style={styles.statItem}>👁 {material.views}</T>
  <T variant="caption" style={styles.statItem}>📥 {material.downloads}</T>
</View>
<View style={styles.dateRow}>
  <T variant="caption" style={styles.uploadDate}>📅 {material.uploadedAt}</T>
  {material.duration && (
    <T variant="caption" style={styles.duration}>⏱ {material.duration}</T>
  )}
</View>
```

### 4. Update Styles (around line 740-780):

Replace:
```typescript
ratingRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 8,
},
starsContainer: {
  flexDirection: 'row',
},
views: {
  fontSize: 12,
  color: '#6B7280',
},
```

With:
```typescript
statsRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  marginTop: 8,
},
statItem: {
  fontSize: 11,
  color: '#6B7280',
},
dateRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 4,
},
uploadDate: {
  fontSize: 11,
  color: '#9CA3AF',
},
duration: {
  fontSize: 11,
  color: '#10B981',
  fontWeight: '600',
},
```

## Summary of Changes:
- ✅ Removed rating/stars
- ✅ Added download count
- ✅ Added upload date ("2d ago", "1w ago")
- ✅ Added duration for videos ("15:30")
