$ProjectPath = "C:\Users\piotr\strony\permanentnybielsko-astro"
$IndexPath = Join-Path $ProjectPath "src\pages\index.astro"
$SafeBackupPath = Join-Path $ProjectPath "index.backup-clean-css-before-fix.astro"

if (!(Test-Path $IndexPath)) {
  Write-Host "ERROR: Nie znaleziono src/pages/index.astro" -ForegroundColor Red
  exit 1
}

Copy-Item $IndexPath $SafeBackupPath -Force

$Text = Get-Content -Path $IndexPath -Raw -Encoding UTF8

# Usuwa tylko błędny, osierocony fragment CSS, który powoduje warning:
# }}object-fit: contain !important; border-radius: 16px !important;
$Pattern = '(?s)(?<=\})\s*object-fit:\s*contain\s*!important;\s*border-radius:\s*16px\s*!important;\s*(?=\})'
$NewText = [regex]::Replace($Text, $Pattern, '')

# Porządkuje ewentualnie zdublowany znacznik końca bloku V25.
$NewText = [regex]::Replace(
  $NewText,
  '(?s)/\*\s*V25-FIX-IMAGE-SIZES-END\s*\*/\s*/\*\s*V25-FIX-IMAGE-SIZES-END\s*\*/',
  '/* V25-FIX-IMAGE-SIZES-END */'
)

Set-Content -Path $IndexPath -Value $NewText -Encoding UTF8

# Bardzo ważne: backup w src/pages publikuje się jako normalna podstrona.
# Usuwamy tylko kopie backupowe indexu z katalogu src/pages.
Get-ChildItem -Path (Join-Path $ProjectPath "src\pages") -Filter "index.backup*.astro" -ErrorAction SilentlyContinue | Remove-Item -Force

Write-Host "OK: wyczyszczono ostrzeżenie CSS i usunięto backupy z src/pages." -ForegroundColor Green
Write-Host "Bezpieczny backup zapisany tutaj:" -ForegroundColor Yellow
Write-Host $SafeBackupPath -ForegroundColor Yellow
