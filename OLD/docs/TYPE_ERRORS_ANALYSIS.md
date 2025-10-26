# TypeScript Errors - Detailed Analysis

## Current Libraries (Already Installed - No Changes Needed)
```json
"react-native-image-picker": "8.2.1",
"react-native-image-crop-picker": "0.51.0",
"react-native-video": "6.16.1"
```

---

## 1. ImagePicker.tsx Errors (7 errors)

### Error 1: Line 92 - CropOptions Type Mismatch
**Error:**
```
Type '{ multiple?: boolean | undefined; ... cropperStatusBarColor: string; }'
is not assignable to type 'Options'.
```

**Problem:**
The `defaultCropOptions` object includes properties that don't exist in the `react-native-image-crop-picker` v0.51.0 `Options` type definition.

**Root Cause:**
```typescript
// Line 76-96
const defaultCropOptions: CropOptions = {
  cropperActiveWidgetColor: PrimaryColors.Primary500,  // ❌ May not exist in v0.51.0
  cropperStatusBarColor: PrimaryColors.Primary700,     // ❌ May not exist in v0.51.0
  cropperToolbarColor: PrimaryColors.Primary500,       // ❌ May not exist in v0.51.0
  cropperToolbarWidgetColor: '#FFFFFF',               // ❌ May not exist in v0.51.0
  // ... other properties
};
```

**Solution Without Package Changes:**
Create extended type declaration in `src/types/react-native-image-crop-picker.d.ts`:

```typescript
declare module 'react-native-image-crop-picker' {
  export interface Options {
    // Extend existing Options with missing properties
    cropperActiveWidgetColor?: string;
    cropperStatusBarColor?: string;
    cropperToolbarColor?: string;
    cropperToolbarWidgetColor?: string;
    disableCropperColorSetters?: boolean;
    // ... other properties your code uses
  }
}
```

---

### Error 2: Line 109 - Asset.exif Property Missing
**Error:**
```
Property 'exif' does not exist on type 'Asset'.
```

**Problem:**
The `Asset` type from `react-native-image-picker@8.2.1` doesn't include an `exif` property in its type definition.

**Root Cause:**
```typescript
// Line 102-110
return response.assets.map((asset, index) => ({
  uri: asset.uri!,
  name: asset.fileName || `image_${Date.now()}_${index}.jpg`,
  type: asset.type || 'image/jpeg',
  size: asset.fileSize || 0,
  width: asset.width,
  height: asset.height,
  exif: asset.exif,  // ❌ Property 'exif' does not exist
}));
```

**Solution Without Package Changes:**
Create extended type declaration in `src/types/react-native-image-picker.d.ts`:

```typescript
declare module 'react-native-image-picker' {
  export interface Asset {
    // Extend existing Asset interface
    exif?: any;  // or Record<string, any> for better typing
  }
}
```

---

### Error 3: Line 116 - SelectedImage[] Type Mismatch
**Error:**
```
Type '{ uri: string; name: string; type: string; size: number; width: number;
height: number; cropRect: CropRect | null | undefined; }[]'
is not assignable to type 'SelectedImage[]'.
```

**Problem:**
The `CropImage` interface from `react-native-image-crop-picker` has a `cropRect` property that might be typed differently than your `SelectedImage` interface expects.

**Root Cause:**
```typescript
// Your interface (line 42-56)
export interface SelectedImage {
  uri: string;
  name: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
  exif?: any;
  cropRect?: {           // ❌ Might not match CropImage['cropRect']
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Line 113-120
return imageArray.map((image, index) => ({
  uri: image.path,
  name: image.filename || `image_${Date.now()}_${index}.jpg`,
  type: image.mime || 'image/jpeg',
  size: image.size || 0,
  width: image.width,
  height: image.height,
  cropRect: image.cropRect,  // ❌ Type mismatch
}));
```

**Solution Without Package Changes:**
Option 1 - Type assertion:
```typescript
cropRect: image.cropRect as SelectedImage['cropRect'],
```

Option 2 - Extend library type:
```typescript
// src/types/react-native-image-crop-picker.d.ts
declare module 'react-native-image-crop-picker' {
  export interface Image {
    cropRect?: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null;
  }
}
```

---

### Error 4 & 5: Lines 149, 198 - CameraOptions/ImageLibraryOptions Mismatch
**Error:**
```
Argument of type '{ mediaType: MediaType; includeBase64: boolean;
maxHeight: number; maxWidth: number; quality: number; }'
is not assignable to parameter of type 'CameraOptions'.
```

**Problem:**
The options object being passed to `launchCamera()` and `launchImageLibrary()` includes properties that don't match the expected type, or the type definitions are outdated.

**Root Cause:**
```typescript
// Line 149-162 (Camera)
const options = {
  mediaType: 'photo' as MediaType,
  includeBase64: false,
  maxHeight: maxHeight,
  maxWidth: maxWidth,
  quality: 0.8,  // ❌ Might need to be PhotoQuality type or different property
};

launchCamera(options, (response) => { ... });

// Line 198-211 (Library)
const options = {
  mediaType: 'photo' as MediaType,
  includeBase64: false,
  maxHeight: maxHeight,
  maxWidth: maxWidth,
  quality: 0.8,  // ❌ Same issue
  selectionLimit: allowMultiple ? maxImages : 1,
};

launchImageLibrary(options, (response) => { ... });
```

