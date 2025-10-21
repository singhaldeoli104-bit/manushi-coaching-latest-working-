#!/usr/bin/env python3
import os
import re
from pathlib import Path

# Mapping of old theme.colors patterns to new theme patterns
replacements = [
    (r'theme\.colors\.onSurfaceVariant', 'theme.OnSurfaceVariant'),
    (r'theme\.colors\.textSecondary', 'theme.OnSurfaceVariant'),
    (r'theme\.colors\.text', 'theme.OnSurface'),
    (r'theme\.colors\.primary', 'theme.Primary'),
    (r'theme\.colors\.onSurface', 'theme.OnSurface'),
    (r'theme\.colors\.surface', 'theme.Surface'),
    (r'theme\.colors\.onPrimary', 'theme.OnPrimary'),
    (r'theme\.colors\.outline', 'theme.Outline'),
    (r'theme\.colors\.border', 'theme.Outline'),
    (r'theme\.colors\.onBackground', 'theme.OnBackground'),
    (r'theme\.colors\.surfaceVariant', 'theme.SurfaceVariant'),
    (r'theme\.colors\.background', 'theme.Background'),
    (r'theme\.colors\.onPrimaryContainer', 'theme.OnPrimaryContainer'),
    (r'theme\.colors\.primaryContainer', 'theme.PrimaryContainer'),
    (r'theme\.colors\.error', 'theme.Error'),
    (r'theme\.colors\.onErrorContainer', 'theme.OnErrorContainer'),
    (r'theme\.colors\.errorContainer', 'theme.ErrorContainer'),
    (r'theme\.colors\.onSecondaryContainer', 'theme.OnSecondaryContainer'),
    (r'theme\.colors\.secondaryContainer', 'theme.SecondaryContainer'),
    (r'theme\.colors\.onError', 'theme.OnError'),
    (r'theme\.colors\.outlineVariant', 'theme.OutlineVariant'),
    (r'theme\.colors\.onTertiaryContainer', 'theme.OnTertiaryContainer'),
    (r'theme\.colors\.success', 'theme.Success'),
    (r'theme\.colors\.secondary', 'theme.Secondary'),
    (r'theme\.colors\.tertiary', 'theme.Tertiary'),
    (r'theme\.colors\.tertiaryContainer', 'theme.TertiaryContainer'),
    (r'theme\.colors\.onSecondary', 'theme.OnSecondary'),
    (r'theme\.colors\.warning', 'theme.Warning'),
    (r'theme\.colors\.onTertiary', 'theme.OnTertiary'),
    (r'theme\.colors\.disabled', 'theme.OnSurface'),
]

def fix_file(file_path):
    """Fix theme.colors references in a single file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Apply all replacements
        for old_pattern, new_pattern in replacements:
            content = re.sub(old_pattern, new_pattern, content)

        # Only write if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Find and fix all TypeScript/TSX files with theme.colors references."""
    src_dir = Path('src')

    # Find all .ts and .tsx files
    files_to_fix = list(src_dir.rglob('*.ts')) + list(src_dir.rglob('*.tsx'))

    fixed_count = 0
    total_files = len(files_to_fix)

    print(f"Found {total_files} TypeScript files to check...")

    for file_path in files_to_fix:
        if fix_file(file_path):
            fixed_count += 1
            if fixed_count % 10 == 0:
                print(f"Fixed {fixed_count}/{total_files} files...")

    print(f"\n✅ Complete! Fixed {fixed_count} files out of {total_files} total files.")

if __name__ == '__main__':
    main()
