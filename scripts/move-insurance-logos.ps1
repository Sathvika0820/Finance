$repoRoot = Get-Location
$out = Join-Path $repoRoot 'public\logos\insurance'
if (-not (Test-Path $out)) { New-Item -ItemType Directory -Path $out | Out-Null }
$logoDir = Join-Path $repoRoot 'public\logos'
$files = @(
  'Bajaj Allianz Life.png',
  'Care Health Insurance.png',
  'HDFC Life.png',
  'ICICI Prudential Life.png',
  'LIC.png',
  'Max Life Insurance.png',
  'Niva Bupa Health Insurance.png',
  'New India Assurance.png',
  'Oriental Insurance.png',
  'SBI Life Insurance.png',
  'Star Health Insurance.png',
  'Tata AIA Life.png',
  'United India Insurance.png',
  'National Insurance Company.png'
)

foreach ($f in $files) {
  $src = Join-Path $logoDir $f
  if (Test-Path $src) {
    try {
      Move-Item -Path $src -Destination $out -Force
      Write-Output "Moved: $f"
    } catch {
      $err = $_.ToString()
      Write-Output ("Failed to move {0}: {1}" -f $f, $err)
    }
  } else {
    Write-Output "Missing: $f"
  }
}

Write-Output "Done."