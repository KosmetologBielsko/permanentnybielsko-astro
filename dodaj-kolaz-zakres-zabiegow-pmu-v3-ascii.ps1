$ProjectPath = "C:\Users\piotr\strony\permanentnybielsko-astro"
$PagePath = Join-Path $ProjectPath "src\pages\makijaz-permanentny-bielsko.astro"
$ImagePath = Join-Path $ProjectPath "public\images\zakres-zabiegow-pmu-boguslawa-herda.webp"
$BackupPath = Join-Path $ProjectPath "makijaz-permanentny-bielsko.backup-before-collage.astro"

if (!(Test-Path $PagePath)) {
  Write-Host "ERROR: src/pages/makijaz-permanentny-bielsko.astro not found" -ForegroundColor Red
  exit 1
}

if (!(Test-Path $ImagePath)) {
  Write-Host "ERROR: image not found:" -ForegroundColor Red
  Write-Host $ImagePath -ForegroundColor Yellow
  Write-Host "Copy zakres-zabiegow-pmu-boguslawa-herda.webp to public/images first." -ForegroundColor Yellow
  exit 1
}

Copy-Item $PagePath $BackupPath -Force

$Text = Get-Content -Path $PagePath -Raw -Encoding UTF8

$CollageMarkup = @'
          <figure class="pmu-services-collage" aria-label="Zakres makijazu permanentnego: brwi, usta i kreski">
            <img
              src="/images/zakres-zabiegow-pmu-boguslawa-herda.webp"
              alt="Zakres zabiegow makijazu permanentnego Boguslawa Herda - brwi permanentne, usta permanentne i kreski permanentne"
              width="1672"
              height="941"
              loading="lazy"
              decoding="async"
            />
          </figure>

'@

if ($Text -notmatch "pmu-services-collage") {
  $Needle = '          <div class="pmu-service-grid">'
  if ($Text.Contains($Needle)) {
    $Text = $Text.Replace($Needle, $CollageMarkup + $Needle)
    Write-Host "OK: collage markup added." -ForegroundColor Green
  } else {
    Write-Host "ERROR: place for markup not found." -ForegroundColor Red
    Write-Host $BackupPath -ForegroundColor Yellow
    exit 1
  }
} else {
  Write-Host "INFO: collage markup already exists." -ForegroundColor Cyan
}

$CollageCss = @'
  /* V8 collage Zakres zabiegow PMU */
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

if ($Text -notmatch "V8 collage Zakres zabiegow PMU") {
  $CssNeedle = '  /* V7 — portret PMU: desktop jako elegancka sekcja, mobile jako czytelny kafelek */'
  if ($Text.Contains($CssNeedle)) {
    $Text = $Text.Replace($CssNeedle, $CollageCss + $CssNeedle)
    Write-Host "OK: collage CSS added before V7." -ForegroundColor Green
  } elseif ($Text.Contains("</style>")) {
    $Text = $Text.Replace("</style>", $CollageCss + "</style>")
    Write-Host "OK: collage CSS added before style end." -ForegroundColor Green
  } else {
    Write-Host "ERROR: place for CSS not found." -ForegroundColor Red
    Write-Host $BackupPath -ForegroundColor Yellow
    exit 1
  }
} else {
  Write-Host "INFO: collage CSS already exists." -ForegroundColor Cyan
}

Set-Content -Path $PagePath -Value $Text -Encoding UTF8

Write-Host ""
Write-Host "DONE: collage added to makijaz-permanentny-bielsko." -ForegroundColor Green
Write-Host "Backup:" -ForegroundColor Yellow
Write-Host $BackupPath -ForegroundColor Yellow
