Param(
  [string]$ApkPath = "d:\fideliza_gestao\android\app\build\outputs\apk\debug\app-debug.apk"
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $ApkPath)) {
  Write-Error "APK não encontrado em: $ApkPath. Gere com: Set-Location d:\fideliza_gestao\android; .\\gradlew.bat assembleDebug"
}

$adb = Join-Path $env:LOCALAPPDATA 'Android\\Sdk\\platform-tools\\adb.exe'
if (-not (Test-Path $adb)) {
  Write-Error "adb não encontrado em: $adb. Abra o Android SDK Manager e instale Platform Tools."
}

Write-Host "Verificando dispositivos ADB..."
& $adb devices

# Aguarda um dispositivo por até 60s
$sw = [Diagnostics.Stopwatch]::StartNew()
$deviceOnline = $false
while ($sw.Elapsed.TotalSeconds -lt 60) {
  $list = & $adb devices | Select-String 'device$' | Where-Object { $_ -notmatch 'List of devices' }
  if ($list) { $deviceOnline = $true; break }
  Start-Sleep -Seconds 2
}

if (-not $deviceOnline) {
  Write-Error "Nenhum dispositivo online detectado pelo ADB. Inicie um emulador (Android Studio) ou conecte um aparelho físico."
}

Write-Host "Instalando APK: $ApkPath"
& $adb install -r $ApkPath

Write-Host "Concluído. Se necessário, abra o app manualmente no dispositivo."
