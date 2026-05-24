# Downloads insurer logos using Clearbit Logo API
$services = @(
    @{ id = 'lic'; domain = 'licindia.in' },
    @{ id = 'sbi-life'; domain = 'sbilife.co.in' },
    @{ id = 'hdfc-life'; domain = 'hdfclife.com' },
    @{ id = 'icici-prudential-life'; domain = 'iciciprulife.com' },
    @{ id = 'max-life'; domain = 'maxlifeinsurance.com' },
    @{ id = 'bajaj-allianz-life'; domain = 'bajajallianzlife.com' },
    @{ id = 'tata-aia-life'; domain = 'tataaia.com' },
    @{ id = 'star-health'; domain = 'starhealth.in' },
    @{ id = 'niva-bupa-health'; domain = 'nivabupa.com' },
    @{ id = 'care-health'; domain = 'careinsurance.com' },
    @{ id = 'new-india-assurance'; domain = 'newindia.co.in' },
    @{ id = 'oriental-insurance'; domain = 'orientalinsurance.org.in' },
    @{ id = 'united-india-insurance'; domain = 'uiic.co.in' },
    @{ id = 'national-insurance'; domain = 'nationalinsurance.nic.co.in' }
)

$outdir = Join-Path -Path (Resolve-Path "..\" -Relative) -ChildPath "public\logos\insurance"
# In case script run from repo root, prefer current directory join
$outdir = Join-Path (Get-Location) "public\logos\insurance"
if (-not (Test-Path $outdir)) { New-Item -ItemType Directory -Path $outdir -Force | Out-Null }

foreach ($s in $services) {
    $id = $s.id
    $domain = $s.domain
    $url = "https://logo.clearbit.com/$domain?size=512"
    $outfile = Join-Path $outdir ("$id.png")
    try {
        Invoke-WebRequest -Uri $url -OutFile $outfile -UseBasicParsing -ErrorAction Stop
        Write-Output "Saved: $outfile"
    } catch {
        Write-Output "Failed to download logo for $id ($domain): $_"
    }
}

Write-Output "Done. Logos saved to $outdir"