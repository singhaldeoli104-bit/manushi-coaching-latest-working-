$content = Get-Content ui_screens.md -Raw -Encoding UTF8

# Fix touch targets
$content = $content -replace 'chip height 36 dp', 'chip height **48dp** (`height.sm`) - WCAG 2.1 AAA compliant'
$content = $content -replace 'chip height 40 dp', 'chip height **48dp** (`height.sm`)'
$content = $content -replace 'chip height 44 dp', 'chip height **48dp** (`height.sm`)'

# Fix accessibility requirement
$content = $content -replace '44dp touch targets', '**48dp minimum touch targets** (WCAG 2.1 AAA)'

# Save
Set-Content ui_screens.md $content -Encoding UTF8 -NoNewline

Write-Host "Fixes applied successfully!"
Write-Host ""
Write-Host "Verification:"

# Verify
$verify = Get-Content ui_screens.md -Raw -Encoding UTF8
$c36 = ([regex]::Matches($verify, "chip height 36 dp")).Count
$c40 = ([regex]::Matches($verify, "chip height 40 dp")).Count
$c44 = ([regex]::Matches($verify, "chip height 44 dp")).Count
$c48 = ([regex]::Matches($verify, "\*\*48dp\*\*")).Count

Write-Host "  Remaining 36dp violations: $c36"
Write-Host "  Remaining 40dp violations: $c40"
Write-Host "  Remaining 44dp violations: $c44"
Write-Host "  Fixed to 48dp: $c48"

if ($c36 -eq 0 -and $c40 -eq 0 -and $c44 -eq 0 -and $c48 -gt 0) {
    Write-Host ""
    Write-Host "SUCCESS! All touch target violations fixed!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "WARNING: Some violations may remain" -ForegroundColor Yellow
}
