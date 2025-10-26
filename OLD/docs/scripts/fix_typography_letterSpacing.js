const fs = require('fs');

// Read typography file
const filePath = 'src/theme/typography.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Default letterSpacing values for MD3 (Material Design 3)
const letterSpacingDefaults = {
    displayLarge: -0.25,
    displayMedium: 0,
    displaySmall: 0,
    headlineLarge: 0,
    headlineMedium: 0,
    headlineSmall: 0,
    titleLarge: 0,
    titleMedium: 0.15,
    titleSmall: 0.1,
    bodyLarge: 0.5,
    bodyMedium: 0.25,
    bodySmall: 0.4,
    labelLarge: 0.1,
    labelMedium: 0.5,
    labelSmall: 0.5,
};

// For each typography style, add letterSpacing if missing
Object.keys(letterSpacingDefaults).forEach(styleName => {
    const regex = new RegExp(`(${styleName}:\\s*{[^}]*fontFamily: '[^']*',)(\n\\s*})`, 'g');

    content = content.replace(regex, (match, before, after) => {
        // Check if letterSpacing already exists
        if (match.includes('letterSpacing')) {
            return match;
        }
        // Add letterSpacing before closing brace
        return `${before}\n    letterSpacing: ${letterSpacingDefaults[styleName]},${after}`;
    });
});

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Added letterSpacing to typography styles');