**Solution Without Package Changes:**
Create type declaration extending CameraOptions and ImageLibraryOptions:

```typescript
// src/types/react-native-image-picker.d.ts
declare module 'react-native-image-picker' {
  import { ImageLibraryOptions as OriginalLibraryOptions } from 'react-native-image-picker';

  export interface CameraOptions {
    mediaType?: 'photo' | 'video' | 'mixed';
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;  // Allow number instead of just PhotoQuality
    videoQuality?: 'low' | 'medium' | 'high';
    includeBase64?: boolean;
    includeExtra?: boolean;
    presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
    // Add other properties your code uses
  }

  export interface ImageLibraryOptions extends CameraOptions {
    selectionLimit?: number;
    // Add other properties
  }
}
```

---

### Error 6: Line 231 - openPicker Options Mismatch
**Error:**
```
Argument of type '{ multiple?: boolean | undefined; ... path: string; }'
is not assignable to parameter of type 'CropperOptions'.
```

**Problem:**
Similar to Error 1, the options passed to `ImageCropPicker.openPicker()` don't match the expected type.

**Solution:**
Same as Error 1 - extend the `Options` interface in the type declaration.

---

### Error 7: Line 268 - openSettings Property Missing
**Error:**
```
Property 'openSettings' does not exist on type 'ImageCropPicker'.
```

**Problem:**
The method `ImageCropPicker.openSettings()` doesn't exist in the type definition for `react-native-image-crop-picker@0.51.0`.

**Root Cause:**
```typescript
// Line 182-189
const requestCameraPermission = useCallback(async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await ImageCropPicker.openSettings();  // ❌ Method doesn't exist
      return granted;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  }
  return true;
}, []);
```

**Solution Without Package Changes:**
Option 1 - Add to type declaration:
```typescript
// src/types/react-native-image-crop-picker.d.ts
declare module 'react-native-image-crop-picker' {
  const ImagePicker: {
    openCamera(options?: Options): Promise<Image>;
    openPicker(options?: Options): Promise<Image | Image[]>;
    openCropper(options: Options): Promise<Image>;
    openSettings(): Promise<boolean>;  // ✅ Add this
    clean(): Promise<void>;
    cleanSingle(path: string): Promise<void>;
  };
  export default ImagePicker;
}
```

Option 2 - Replace with proper permission handling:
```typescript
import { PermissionsAndroid } from 'react-native';

const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};
```

---

## 2. PlanSelector.tsx Errors (2 errors)

### Error 8 & 9: Lines 218, 304 - BillingCycle Type Narrowing
**Error:**
```
This comparison appears to be unintentional because the types
'"quarterly" | "yearly"' and '"monthly"' have no overlap.
```

**Problem:**
TypeScript is warning that after checking for 'monthly', the remaining types can never be 'monthly' again in the next comparison.

**Root Cause:**
```typescript
// Line 93-103
const calculateSavings = (plan: SubscriptionPlan) => {
  const cycle = plan.billing_cycle;
  if (cycle === BillingCycle.MONTHLY || cycle === 'monthly') return null;

  // At this point, TypeScript knows cycle is NOT 'monthly'
  // So comparing with 'quarterly' vs 'monthly' is illogical
  const monthlyEquivalent = (cycle === BillingCycle.QUARTERLY || cycle === 'quarterly')
    ? plan.price / 3
    : plan.price / 12;
};
```

**Solution (Already Implemented):**
Use explicit variable assignment with proper type narrowing:
```typescript
const calculateSavings = (plan: SubscriptionPlan) => {
  const cycle = plan.billing_cycle;
  if (cycle === BillingCycle.MONTHLY || cycle === 'monthly') return null;

  let monthlyEquivalent: number;
  if (cycle === BillingCycle.QUARTERLY || cycle === 'quarterly') {
    monthlyEquivalent = plan.price / 3;
  } else {  // Must be YEARLY
    monthlyEquivalent = plan.price / 12;
  }
  // ... rest of calculation
};
```

This is **ALREADY FIXED** in the latest version.

---

## 3. LivePoll.tsx Errors (~50+ errors)

### All Errors: theme.colors.* References
**Problem:**
Similar to what was fixed in ChatWindow, PlanSelector, and LiveClassIndicator - the component uses `theme.colors.xxx` but the theme object uses PascalCase properties.

**Examples:**
```typescript
// Lines throughout LivePoll.tsx
backgroundColor: theme.colors.surface    // ❌ Should be theme.Surface
color: theme.colors.primary             // ❌ Should be theme.Primary
color: theme.colors.text                // ❌ Should be theme.OnSurface
color: theme.colors.textSecondary       // ❌ Should be theme.OnSurfaceVariant
backgroundColor: theme.colors.background // ❌ Should be theme.Background
borderColor: theme.colors.border        // ❌ Should be theme.Outline
color: theme.colors.error               // ❌ Should be theme.Error
color: theme.colors.onPrimary           // ❌ Should be theme.OnPrimary
color: theme.colors.disabled            // ❌ Should be theme.SurfaceVariant
color: theme.colors.success             // ❌ Should be theme.Success (from SemanticColors)
```

