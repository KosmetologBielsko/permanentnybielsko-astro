# Dodaje kolaż do sekcji "Efekty i metamorfozy" bez nadpisywania reszty index.astro
# Uruchom z folderu projektu: C:\Users\piotr\strony\permanentnybielsko-astro

$IndexPath = "C:\Users\piotr\strony\permanentnybielsko-astro\src\pages\index.astro"

if (!(Test-Path $IndexPath)) {
  Write-Host "Nie znaleziono pliku index.astro: $IndexPath" -ForegroundColor Red
  exit 1
}

$Text = Get-Content -Path $IndexPath -Raw -Encoding UTF8

if ($Text -match "results-home-collage-card") {
  Write-Host "Kolaż efektów jest już dodany w index.astro. Nic nie zmieniam." -ForegroundColor Yellow
  exit 0
}

$BackupPath = "C:\Users\piotr\strony\permanentnybielsko-astro\src\pages\index.backup-before-efekty-metamorfozy.astro"
Copy-Item -Path $IndexPath -Destination $BackupPath -Force

$Needle = @'
          </div>

          <div class="results-gallery-grid">
'@

$Insert = @'
          </div>

          <figure class="results-home-collage-card">
            <img
              src="/images/efekty-metamorfozy-pmu-boguslawa-herda.webp"
              alt="Efekty makijażu permanentnego Bogusława Herda — usta, brwi i kreski permanentne w naturalnym stylu"
              width="1672"
              height="941"
              loading="lazy"
              decoding="async"
            />
          </figure>

          <div class="results-gallery-grid">
'@

if ($Text.IndexOf($Needle) -lt 0) {
  Write-Host "Nie znalazłem miejsca do wstawienia zdjęcia: <div class=""results-gallery-grid"">" -ForegroundColor Red
  Write-Host "Plik backupu został zapisany tutaj: $BackupPath" -ForegroundColor Yellow
  exit 1
}

$Text = $Text.Replace($Needle, $Insert)

$Css = @'

  /* V25 — strona główna: kolaż efektów PMU w sekcji Efekty i metamorfozy */

  :global(.home-page .results-home-collage-card) {
    position: relative !important;
    width: min(100%, 920px) !important;
    margin: clamp(24px, 3.6vw, 44px) auto clamp(26px, 4vw, 50px) !important;
    overflow: hidden !important;
    padding: clamp(7px, 1vw, 10px) !important;
    border-radius: clamp(26px, 3.8vw, 46px) !important;
    background:
      radial-gradient(circle at 8% 12%, rgba(217, 146, 162, 0.11), transparent 18rem),
      radial-gradient(circle at 94% 88%, rgba(56, 187, 181, 0.10), transparent 18rem),
      rgba(255, 255, 255, 0.90) !important;
    border: 1px solid rgba(217, 146, 162, 0.16) !important;
    box-shadow: 0 22px 58px rgba(23, 21, 29, 0.08) !important;
  }

  :global(.home-page .results-home-collage-card::before) {
    content: "" !important;
    position: absolute !important;
    inset: 10px !important;
    z-index: 2 !important;
    border-radius: clamp(19px, 3vw, 36px) !important;
    border: 1px solid rgba(255, 255, 255, 0.48) !important;
    pointer-events: none !important;
  }

  :global(.home-page .results-home-collage-card img) {
    display: block !important;
    width: 100% !important;
    height: auto !important;
    aspect-ratio: 1672 / 941 !important;
    object-fit: contain !important;
    object-position: center !important;
    border-radius: clamp(20px, 3vw, 38px) !important;
    background: rgba(255, 255, 255, 0.70) !important;
  }

  @media (min-width: 1500px) {
    :global(.home-page .results-home-collage-card) {
      width: min(100%, 860px) !important;
    }
  }

  @media (max-width: 760px) {
    :global(.home-page .results-home-collage-card) {
      width: min(100%, 90vw) !important;
      margin: 22px auto 30px !important;
      padding: 6px !important;
      border-radius: 24px !important;
      box-shadow: 0 16px 40px rgba(23, 21, 29, 0.07) !important;
    }

    :global(.home-page .results-home-collage-card::before) {
      inset: 7px !important;
      border-radius: 18px !important;
    }

    :global(.home-page .results-home-collage-card img) {
      border-radius: 18px !important;
    }
  }

'@

if ($Text.IndexOf("</style>") -lt 0) {
  Write-Host "Nie znalazłem końca <style>. Nie zapisuję zmian." -ForegroundColor Red
  Write-Host "Plik backupu został zapisany tutaj: $BackupPath" -ForegroundColor Yellow
  exit 1
}

$Text = $Text.Replace("</style>", $Css + "`r`n</style>")

Set-Content -Path $IndexPath -Value $Text -Encoding UTF8

Write-Host "Gotowe. Dodano kolaż Efekty i metamorfozy do index.astro." -ForegroundColor Green
Write-Host "Backup pliku: $BackupPath" -ForegroundColor Cyan
