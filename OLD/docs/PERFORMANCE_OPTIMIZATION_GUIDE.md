# Performance Optimization Guide for StudyLibraryScreen

## ✅ Completed Optimizations

1. **Memoized ResourceCard Component** (lines 35-127)
   - Wrapped in `React.memo()` with custom comparison
   - Only re-renders when resource data actually changes
   - Prevents unnecessary renders during scroll

## 🔄 Required Changes

### 1. Convert callbacks to useCallback (in StudyLibraryScreen component)

```typescript
// Memoize callbacks to prevent re-creating on every render
const handleToggleBookmark = useCallback(async (resourceId: string) => {
  // ... existing toggleBookmark logic
}, [resources]);

const handleDownload = useCallback(async (resourceId: string) => {
  // ... existing downloadResource logic
}, [resources]);

const handleOpenResource = useCallback((resource: Resource) => {
  // ... existing openResource logic
}, []);

// Memoize helper functions
const getResourceTypeIcon = useCallback((type: string) => {
  // ... existing getResourceTypeIcon logic
}, []);

const getResourceTypeColor = useCallback((type: string) => {
  // ... existing getResourceTypeColor logic
}, [theme]);
```

### 2. Replace ScrollView with Animated.FlatList

**Find this code** (around line 750):
```typescript
<RNAnimated.ScrollView
  style={styles.content}
  contentContainerStyle={styles.contentContainer}
  showsVerticalScrollIndicator={false}
  onScroll={onScroll}
  scrollEventThrottle={scrollEventThrottle}
>
  {filteredResources.length > 0 ? (
    <View style={styles.resourcesContainer}>
      {filteredResources.map(renderResourceGrid)}
    </View>
  ) : (
    <View style={styles.emptyState}>
      ...
    </View>
  )}
</RNAnimated.ScrollView>
```

**Replace with**:
```typescript
<RNAnimated.FlatList
  data={filteredResources}
  renderItem={({ item }) => (
    <ResourceCard
      resource={item}
      onPress={handleOpenResource}
      onToggleBookmark={handleToggleBookmark}
      onDownload={handleDownload}
      getTypeIcon={getResourceTypeIcon}
      getTypeColor={getResourceTypeColor}
      theme={theme}
    />
  )}
  keyExtractor={(item) => item.id}
  numColumns={2}
  columnWrapperStyle={styles.flatListRow}
  contentContainerStyle={styles.contentContainer}
  ListHeaderComponent={headerComponent}
  ListEmptyComponent={() => (
    <View style={styles.emptyState}>
      <Icon name="folder-open" size={64} color={theme.Outline} />
      <Text style={[styles.emptyTitle, { color: theme.OnSurface }]}>
        No Resources Found
      </Text>
      <Text style={[styles.emptyDescription, { color: theme.OnSurfaceVariant }]}>
        Try adjusting your search or filter criteria
      </Text>
    </View>
  )}
  onScroll={onScroll}
  scrollEventThrottle={scrollEventThrottle}
  showsVerticalScrollIndicator={false}
  removeClippedSubviews={true}
  maxToRenderPerBatch={6}
  updateCellsBatchingPeriod={50}
  initialNumToRender={6}
  windowSize={5}
/>
```

### 3. Add FlatList styles

**Add to styles object**:
```typescript
flatListRow: {
  justifyContent: 'space-between',
  paddingHorizontal: Spacing.MD,
},
```

### 4. Remove old renderResourceGrid function

Delete the entire `renderResourceGrid` function (it's replaced by ResourceCard component)

### 5. Update collapsible header integration

**Change this**:
```typescript
return (
  <SafeAreaView style={[styles.container, { backgroundColor: theme.Background }]}>
    <StatusBar backgroundColor={theme.Primary} barStyle="light-content" />
    {/* Collapsible Header - in normal flow */}
    {headerComponent}
    {/* Resources Grid/List with scroll handlers */}
    <RNAnimated.ScrollView ...>
```

**To this**:
```typescript
return (
  <SafeAreaView style={[styles.container, { backgroundColor: theme.Background }]}>
    <StatusBar backgroundColor={theme.Primary} barStyle="light-content" />
    {/* FlatList with header as ListHeaderComponent */}
    <RNAnimated.FlatList ...>
```

## 📊 Performance Benefits

1. **Virtualization**: Only renders visible items + small buffer
2. **Memoization**: Prevents unnecessary re-renders of list items
3. **Stable callbacks**: useCallback prevents function recreation
4. **removeClippedSubviews**: Removes off-screen views from native hierarchy
5. **Optimized batch rendering**: maxToRenderPerBatch=6, windowSize=5

## 🎯 Expected Results

- **60 FPS** smooth scrolling
- **Lower memory** usage (virtualization)
- **Faster initial render** (initialNumToRender=6)
- **No re-renders** when scrolling (memoization)
- **Native performance** for list rendering

## 🔧 Testing Commands

```bash
# Build in release mode to test true performance
cd android && ./gradlew assembleRelease

# Profile with Flipper
npx react-native run-android --variant=release

# Check for dropped frames
# Enable "Show Performance Monitor" in Dev Menu
```

## 📝 Next Steps

1. Apply same pattern to other student screens (20 total)
2. Consider FlashList for even better performance
3. Add React DevTools Profiler to measure improvements
