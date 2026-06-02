$ProjectPath = "C:\Users\piotr\strony\permanentnybielsko-astro"
$PagePath = Join-Path $ProjectPath "src\pages\makijaz-permanentny-bielsko.astro"
$ImagePath = Join-Path $ProjectPath "public\images\zakres-zabiegow-pmu-boguslawa-herda.webp"
$BackupPath = Join-Path $ProjectPath "makijaz-permanentny-bielsko.backup-before-collage.astro"

if (!(Test-Path $PagePath)) {
  Write-Host "ERROR: Nie znaleziono pliku src/pages/makijaz-permanentny-bielsko.astro" -ForegroundColor Red
  exit 1
}

if (!(Test-Path $ImagePath)) {
  Write-Host "UWAGA: Nie znaleziono obrazu:" -ForegroundColor Yellow
  Write-Host $ImagePath -ForegroundColor Yellow
  Write-Host "Najpierw wklej plik WebP do public/images, potem uruchom skrypt ponownie." -ForegroundColor Yellow
  exit 1
}

Copy-Item $PagePath $BackupPath -Force

$Text = Get-Content -Path $PagePath -Raw -Encoding UTF8

$CollageMarkup = @'

          <figure class="pmu-services-collage" aria-label="Zakres makijażu permanentnego: brwi, usta i kreski">
            <img
              src="/images/zakres-zabiegow-pmu-boguslawa-herda.webp"
              alt="Zakres zabiegów makijażu permanentnego Bogusława Herda – brwi permanentne, usta permanentne i kreski permanentne"
              width="1672"
              height="941"
              loading="lazy"
              decoding="async"
            />
          </figure>
'@

if ($Text -notmatch 'pmu-services-collage') {
  $Needle = '          <div class="pmu-service-grid">'
  if ($Text.Contains($Needle)) {
    $Text = $Text.Replace($Needle, $CollageMarkup + "`r`n" + $Needle)
    Write-Host "OK: dodano kolaż przed kafelkami Zakres zabiegów." -ForegroundColor Green
  } else {
    Write-Host "ERROR: Nie znalazłem miejsca: <div class=""pmu-service-grid"">" -ForegroundColor Red
    Write-Host "Nie zapisuję zmian. Backup jest tutaj:" -ForegroundColor Yellow
    Write-Host $BackupPath -ForegroundColor Yellow
    exit 1
  }
} else {
  Write-Host "INFO: Kolaż już był w pliku — nie dodaję drugi raz." -ForegroundColor Cyan
}

$CollageCss = @'

  /* V8 — kolaż Zakres zabiegów PMU */
  .pmu-services-collage {
    position: relative;
    width: min(100%, 1120px);
    margin: 0 auto 34px;
    padding: 8px;
    overflow: hidden;
    border-radius: clamp(26px, 3vw, 38px);
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.94), rgba(255, 248, 250, 0.84));
    border: 1px solid rgba(201, 127, 143, 0.16);
    box-shadow: 0 24px 68px rgba(89, 53, 67, 0.09);
  }

  .pmu-services-collage::before {
    content: "";
    position: absolute;
    inset: 16px;
    z-index: 2;
    border-radius: clamp(18px, 2.4vw, 28px);
    border: 1px solid rgba(255, 255, 255, 0.48);
    pointer-events: none;
  }

  .pmu-services-collage img {
    display: block;
    width: 100%;
    height: auto;
    max-height: 620px;
    aspect-ratio: 1672 / 941;
    object-fit: contain;
    object-position: center;
    border-radius: clamp(20px, 2.5vw, 30px);
  }

  @media (min-width: 1500px) {
    .pmu-services-collage {
      width: min(100%, 1060px);
      margin-bottom: 36px;
    }

    .pmu-services-collage img {
      max-height: 590px;
    }
  }

  @media (max-width: 980px) {
    .pmu-services-collage {
      width: min(100%, 92vw);
      margin-bottom: 30px;
    }

    .pmu-services-collage img {
      max-height: 520px;
    }
  }

  @media (max-width: 760px) {
    .pmu-services-collage {
      width: min(100%, 92vw);
      margin: 4px auto 28px;
      padding: 6px;
      border-radius: 24px;
      box-shadow: 0 16px 42px rgba(89, 53, 67, 0.08);
    }

    .pmu-services-collage::before {
      inset: 10px;
      border-radius: 18px;
    }

    .pmu-services-collage img {
      max-height: 260px;
      aspect-ratio: 16 / 9;
      object-fit: contain;
      border-radius: 18px;
    }
  }

'@

if ($Text -notmatch 'V8 — kolaż Zakres zabiegów PMU') {
  $CssNeedle = '  /* V7 — portret PMU: desktop jako elegancka sekcja, mobile jako czytelny kafelek */'
  if ($Text.Contains($CssNeedle)) {
    $Text = $Text.Replace($CssNeedle, $CollageCss + "`r`n" + $CssNeedle)
    Write-Host "OK: dodano CSS kolażu przed blokiem V7." -ForegroundColor Green
  } elseif ($Text.Contains("</style>")) {
    $Text = $Text.Replace("</style>", $CollageCss + "`r`n</style>")
    Write-Host "OK: dodano CSS kolażu przed </style>." -ForegroundColor Green
  } else {
    Write-Host "ERROR: Nie znalazłem miejsca na CSS." -ForegroundColor Red
    Write-Host "Nie zapisuję zmian. Backup jest tutaj:" -ForegroundColor Yellow
    Write-Host $BackupPath -ForegroundColor Yellow
    exit 1
  }
} else {
  Write-Host "INFO: CSS kolażu już był w pliku — nie dodaję drugi raz." -ForegroundColor Cyan
}

Set-Content -Path $PagePath -Value $Text -Encoding UTF8

Write-Host ""
Write-Host "GOTOWE: dodano kolaż do /makijaz-permanentny-bielsko/." -ForegroundColor Green
Write-Host "Backup zapisany tutaj:" -ForegroundColor Yellow
Write-Host $BackupPath -ForegroundColor Yellow
