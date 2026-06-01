$IndexPath = "C:\Users\piotr\strony\permanentnybielsko-astro\src\pages\index.astro"
$BackupPath = "C:\Users\piotr\strony\permanentnybielsko-astro\src\pages\index.backup-before-image-size-fix.astro"

if (!(Test-Path $IndexPath)) {
  Write-Host "ERROR: index.astro not found." -ForegroundColor Red
  exit 1
}

Copy-Item $IndexPath $BackupPath -Force

$Text = Get-Content -Path $IndexPath -Raw -Encoding UTF8

$StartMarker = "/* V25-FIX-IMAGE-SIZES-START */"
$EndMarker = "/* V25-FIX-IMAGE-SIZES-END */"

$Css = @'
  /* V25-FIX-IMAGE-SIZES-START */
  /* Emergency fix: stop homepage photos from stretching full width */

  :global(.home-page .ltl-team-photo-feature) {
    width: min(100%, 920px) !important;
    max-width: 920px !important;
    margin: clamp(24px, 3.6vw, 48px) auto clamp(28px, 4vw, 56px) !important;
    padding: clamp(8px, 1.2vw, 12px) !important;
    overflow: hidden !important;
    border-radius: clamp(24px, 3.4vw, 38px) !important;
  }

  :global(.home-page .ltl-team-photo-feature img) {
    display: block !important;
    width: 100% !important;
    height: auto !important;
    max-height: 560px !important;
    aspect-ratio: auto !important;
    object-fit: contain !important;
    object-position: center !important;
    border-radius: clamp(18px, 2.6vw, 28px) !important;
  }

  :global(.home-page .training-home-photo-card) {
    width: min(100%, 700px) !important;
    max-width: 700px !important;
    margin: clamp(24px, 3.5vw, 40px) auto clamp(26px, 3.8vw, 46px) !important;
    padding: clamp(7px, 1vw, 10px) !important;
    overflow: hidden !important;
    border-radius: clamp(22px, 3vw, 34px) !important;
  }

  :global(.home-page .training-home-photo-card img) {
    display: block !important;
    width: 100% !important;
    height: auto !important;
    max-height: 520px !important;
    aspect-ratio: auto !important;
    object-fit: contain !important;
    object-position: center !important;
    border-radius: clamp(16px, 2.4vw, 26px) !important;
  }

  :global(.home-page .mission-visual-between) {
    width: 100% !important;
    max-width: 470px !important;
    margin: clamp(26px, 4vw, 42px) auto clamp(26px, 4vw, 42px) !important;
    display: flex !important;
    justify-content: center !important;
  }

  :global(.home-page .mission-visual-between .mission-photo-card) {
    width: min(100%, 430px) !important;
    max-width: 430px !important;
    margin-left: auto !important;
    margin-right: auto !important;
    overflow: hidden !important;
  }

  :global(.home-page .mission-visual-between .mission-photo-card img) {
    display: block !important;
    width: 100% !important;
    height: auto !important;
    max-height: 600px !important;
    aspect-ratio: 4 / 5 !important;
    object-fit: cover !important;
    object-position: center 18% !important;
  }

  @media (min-width: 1500px) {
    :global(.home-page .ltl-team-photo-feature) {
      max-width: 860px !important;
    }

    :global(.home-page .training-home-photo-card) {
      max-width: 650px !important;
    }

    :global(.home-page .mission-visual-between) {
      max-width: 500px !important;
    }

    :global(.home-page .mission-visual-between .mission-photo-card) {
      max-width: 440px !important;
    }
  }

  @media (max-width: 980px) {
    :global(.home-page .ltl-team-photo-feature) {
      width: min(100%, 92vw) !important;
      max-width: 620px !important;
    }

    :global(.home-page .ltl-team-photo-feature img) {
      max-height: 420px !important;
    }

    :global(.home-page .training-home-photo-card) {
      width: min(100%, 90vw) !important;
      max-width: 560px !important;
    }

    :global(.home-page .training-home-photo-card img) {
      max-height: 420px !important;
    }

    :global(.home-page .mission-visual-between) {
      max-width: 390px !important;
    }

    :global(.home-page .mission-visual-between .mission-photo-card) {
      max-width: 390px !important;
    }

    :global(.home-page .mission-visual-between .mission-photo-card img) {
      max-height: 450px !important;
    }
  }

  @media (max-width: 760px) {
    :global(.home-page .ltl-team-photo-feature) {
      width: min(100%, 90vw) !important;
      max-width: 360px !important;
      margin: 22px auto 32px !important;
      padding: 7px !important;
      border-radius: 24px !important;
    }

    :global(.home-page .ltl-team-photo-feature img) {
      max-height: 270px !important;
      object-fit: contain !important;
      border-radius: 18px !important;
    }

    :global(.home-page .training-home-photo-card) {
      width: min(100%, 90vw) !important;
      max-width: 350px !important;
      margin: 22px auto 28px !important;
      padding: 6px !important;
      border-radius: 22px !important;
    }

    :global(.home-page .training-home-photo-card img) {
      max-height: 280px !important;
      object-fit: contain !important;
      border-radius: 16px !important;
    }

    :global(.home-page .mission-visual-between) {
      max-width: 330px !important;
      margin: 20px auto 24px !important;
    }

    :global(.home-page .mission-visual-between .mission-photo-card) {
      width: min(100%, 330px) !important;
      max-width: 330px !important;
      border-radius: 24px !important;
    }

    :global(.home-page .mission-visual-between .mission-photo-card img) {
      max-height: 385px !important;
      aspect-ratio: 4 / 5 !important;
      object-fit: cover !important;
      object-position: center 18% !important;
    }

    :global(.home-page .mission-visual-between .mission-photo-card figcaption) {
      display: none !important;
    }
  }

  /* V25-FIX-IMAGE-SIZES-END */
'@

$Pattern = [regex]::Escape($StartMarker) + ".*?" + [regex]::Escape($EndMarker)

if ([regex]::IsMatch($Text, $Pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)) {
  $Text = [regex]::Replace($Text, $Pattern, $Css, [System.Text.RegularExpressions.RegexOptions]::Singleline)
}
else {
  $CloseStyle = "</style>"
  $Index = $Text.LastIndexOf($CloseStyle)
  if ($Index -lt 0) {
    Write-Host "ERROR: closing style tag not found. No changes saved." -ForegroundColor Red
    exit 1
  }

  $Text = $Text.Insert($Index, "`r`n$Css`r`n")
}

Set-Content -Path $IndexPath -Value $Text -Encoding UTF8

Write-Host "OK: image size fix added to index.astro" -ForegroundColor Green
Write-Host "Backup saved:" $BackupPath -ForegroundColor Yellow
