# scripts/detect_gpu.ps1
$vendor = "cpu"
if (Get-Command nvidia-smi -EA SilentlyContinue) {
    try { nvidia-smi -L | Out-Null; $vendor = "nvidia" } catch {}
}
elseif (Get-Command rocminfo -EA SilentlyContinue) {
    $vendor = "amd"
}
elseif (Test-Path "\\.\DISPLAY*") {   # crude Intel check
    $vendor = "intel"
}
$vendor