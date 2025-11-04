param(
    [string[]]$Tabs = @("Home","Classes","Students","Analytics","More"),
    [int]$ScrollRepeats = 6,
    [string]$ScreenshotDir = "./screenshots"
)

$ErrorActionPreference = "Stop"
$adb = "adb"

Write-Host "Ensuring an Android device is connected..."
$state = (& $adb get-state 2>$null).Trim()
if ($state -ne "device") {
    throw "adb get-state returned '$state'. Connect and authorize a device before running this script."
}

if (-not (Test-Path $ScreenshotDir)) {
    Write-Host "Creating screenshot directory at $ScreenshotDir"
    New-Item -ItemType Directory -Path $ScreenshotDir | Out-Null
}

function Get-BoundsCenter {
    param([string]$Bounds)
    $pattern = '\[(\d+),(\d+)\]\[(\d+),(\d+)\]'
    $match = [regex]::Match($Bounds, $pattern)
    if (-not $match.Success) {
        throw "Could not parse bounds '$Bounds'"
    }
    $x1 = [int]$match.Groups[1].Value
    $y1 = [int]$match.Groups[2].Value
    $x2 = [int]$match.Groups[3].Value
    $y2 = [int]$match.Groups[4].Value
    return [pscustomobject]@{
        X = [int](($x1 + $x2) / 2)
        Y = [int](($y1 + $y2) / 2)
        X1 = $x1
        Y1 = $y1
        X2 = $x2
        Y2 = $y2
    }
}

$remoteDump = "/sdcard/automation_tabs.xml"
$localDump = Join-Path $env:TEMP "automation_tabs.xml"

Write-Host "Capturing initial UI dump..."
& $adb shell uiautomator dump $remoteDump | Out-Null
& $adb pull $remoteDump $localDump | Out-Null

$xml = [xml](Get-Content $localDump)

$tabCenters = @{}
foreach ($tab in $Tabs) {
    $node = $xml.SelectSingleNode("//node[@text='" + $tab + "']")
    if (-not $node) {
        throw "Could not find a tab with text '$tab' in the UI dump."
    }
    $tabCenters[$tab] = Get-BoundsCenter -Bounds $node.bounds
}

$scrollNode = $xml.SelectSingleNode("//node[@scrollable='true']")
if ($scrollNode) {
    $scrollBounds = Get-BoundsCenter -Bounds $scrollNode.bounds
    $scrollCenterX = $scrollBounds.X
    $startY = [Math]::Max($scrollBounds.Y2 - 150, $scrollBounds.Y1 + 200)
    $endY = [Math]::Min($scrollBounds.Y1 + 150, $scrollBounds.Y2 - 200)
    if ($startY -le $endY) {
        $startY = $scrollBounds.Y2 - 150
        $endY = $scrollBounds.Y1 + 150
    }
} else {
    Write-Warning "No scrollable view detected; using default swipe coordinates."
    $scrollCenterX = 540
    $startY = 1800
    $endY = 600
}

foreach ($tab in $Tabs) {
    $center = $tabCenters[$tab]
    $sanitized = ($tab -replace "[^A-Za-z0-9]", "_")
    if ([string]::IsNullOrWhiteSpace($sanitized)) { $sanitized = "tab" }

    Write-Host "Switching to tab '$tab' at ($($center.X), $($center.Y))"
    & $adb shell input tap $($center.X) $($center.Y)
    Start-Sleep -Milliseconds 1200

    if ($ScrollRepeats -gt 0) {
        Write-Host "Scrolling down $ScrollRepeats times on '$tab'"
        for ($i = 0; $i -lt $ScrollRepeats; $i++) {
            & $adb shell input swipe $scrollCenterX $startY $scrollCenterX $endY 500 | Out-Null
            Start-Sleep -Milliseconds 600
        }
    }

    $remoteShot = "/sdcard/${sanitized}_auto.png"
    $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $localShot = Join-Path $ScreenshotDir ("{0}_{1}.png" -f $sanitized, $timestamp)

    Write-Host "Capturing screenshot for '$tab'"
    & $adb shell screencap -p $remoteShot | Out-Null
    & $adb pull $remoteShot $localShot | Out-Null
    & $adb shell rm $remoteShot | Out-Null
    Write-Host "Saved screenshot to $localShot"

    if ($ScrollRepeats -gt 0) {
        Write-Host "Scrolling back to top on '$tab'"
        for ($i = 0; $i -lt $ScrollRepeats; $i++) {
            & $adb shell input swipe $scrollCenterX $endY $scrollCenterX $startY 500 | Out-Null
            Start-Sleep -Milliseconds 400
        }
    }
}

Write-Host "All done. Screenshots are stored in '$(Resolve-Path $ScreenshotDir)'."
