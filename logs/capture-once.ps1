param(
  [string]$Package = 'com.fideliza_gestao'
)

$ErrorActionPreference = 'Stop'

function Get-AppPid {
  param([string]$pkg)
  try {
    $pidStr = adb shell pidof $pkg 2>$null
    if (-not $pidStr) { return $null }
    return $pidStr.Trim()
  } catch { return $null }
}

$appPid = $null
for ($i=0; $i -lt 15; $i++) {
  $appPid = Get-AppPid -pkg $Package
  if ($appPid) { break }
  Start-Sleep -Seconds 1
}
if (-not $appPid) {
  Write-Output "[capture-once] PID not found. Abra o app e rode novamente."
  exit 1
}

$ts = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
$currentFile = Join-Path $PSScriptRoot ("session_{0}_{1}.txt" -f $Package, $ts)
Set-Content -Path (Join-Path $PSScriptRoot 'capture-once.current') -Value $currentFile -Encoding UTF8
"[capture-once] Capturing logcat for $Package (PID $appPid) at $ts" | Tee-Object -FilePath $currentFile -Append | Out-Null
try { adb logcat -c | Out-Null } catch {}
adb logcat -v time --pid $appPid *:V 2>&1 | Tee-Object -FilePath $currentFile -Append
