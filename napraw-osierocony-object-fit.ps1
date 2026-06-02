$ProjectPath = "C:\Users\piotr\strony\permanentnybielsko-astro"
$BackupDir = Join-Path $ProjectPath "backup-css-warning-cleanup"
New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null

$Files = Get-ChildItem -Path (Join-Path $ProjectPath "src") -Recurse -Include *.astro,*.css

$Changed = 0

foreach ($File in $Files) {
  $Text = Get-Content -Path $File.FullName -Raw -Encoding UTF8
  $Original = $Text

  # Najważniejsza poprawka: usuwa osierocony CSS typu:
  # }}object-fit: contain !important; border-radius: 16px !important;}
  # albo:
  # }
  # object-fit: contain !important;
  # border-radius: 16px !important;
  # }
  $Text = [regex]::Replace(
    $Text,
    '(?s)(\})\s*object-fit\s*:\s*contain\s*!important\s*;\s*border-radius\s*:\s*16px\s*!important\s*;\s*(\})',
    '$1$2'
  )

  # Drugi wariant: gdy po border-radius nie ma domykającej klamry bezpośrednio obok.
  $Text = [regex]::Replace(
    $Text,
    '(?s)(\})\s*object-fit\s*:\s*contain\s*!important\s*;\s*border-radius\s*:\s*16px\s*!important\s*;',
    '$1'
  )

  if ($Text -ne $Original) {
    $Relative = $File.FullName.Substring($ProjectPath.Length).TrimStart("\")
    $BackupName = $Relative.Replace("\", "__")
    Copy-Item $File.FullName (Join-Path $BackupDir $BackupName) -Force
    Set-Content -Path $File.FullName -Value $Text -Encoding UTF8
    Write-Host "Naprawiono:" $Relative -ForegroundColor Green
    $Changed++
  }
}

Write-Host ""
Write-Host "Liczba poprawionych plikow:" $Changed -ForegroundColor Cyan
Write-Host "Backup przed poprawka:" $BackupDir -ForegroundColor Yellow

Write-Host ""
Write-Host "Sprawdzam, czy zostaly podejrzane fragmenty..." -ForegroundColor Cyan
$Suspects = Select-String -Path (Join-Path $ProjectPath "src\**\*.*") -Pattern "object-fit:\s*contain\s*!important;\s*border-radius:\s*16px\s*!important;" -AllMatches -ErrorAction SilentlyContinue
if ($Suspects) {
  Write-Host "Znaleziono jeszcze takie fragmenty, ale moga byc poprawne, jesli sa wewnatrz selektora:" -ForegroundColor Yellow
  $Suspects | ForEach-Object { Write-Host ($_.Path + ":" + $_.LineNumber + " -> " + $_.Line.Trim()) }
} else {
  Write-Host "Brak podejrzanych fragmentow w jednej linii." -ForegroundColor Green
}
