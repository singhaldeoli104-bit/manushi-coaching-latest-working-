# Animation Migration Script - react-native-animatable to react-native-reanimated
# This script automatically migrates all disabled files to use Reanimated

$files = @(
    "src/screens/auth/ForgotPasswordScreen.tsx.disabled",
    "src/screens/student/EnhancedAIStudyAssistantScreen.tsx.disabled",
    "src/screens/student/EnhancedLiveClassParticipationScreen.tsx.disabled",
    "src/screens/student/EnhancedScheduleScreen.tsx.disabled",
    "src/screens/student/StudyLibraryScreen.tsx.disabled",
    "src/screens/teacher/EnhancedAssignmentGradingScreen.tsx.disabled",
    "src/screens/teacher/QuestionBankManagementScreen.tsx.disabled",
    "src/screens/admin/UIUXEnhancementPolishScreen.tsx.disabled",
    "src/screens/admin/QualityAssuranceTestingScreen.tsx.disabled",
    "src/screens/admin/ProductionDeploymentLaunchScreen.tsx.disabled",
    "src/screens/admin/MobileOptimizationPWAScreen.tsx.disabled"
)

foreach ($file in $files) {
    Write-Host "Processing: $file"

    # Read file content
    $content = Get-Content $file -Raw

    # Step 1: Replace import statement
    $content = $content -replace "import \* as Animatable from 'react-native-animatable';", "import Animated, { FadeIn, FadeInUp, FadeInDown, FadeOut, SlideInUp, SlideInDown, ZoomIn, BounceIn } from 'react-native-reanimated';"

    # Step 2: Replace animation props with entering props
    # Handle duration + delay
    $content = $content -replace 'animation="fadeIn"\s+duration=\{(\d+)\}\s+delay=\{(\d+)\}', 'entering={FadeIn.duration($1).delay($2)}'
    $content = $content -replace 'animation="fadeInUp"\s+duration=\{(\d+)\}\s+delay=\{(\d+)\}', 'entering={FadeInUp.duration($1).delay($2)}'
    $content = $content -replace 'animation="fadeInDown"\s+duration=\{(\d+)\}\s+delay=\{(\d+)\}', 'entering={FadeInDown.duration($1).delay($2)}'

    # Handle duration only
    $content = $content -replace 'animation="fadeIn"\s+duration=\{(\d+)\}', 'entering={FadeIn.duration($1)}'
    $content = $content -replace 'animation="fadeInUp"\s+duration=\{(\d+)\}', 'entering={FadeInUp.duration($1)}'
    $content = $content -replace 'animation="fadeInDown"\s+duration=\{(\d+)\}', 'entering={FadeInDown.duration($1)}'
    $content = $content -replace 'animation="slideInUp"\s+duration=\{(\d+)\}', 'entering={SlideInUp.duration($1)}'
    $content = $content -replace 'animation="zoomIn"\s+duration=\{(\d+)\}', 'entering={ZoomIn.duration($1)}'

    # Handle delay only
    $content = $content -replace 'animation="fadeIn"\s+delay=\{([^}]+)\}', 'entering={FadeIn.delay($1)}'
    $content = $content -replace 'animation="fadeInUp"\s+delay=\{([^}]+)\}', 'entering={FadeInUp.delay($1)}'
    $content = $content -replace 'animation="fadeInDown"\s+delay=\{([^}]+)\}', 'entering={FadeInDown.delay($1)}'

    # Handle no props (just animation name)
    $content = $content -replace 'animation="fadeIn"(?!\s*(duration|delay))', 'entering={FadeIn}'
    $content = $content -replace 'animation="fadeInUp"(?!\s*(duration|delay))', 'entering={FadeInUp}'
    $content = $content -replace 'animation="fadeInDown"(?!\s*(duration|delay))', 'entering={FadeInDown}'
    $content = $content -replace 'animation="slideInUp"(?!\s*(duration|delay))', 'entering={SlideInUp}'
    $content = $content -replace 'animation="zoomIn"(?!\s*(duration|delay))', 'entering={ZoomIn}'

    # Step 3: Replace component names
    $content = $content -replace '<Animatable\.View', '<Animated.View'
    $content = $content -replace '</Animatable\.View>', '</Animated.View>'

    # Write back to file
    Set-Content -Path $file -Value $content -NoNewline

    # Rename file (remove .disabled extension)
    $newFile = $file -replace '\.disabled$', ''
    Move-Item -Path $file -Destination $newFile -Force

    Write-Host "[OK] Migrated: $newFile" -ForegroundColor Green
}

Write-Host ""
Write-Host "Migration complete! All files have been updated to use react-native-reanimated." -ForegroundColor Green
