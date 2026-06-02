$ProjectPath = "C:\Users\piotr\strony\permanentnybielsko-astro"
$PagePath = Join-Path $ProjectPath "src\pages\makijaz-permanentny-bielsko.astro"
$VideoPath = Join-Path $ProjectPath "public\video\proces-makijazu-permanentnego-boguslawa-herda.mp4"
$PosterPath = Join-Path $ProjectPath "public\video\proces-makijazu-permanentnego-boguslawa-herda-poster.webp"
$BackupPath = Join-Path $ProjectPath "makijaz-permanentny-bielsko.backup-before-process-video.astro"

if (!(Test-Path $PagePath)) {
  Write-Host "ERROR: page not found: src/pages/makijaz-permanentny-bielsko.astro" -ForegroundColor Red
  exit 1
}

if (!(Test-Path $VideoPath)) {
  Write-Host "ERROR: video not found:" -ForegroundColor Red
  Write-Host $VideoPath -ForegroundColor Yellow
  exit 1
}

if (!(Test-Path $PosterPath)) {
  Write-Host "ERROR: poster not found:" -ForegroundColor Red
  Write-Host $PosterPath -ForegroundColor Yellow
  exit 1
}

Copy-Item $PagePath $BackupPath -Force

$Text = Get-Content -Path $PagePath -Raw -Encoding UTF8

$VideoMarkup = @'
          <figure class="pmu-process-video-card" aria-label="Film pokazujacy proces makijazu permanentnego">
            <video
              class="pmu-process-video"
              src="/video/proces-makijazu-permanentnego-boguslawa-herda.mp4"
              poster="/video/proces-makijazu-permanentnego-boguslawa-herda-poster.webp"
              muted
              loop
              playsinline
              autoplay
              preload="metadata"
            ></video>
          </figure>

'@

if ($Text -notmatch "pmu-process-video-card") {
  $Needle = '          <div class="pmu-process-grid">'
  if ($Text.Contains($Needle)) {
    $Text = $Text.Replace($Needle, $VideoMarkup + $Needle)
    Write-Host "OK: process video markup added." -ForegroundColor Green
  } else {
    Write-Host "ERROR: place for video markup not found." -ForegroundColor Red
    Write-Host $BackupPath -ForegroundColor Yellow
    exit 1
  }
} else {
  Write-Host "INFO: process video markup already exists." -ForegroundColor Cyan
}

$VideoCss = @'
  /* V10 process video PMU */
  .pmu-process-video-card {
    position: relative;
    width: min(100%, 320px);
    max-width: 320px;
    margin: 0 auto 38px;
    padding: 7px;
    overflow: hidden;
    border-radius: 28px;
    background:
      radial-gradient(circle at 10% 12%, rgba(56, 187, 181, 0.10), transparent 15rem),
      radial-gradient(circle at 94% 88%, rgba(217, 146, 162, 0.10), transparent 16rem),
      rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(56, 187, 181, 0.14);
    box-shadow: 0 18px 48px rgba(23, 21, 29, 0.08);
  }

  .pmu-process-video-card::before {
    content: "";
    position: absolute;
    inset: 9px;
    z-index: 2;
    border-radius: 21px;
    border: 1px solid rgba(255, 255, 255, 0.48);
    pointer-events: none;
  }

  .pmu-process-video {
    display: block;
    width: 100%;
    height: auto;
    max-height: 520px;
    aspect-ratio: 9 / 16;
    object-fit: cover;
    object-position: center;
    border-radius: 21px;
    background: rgba(255, 255, 255, 0.72);
  }

  @media (min-width: 981px) {
    .pmu-process-section .pmu-process-intro {
      grid-template-columns: minmax(0, 1fr) minmax(0, 0.96fr);
      margin-bottom: 30px;
    }

    .pmu-process-video-card {
      width: min(100%, 300px);
      max-width: 300px;
      margin: 0 auto 38px;
    }

    .pmu-process-video {
      max-height: 500px;
    }
  }

  @media (min-width: 1500px) {
    .pmu-process-video-card {
      width: min(100%, 280px);
      max-width: 280px;
    }

    .pmu-process-video {
      max-height: 470px;
    }
  }

  @media (max-width: 980px) {
    .pmu-process-video-card {
      width: min(100%, 320px);
      max-width: 320px;
      margin: 4px auto 34px;
    }

    .pmu-process-video {
      max-height: 520px;
    }
  }

  @media (max-width: 760px) {
    .pmu-process-video-card {
      width: min(100%, 300px);
      max-width: 300px;
      margin: 2px auto 30px;
      padding: 6px;
      border-radius: 24px;
      box-shadow: 0 14px 36px rgba(23, 21, 29, 0.07);
    }

    .pmu-process-video-card::before {
      inset: 7px;
      border-radius: 18px;
    }

    .pmu-process-video {
      max-height: 470px;
      border-radius: 18px;
    }
  }

'@

if ($Text -notmatch "V10 process video PMU") {
  if ($Text.Contains("</style>")) {
    $Text = $Text.Replace("</style>", $VideoCss + "</style>")
    Write-Host "OK: process video CSS added." -ForegroundColor Green
  } else {
    Write-Host "ERROR: style end not found." -ForegroundColor Red
    Write-Host $BackupPath -ForegroundColor Yellow
    exit 1
  }
} else {
  Write-Host "INFO: process video CSS already exists." -ForegroundColor Cyan
}

Set-Content -Path $PagePath -Value $Text -Encoding UTF8

Write-Host ""
Write-Host "DONE: process video added to makijaz-permanentny-bielsko." -ForegroundColor Green
Write-Host "Backup:" -ForegroundColor Yellow
Write-Host $BackupPath -ForegroundColor Yellow