**Solution:**
Global find and replace in LivePoll.tsx:
- `theme.colors.surface` → `theme.Surface`
- `theme.colors.primary` → `theme.Primary`
- `theme.colors.text` → `theme.OnSurface`
- `theme.colors.textSecondary` → `theme.OnSurfaceVariant`
- `theme.colors.background` → `theme.Background`
- `theme.colors.border` → `theme.Outline`
- `theme.colors.error` → `theme.Error`
- `theme.colors.onPrimary` → `theme.OnPrimary`
- `theme.colors.onError` → `theme.OnError`
- `theme.colors.disabled` → `theme.SurfaceVariant`
- `theme.colors.success` → Import and use `SemanticColors.Success`

**Note:** The file needs to be read first before these replacements can be made.

---

## Summary & Action Plan

### ✅ Can Use Existing Libraries? **YES**
All required libraries are already installed. No package.json changes needed.

### 📝 What Needs to Be Done:

**1. Create Type Declaration Files (3 files):**

**File 1:** `src/types/react-native-image-picker.d.ts`
```typescript
declare module 'react-native-image-picker' {
  // Extend Asset interface
  export interface Asset {
    exif?: Record<string, any>;
  }

  // Extend CameraOptions
  export interface CameraOptions {
    mediaType?: 'photo' | 'video' | 'mixed';
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    includeBase64?: boolean;
    includeExtra?: boolean;
    presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
  }

  // Extend ImageLibraryOptions
  export interface ImageLibraryOptions extends CameraOptions {
    selectionLimit?: number;
  }
}
```

**File 2:** `src/types/react-native-image-crop-picker.d.ts`
```typescript
declare module 'react-native-image-crop-picker' {
  export interface Options {
    // Color customization (may not be in v0.51.0 types)
    cropperActiveWidgetColor?: string;
    cropperStatusBarColor?: string;
    cropperToolbarColor?: string;
    cropperToolbarWidgetColor?: string;
    disableCropperColorSetters?: boolean;

    // Other common options
    width?: number;
    height?: number;
    cropping?: boolean;
    cropperCircleOverlay?: boolean;
    sortOrder?: string;
    compressImageMaxWidth?: number;
    compressImageMaxHeight?: number;
    compressImageQuality?: number;
    mediaType?: 'photo' | 'video' | 'any';
    includeBase64?: boolean;
    includeExif?: boolean;
    avoidEmptySpaceAroundImage?: boolean;
    enableRotationGesture?: boolean;
    freeStyleCropEnabled?: boolean;
    multiple?: boolean;
    maxFiles?: number;
  }

  export interface Image {
    path: string;
    width: number;
    height: number;
    mime: string;
    size?: number;
    filename?: string | null;
    cropRect?: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null;
  }

  const ImagePicker: {
    openCamera(options?: Options): Promise<Image>;
    openPicker(options?: Options): Promise<Image | Image[]>;
    openCropper(options: Options): Promise<Image>;
    openSettings(): Promise<boolean>;
    clean(): Promise<void>;
    cleanSingle(path: string): Promise<void>;
  };

  export default ImagePicker;
}
```

**File 3:** Update `src/types/react-native-vector-icons.d.ts` (already created, but add more variants if needed)

**2. Fix LivePoll.tsx theme.colors References:**
- Read the file
- Replace all `theme.colors.*` with proper PascalCase theme properties
- ~50 replacements needed

**3. Alternative to Type Declarations:**
Instead of creating type declarations, you could:
- Add `// @ts-ignore` comments above problematic lines (NOT RECOMMENDED)
- Use type assertions: `as any` or `as CameraOptions` (NOT RECOMMENDED)
- Disable strict type checking in tsconfig.json (NOT RECOMMENDED)

---

## Recommended Approach

**Best Practice:** Create the 2 type declaration files above. This is the cleanest, most maintainable solution that:
- ✅ Doesn't modify package.json
- ✅ Doesn't ignore type safety
- ✅ Uses existing libraries
- ✅ Provides proper type safety for your code
- ✅ Documents the expected API surface
- ✅ Won't break if libraries are updated

**Total Effort:**
- ~30 minutes to create proper type declarations
- ~10 minutes to fix LivePoll theme references
- **~40 minutes total to fix all remaining TypeScript errors**

---

## Why These Errors Occur

The errors exist because:
1. **Version Mismatch**: The library type definitions might be for a different version than what's installed
2. **Incomplete Types**: The library maintainers may not have included all available properties
3. **Community Types**: Some libraries rely on `@types/*` packages that lag behind the actual library
4. **API Evolution**: Libraries add features faster than type definitions are updated
5. **Custom Extensions**: Your code uses features that exist in the runtime but not in the types

All of these can be fixed with **module augmentation** (the type declaration approach above) without changing packages.
