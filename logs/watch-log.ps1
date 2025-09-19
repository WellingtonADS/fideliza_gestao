param(
  [string]$Package = 'com.fideliza_gestao'
)

$ErrorActionPreference = 'Stop'

# Write our own PID to a file so we can stop this watcher later
$pidFile = Join-Path $PSScriptRoot 'watch-log.pid'
try { $PID | Out-File -FilePath $pidFile -Encoding ascii -Force } catch {}

function Get-AppPid {
  param([string]$pkg)
  try {
    $pidStr = adb shell pidof $pkg 2>$null
    if (-not $pidStr) { return $null }
    return $pidStr.Trim()
  } catch { return $null }
}

function Start-LogLoop {
  param([string]$appPid)
  $ts = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
  $current = Join-Path $PSScriptRoot 'logcat_fideliza_current.txt'
  $archive = Join-Path $PSScriptRoot ("logcat_fideliza_{0}.txt" -f $ts)
  if (Test-Path $current) { Remove-Item -Force $current }
  try { adb logcat -c | Out-Null } catch {}
  "[INFO] Starting logcat for PID $appPid at $ts" | Tee-Object -FilePath $current -Append | Out-Null
  & adb logcat -v time --pid $appPid *:V 2>&1 |
    Tee-Object -FilePath $current -Append |
    Tee-Object -FilePath $archive -Append |
    ForEach-Object { $_ } | Out-Null
}

while ($true) {
  try {
    $appPid = Get-AppPid -pkg $Package
    if (-not $appPid) { Start-Sleep -Seconds 2; continue }
    Start-LogLoop -appPid $appPid
    Start-Sleep -Seconds 2
  } catch {
    $errFile = Join-Path $PSScriptRoot 'logcat_errors.txt'
    "[ERR] $($_.Exception.Message)" | Tee-Object -FilePath $errFile -Append | Out-Null
    Start-Sleep -Seconds 2
  }
}
