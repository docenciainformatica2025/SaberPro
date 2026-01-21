$ErrorActionPreference = "Stop"

# Configuration
$BackupDir = "..\backups"
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$BackupName = "SaberPro_Stable_Audit_$Timestamp"
$ZipPath = Join-Path $BackupDir "$BackupName.zip"

# Create Backup Directory
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
    Write-Host "Created backup directory: $BackupDir" -ForegroundColor Green
}

# Define exclusion list (node_modules, .next, .git, etc.)
$Exclude = @("node_modules", ".next", ".git", ".vscode", "backups", "tmp")

# Check if 7z or similar exists, otherwise use Compress-Archive (slower but built-in)
Write-Host "Starting Backup: $ZipPath" -ForegroundColor Cyan

# We use a temporary staging folder to control exactly what gets zipped
$StagingDir = Join-Path $env:TEMP $BackupName
if (Test-Path $StagingDir) { Remove-Item -Recurse -Force $StagingDir }
New-Item -ItemType Directory -Force -Path $StagingDir | Out-Null

# Copy files (excluding heavy/temp items)
Get-ChildItem -Path . -Exclude $Exclude | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $StagingDir -Recurse -Force
}

# Zip the staging folder
Compress-Archive -Path "$StagingDir\*" -DestinationPath $ZipPath -Force

# Cleanup
Remove-Item -Recurse -Force $StagingDir

Write-Host "Backup Complete: $ZipPath" -ForegroundColor Green

# Git Tagging
$TagName = "v3.2.0-audit-complete-$Timestamp"
git tag -a $TagName -m "Policy Backup: Post-Audit Stability Checkpoint"
Write-Host "Created Git Tag: $TagName" -ForegroundColor Yellow
