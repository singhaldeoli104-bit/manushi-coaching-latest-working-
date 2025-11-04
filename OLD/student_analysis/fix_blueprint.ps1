# Fix ui_screens.md blueprint with critical UX updates

$filePath = "ui_screens.md"

Write-Host "Reading $filePath..." -ForegroundColor Cyan
$content = Get-Content $filePath -Raw

Write-Host "Applying touch target fixes..." -ForegroundColor Yellow

# Fix 1: 36dp chips → 48dp
$content = $content -replace 'chip height 36 dp', 'chip height **48dp** (`height.sm`) - WCAG 2.1 AAA compliant'

# Fix 2: 40dp chips → 48dp
$content = $content -replace 'chip height 40 dp', 'chip height **48dp** (`height.sm`)'

# Fix 3: 44dp chips → 48dp
$content = $content -replace 'chip height 44 dp', 'chip height **48dp** (`height.sm`)'

# Fix 4: Update accessibility requirement
$content = $content -replace '44dp touch targets', '**48dp minimum touch targets** (WCAG 2.1 AAA)'

Write-Host "Saving updated file..." -ForegroundColor Green
Set-Content $filePath $content -NoNewline

Write-Host "`n✅ Blueprint updated successfully!" -ForegroundColor Green
Write-Host "`nChanges applied:" -ForegroundColor Cyan
Write-Host "- Touch targets: 36dp/40dp/44dp → 48dp (WCAG 2.1 AAA)"
Write-Host "- Accessibility checklist updated"

# Verification
Write-Host "`nVerification:" -ForegroundColor Cyan
$violations = (Select-String -Path $filePath -Pattern "chip height (36|40|4[0-4]) dp").Count
Write-Host "Remaining violations: $violations (should be 0)"

if ($violations -eq 0) {
    Write-Host "✅ All touch target violations fixed!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Some violations remain - manual review needed" -ForegroundColor Yellow
}
