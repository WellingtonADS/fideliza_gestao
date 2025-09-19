# Stop the background watch-log.ps1 process
$pidFile = Join-Path $PSScriptRoot 'watch-log.pid'
if (Test-Path $pidFile) {
  $watcherPid = Get-Content $pidFile | Select-Object -First 1
  if ($watcherPid) {
    try {
      Stop-Process -Id [int]$watcherPid -Force -ErrorAction Stop
      Write-Output ("Stopped watcher PID {0}" -f $watcherPid)
    } catch {
      Write-Output ("Could not stop PID {0}: {1}" -f $watcherPid, $_.Exception.Message)
    }
  }
  Remove-Item -Force $pidFile
} else {
  "No pid file found. You may need to stop the process manually."
}
