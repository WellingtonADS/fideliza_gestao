# Instala e inicia o APK de release assim que um dispositivo ADB for detectado.
param(
    [string]$ApkPath = "android/app/build/outputs/apk/release/app-release.apk",
    [string]$PackageName = "com.fideliza_gestao",
    [int]$TimeoutSeconds = 240,
    [int]$PollIntervalSeconds = 2
)

$ErrorActionPreference = 'Stop'

function Get-ConnectedAdbDevices() {
    $list = adb devices -l 2>$null | Select-String -NotMatch "^List of devices"
    if (-not $list) { return @() }
    $devices = @()
    foreach ($line in $list) {
        $parts = ($line -split "\s+") | Where-Object { $_ -ne '' }
        if ($parts.Length -ge 2 -and $parts[1] -eq 'device') {
            $devices += $parts[0]
        }
    }
    return $devices
}

Write-Host "[install-release] Verificando APK em '$ApkPath'" -ForegroundColor Cyan
if (-not (Test-Path -LiteralPath $ApkPath)) {
    throw "APK não encontrado em '$ApkPath'. Gere-o com: cd android; ./gradlew assembleRelease"
}

Write-Host "[install-release] Iniciando servidor ADB" -ForegroundColor Cyan
adb start-server | Out-Null

$deadline = (Get-Date).AddSeconds($TimeoutSeconds)
do {
    $devices = Get-ConnectedAdbDevices
    if ($devices.Count -gt 0) { break }
    Write-Host "[install-release] Aguardando dispositivo ADB... (conecte e autorize o prompt no telefone)" -ForegroundColor Yellow
    Start-Sleep -Seconds $PollIntervalSeconds
} while ((Get-Date) -lt $deadline)

if ($devices.Count -eq 0) {
    throw "Nenhum dispositivo ADB detectado após $TimeoutSeconds s. Verifique USB debugging/drivers."
}

Write-Host "[install-release] Dispositivo(s) detectado(s): $($devices -join ', ')" -ForegroundColor Green

Write-Host "[install-release] Instalando APK (reinstalação -r)" -ForegroundColor Cyan
adb install -r $ApkPath | ForEach-Object { Write-Host $_ }

Write-Host "[install-release] Iniciando app: $PackageName" -ForegroundColor Cyan
adb shell am force-stop $PackageName 2>$null | Out-Null
adb shell monkey -p $PackageName -c android.intent.category.LAUNCHER 1 | Out-Null

try {
    $pid = adb shell pidof $PackageName 2>$null
    if ($pid) {
        Write-Host "[install-release] App iniciado com PID $pid" -ForegroundColor Green
    } else {
        Write-Host "[install-release] App iniciado (PID não identificado)." -ForegroundColor Yellow
    }
} catch { }

Write-Host "[install-release] Concluído." -ForegroundColor Green
