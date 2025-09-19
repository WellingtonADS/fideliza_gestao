param(
  [string]$PackageName = 'com.fideliza_gestao'
)

$ErrorActionPreference = 'Stop'

function Get-AppPid {
  $appProcessId = (adb shell pidof $PackageName 2>$null).Trim()
  return $appProcessId
}

if (-not (Get-AppPid)) {
  Write-Host "[capture-release-once] PID não encontrado. Abra o app no dispositivo..." -ForegroundColor Yellow
  for ($i=0; $i -lt 10; $i++) {
    Start-Sleep -Seconds 1
    $p = Get-AppPid
    if ($p) { break }
  }
}

$appPid = Get-AppPid
if (-not $appPid) {
  throw "Não foi possível obter o PID do app. Certifique-se de que o app está aberto."
}

Write-Host "[capture-release-once] Capturando logs do PID $appPid" -ForegroundColor Cyan
adb logcat -c | Out-Null

$ts = Get-Date -Format 'yyyyMMdd_HHmmss'
$outFile = Join-Path $PSScriptRoot "release_startup_$ts.txt"

adb logcat -v time --pid $appPid ReactNative:V ReactNativeJS:V AndroidRuntime:E RNCamera:V *:S -d | Tee-Object -FilePath $outFile | Out-Null

Write-Host "[capture-release-once] Logs salvos em: $outFile" -ForegroundColor Green
