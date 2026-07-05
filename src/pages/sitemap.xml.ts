ChatGPT Plus























Wklejony tekst.txt
Dokument

Wklejony tekst (2).txt
Dokument

Wklejony tekst (3).txt
Dokument
wgrywma Ci szablon do permanentnybielsko.com wpisy poranidkowe ... trzeba mi wygenerować kilka wpisów które będa mocno pozycjonowały frazy makijaż permanentny Bielsko - Biała Makijaż Permanentny brwi bielsko biała makijaż permanentny oczu bielsko biała makijaż permanentny ust bielsko - biała dodatkowo z frazami regionalnymi ... szablon Ci wgrywam jak tworzysz do tej pory i globalny poradnik zastanawiam się czy wogóle nie zrobć w ogolnym porandiku informacji jakiejś mkajiaz permanentny regionalny Bielsko - Białą i informacje tam typowo lub wkleisz w odpowiednie miejsca oczy brwi ust itp właśnie nowe wpisy ... musimy mocno uderzyć w wpisy w bielsku o makijazu ... byśmy byli pierwsi ... jeszcze mam pytanie co do konkurencji jesli wyszukamy konkurencje czy mozemy jakos wykorzystac ich zasiegi dla naszych wpisów pozyskac ich ruch masz jakiś pomysł ? 


Wklejony tekst.txt
Dokument
import type { APIRoute } from "astro";
import { siteConfig } from "../config/site";

const pages = [
  {
    path: "/",
    priority: "1.0",
    changefreq: "weekly"
  },
  {
    path: "/makijaz-permanentny-bielsko/",
    priority: "0.95",
    changefreq: "weekly"
  },
  {
    path: "/makijaz-permanentny-brwi/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/makijaz-permanentny-ust/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/makijaz-permanentny-oczu/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/usuwanie-makijazu-permanentnego/",
    priority: "0.85",
    changefreq: "monthly"
  },
  {
    path: "/cennik-makijaz-permanentny/",
    priority: "0.85",
    changefreq: "monthly"
  },
  {
    path: "/galeria/",
    priority: "0.75",
    changefreq: "monthly"
  },
  {
    path: "/szkolenie-makijaz-permanentny/",
    priority: "0.85",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/",
    priority: "0.86",
    changefreq: "weekly"
  },

  /*
    Poradnik PMU — wpisy cenowe / Senuto
  */
  {
    path: "/poradnik/makijaz-permanentny-brwi-cena/",
    priority: "0.82",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kreska-permanentna-cena/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/odswiezenie-makijazu-permanentnego-cena/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kurs-makijazu-permanentnego-cena/",
    priority: "0.78",
    changefreq: "monthly"
  },

  /*
    Poradnik PMU — zaawansowane wpisy edukacyjne / Senuto
  */
  {
    path: "/poradnik/brwi-permanentne-dzien-po-dniu/",
    priority: "0.82",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kiedy-mozna-myc-brwi-po-makijazu-permanentnym/",
    priority: "0.79",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/czym-smarowac-brwi-po-makijazu-permanentnym/",
    priority: "0.79",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/microblading-a-makijaz-permanentny-brwi/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/metoda-piorkowa-brwi/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/laserowe-usuwanie-brwi-permanentnych/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kreska-permanentna-gojenie/",
    priority: "0.78",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/usta-permanentne-po-wygojeniu/",
    priority: "0.78",
    changefreq: "monthly"
  },

  /*
    Poradnik PMU — artykuły fundamenty
  */
  {
    path: "/poradnik/jak-przygotowac-sie-do-makijazu-permanentnego-brwi/",
    priority: "0.78",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/jak-goja-sie-brwi-permanentne/",
    priority: "0.78",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/czego-nie-wolno-po-makijazu-permanentnym-brwi/",
    priority: "0.78",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/silky-hairstroke-brows-naturalny-wlos-maszynowy/",
    priority: "0.76",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/metody-brwi-permanentnych-ombre-pudrowe-wloskowe/",
    priority: "0.77",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/rysunek-wstepny-przed-makijazem-permanentnym/",
    priority: "0.74",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kiedy-usuwac-stary-makijaz-permanentny/",
    priority: "0.74",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/nieudany-makijaz-permanentny-brwi-co-zrobic/",
    priority: "0.77",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-ust-jak-wybrac-kolor/",
    priority: "0.74",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-ust-gojenie-dzien-po-dniu/",
    priority: "0.77",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/opryszczka-a-makijaz-permanentny-ust/",
    priority: "0.75",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kreska-permanentna-jak-wybrac-rodzaj/",
    priority: "0.76",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kreska-permanentna-przy-opadajacej-powiece/",
    priority: "0.76",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/jak-wybrac-szkolenie-pmu/",
    priority: "0.7",
    changefreq: "monthly"
  },

  {
    path: "/sercemmalowane/",
    priority: "0.6",
    changefreq: "monthly"
  },
  {
    path: "/kontakt/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/regulamin-salonu/",
    priority: "0.35",
    changefreq: "yearly"
  },
  {
    path: "/rodo-polityka-prywatnosci-regulamin/",
    priority: "0.3",
    changefreq: "yearly"
  }
];

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString();

  const urls = pages
    .map((page) => {
      const loc = new URL(page.path, siteConfig.siteUrl).toString();

      return   <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>;
    })
    .join("\n");

  const body = <?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};     wgrywam ci site map poradnik, nie wiem co to jest SEO-strategia-regionalna-PMU.md gdzie to sie wgrywa ... a co do konkurencja jak to zrobimy to bedziemy dzialac dalej

Dobrze, sitemap jest czytelny i bez problemu dokładamy regionalny klaster. Plik SEO-strategia-regionalna-PMU.md nie idzie na stronę — to tylko notatka robocza dla nas, możesz trzymać lokalnie albo w folderze dokumentacji, ale nie w src/pages.

Myślał przez 34s
Tak — do Twojego sitemap dodajemy tylko 4 nowe URL-e regionalne.
Najlepiej wstawić je zaraz po wpisie:

{
  path: "/poradnik/",
  priority: "0.86",
  changefreq: "weekly"
},
Wklej od razu pod tym:

  /*
    Poradnik PMU — regionalne wpisy Bielsko-Biała
  */
  {
    path: "/poradnik/makijaz-permanentny-bielsko-biala/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-brwi-bielsko-biala/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-ust-bielsko-biala/",
    priority: "0.85",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-oczu-bielsko-biala/",
    priority: "0.85",
    changefreq: "monthly"
  },
SEO-strategia-regionalna-PMU.md nigdzie nie musisz wgrywać na stronę. To jest tylko notatka robocza dla nas: co dodaliśmy, jak linkować, czego nie robić z regionalnymi frazami i jak później uderzać w konkurencję. Możesz ją zostawić na komputerze albo w folderze typu docs/, ale nie wrzucaj jej do src/pages/, bo wtedy Astro może potraktować ją jak stronę.

Pliki .astro z paczki wrzucasz tutaj:

src/pages/poradnik/
czyli finalnie mają być:

src/pages/poradnik/makijaz-permanentny-bielsko-biala.astro
src/pages/poradnik/makijaz-permanentny-brwi-bielsko-biala.astro
src/pages/poradnik/makijaz-permanentny-ust-bielsko-biala.astro
src/pages/poradnik/makijaz-permanentny-oczu-bielsko-biala.astro
A poradnik-update-fragment.txt to też nie jest plik do strony — z niego trzeba tylko przekleić fragment do src/pages/poradnik.astro, bo obecny poradnik działa na tablicach articleCards i categorySections 

.

Kolejność działań:

Wrzucić 4 pliki .astro do src/pages/poradnik/.

Dodać 4 pozycje do sitemap.

Dodać 4 karty do articleCards w src/pages/poradnik.astro.

Dodać kategorię regionalne do categorySections.

Zrobić build.

Wrzucić na Vercel.

W GSC ręcznie zgłosić 4 nowe adresy do indeksacji.

ZIP nadal masz tutaj:

Download ZIP z wpisami regionalnymi PMU

Co do konkurencji — dokładnie tak, najpierw wdrażamy ten klaster, a potem robimy drugi etap: wpisy pod intencje porównawcze typu „jak wybrać gabinet makijażu permanentnego w Bielsku-Białej”, „makijaż permanentny brwi cena Bielsko-Biała”, „tani makijaż permanentny — na co uważać”, „nieudany makijaż permanentny Bielsko-Biała”. To będzie bezpieczne i mocne SEO, bez używania nazw konkurencji w tytułach.


daj app tylko mam wylaczony termianl to daj calasciezke z wejsciem do strony do bulit i app

permanentnybielsko-astro

Czyli użyj tej ścieżki:

cd C:\Users\piotr\strony\permanentnybielsko-astro
Całość do wklejenia:

cd C:\Users\piotr\strony\permanentnybielsko-astro
npm run build
git status
git add .
git commit -m "Dodanie regionalnych wpisow PMU Bielsko-Biala"
git push
Po git push Vercel powinien sam zrobić deploy.

Adresy do sprawdzenia po wdrożeniu:

https://www.permanentnybielsko.com/poradnik/makijaz-permanentny-bielsko-biala/
https://www.permanentnybielsko.com/poradnik/makijaz-permanentny-brwi-bielsko-biala/
https://www.permanentnybielsko.com/poradnik/makijaz-permanentny-ust-bielsko-biala/
https://www.permanentnybielsko.com/poradnik/makijaz-permanentny-oczu-bielsko-biala/

po app na tych 4 mam Bogusława Herda Makijaż Permanentny – Powrót do natury
PMU
Brwi
Usta
Kreski
Usuwanie
Szkolenia
Poradnik
Galeria
Cennik
Kontakt
Umów wizytę
Menu
Naturalny PMU • Bielsko-Biała
01
PMU
02
Brwi
03
Usta
04
Kreski
05
Usuwanie
06
Szkolenia
07
Poradnik
08
Galeria
09
Cennik
10
Kontakt
Online

B
Regulamin salonu
Polityka prywatności
Nie znaleziono strony
Ta strona nie jest już dostępna, ale możesz przejść dalej.
Adres, który otwierasz, mógł pochodzić ze starszej wersji strony. Wybierz jedną z aktualnych podstron: ofertę makijażu permanentnego, brwi, poradnik PMU, szkolenia albo kontakt z gabinetem.

Nowa strona permanentnybielsko.com jest porządkowana wokół makijażu permanentnego: naturalnych brwi, ust, kresek, usuwania PMU, szkoleń i doświadczenia Bogusława Herda.

Przejdź do oferty PMU
Kontakt z gabinetem
404
Aktualna strona

Wróć do właściwego miejsca.
Najlepszy punkt startowy to aktualna oferta makijażu permanentnego Bogusława Herda w Bielsku-Białej.

permanentnybielsko.com/makijaz-permanentny-bielsko/
Wybierz aktualną podstronę
Najważniejsze miejsca na stronie.
Poniżej znajdziesz aktywne linki do głównych obszarów nowej strony PMU.

PMU01 Oferta
Makijaż permanentny Bielsko-Biała
Główna oferta PMU: naturalne brwi, usta, kreski, konsultacja i dopasowanie efektu do urody.

02 Brwi
Brwi permanentne
Naturalny efekt, metoda włosa, Silky Hairstroke Brows i świadoma praca z rysunkiem wstępnym.

03 Poradnik
Poradnik PMU
Ważne tematy makijażu permanentnego: przygotowanie, gojenie, korekty, szkolenia i wydarzenia branżowe.

04 Szkolenia
Szkolenia PMU
Step by Step, Masterclass, Silky Hairstroke Brows i rozwój techniki pod okiem trenerki Long-Time-Liner®.

05 Galeria
Galeria
Galeria ma pokazywać styl pracy, estetykę efektów i charakter marki — nie przypadkowe zdjęcia.

06 Kontakt
Kontakt z gabinetem
Dane gabinetu, lokalizacja, rezerwacja wizyty i najprostsza droga do konsultacji.

Rezerwacja wizyty
Nie wiesz, gdzie przejść? Zacznij od kontaktu lub Booksy.
Jeżeli szukasz konkretnej usługi albo terminu, najprościej przejść do kontaktu lub sprawdzić dostępność wizyt przez Booksy.

Przejdź do kontaktu
Umów wizytę przez Booksy
Bogusława Herda Makijaż Permanentny
Naturalny PMU, spokojna decyzja i efekt dopasowany do twarzy.
W gabinecie w centrum Bielska-Białej makijaż permanentny traktujemy jako precyzyjną pracę z urodą, skórą i proporcjami. Brwi, usta, kreski, korekty oraz szkolenia PMU prowadzone są w oparciu o doświadczenie, estetykę i zasadę „Powrót do natury”.

Naturalny efekt
Rysunek wstępny
Long-Time-Liner®
Szkolenia PMU
Umów wizytę przez Booksy
Zobacz ofertę PMU
Kontakt i lokalizacja
Gabinet w centrum Bielska-Białej
Telefon
+48 730 900 125
E-mail
bogusia@permanentnybielsko.com
Adres gabinetu
ul. Barlickiego 5/23
43-300 Bielsko-Biała
Wygodna lokalizacja
Centrum Bielska-Białej, blisko Galerii Sfera i Ratusza. To dobre miejsce na konsultację, zabieg i spokojny powrót po wizycie.
Otwórz mapę i opinie Google
Oferta PMU
Makijaż permanentny
Brwi permanentne
Usta permanentne
Kreski permanentne
Usuwanie PMU
Cennik PMU
Ekspercko
Szkolenie makijaż permanentny
Szkolenia PMU
Galeria
#SercemMalowane
Kontakt
Online
Instagram
@permanentnybielsko
Facebook
PermanentnyBielsko
Booksy
Rezerwacja wizyty
Google
Mapa i opinie
Formalnie
Regulamin salonu
RODO / Polityka prywatności
Mapa strony
Kosmetologia estetyczna
kosmetologiabielsko.com
© 2026 Bogusława Herda — Makijaż Permanentny Bielsko-Biała.

Wszystkie zdjęcia, filmy i treści są chronione prawem autorskim. Kopiowanie i wykorzystywanie materiałów bez pisemnej zgody jest zabronione.

Oficjalna strona makijażu permanentnego, szkoleń PMU i naturalnej pigmentacji.

Realizacja strony: BPHM®


AI
Dobierz zabieg
AI Asystent PMU

To wygląda dokładnie jak brak tras w Astro: sitemap/linki już wskazują nowe adresy, ale same pliki .astro nie są w src/pages/poradnik/ albo nie zostały wypchnięte na GitHub/Vercel. 404 na wszystkich czterech oznacza raczej problem z plikami, nie z SEO.

Myślał przez 19s
To jest prawie na pewno to: dodałeś sitemap / linki, ale 4 pliki .astro nie są fizycznie w folderze src/pages/poradnik/ albo nie poszły w commicie.

Najpierw sprawdź w terminalu:

cd C:\Users\piotr\strony\permanentnybielsko-astro
Get-ChildItem .\src\pages\poradnik\*bielsko-biala*.astro
Powinieneś zobaczyć te 4 pliki:

makijaz-permanentny-bielsko-biala.astro
makijaz-permanentny-brwi-bielsko-biala.astro
makijaz-permanentny-ust-bielsko-biala.astro
makijaz-permanentny-oczu-bielsko-biala.astro
Jeśli nic nie pokaże, to znaczy, że pliki nie są wgrane. Wtedy zrób tak — zakładam, że ZIP masz w Pobrane / Downloads:

cd C:\Users\piotr\strony\permanentnybielsko-astro

Expand-Archive -Path "$env:USERPROFILE\Downloads\pmu-regional-wpisy.zip" -DestinationPath "$env:USERPROFILE\Downloads\pmu-regional-wpisy" -Force

Get-ChildItem "$env:USERPROFILE\Downloads\pmu-regional-wpisy" -Recurse -Filter "*bielsko-biala.astro" | Copy-Item -Destination ".\src\pages\poradnik\" -Force

Get-ChildItem .\src\pages\poradnik\*bielsko-biala*.astro
Potem build i app:

npm run build
git status
git add .
git commit -m "Dodanie regionalnych wpisow PMU Bielsko-Biala"
git push
Po deployu sprawdź te adresy:

https://www.permanentnybielsko.com/poradnik/makijaz-permanentny-bielsko-biala/
https://www.permanentnybielsko.com/poradnik/makijaz-permanentny-brwi-bielsko-biala/
https://www.permanentnybielsko.com/poradnik/makijaz-permanentny-ust-bielsko-biala/
https://www.permanentnybielsko.com/poradnik/makijaz-permanentny-oczu-bielsko-biala/
Ważne: samo dodanie URL-i do sitemap nie tworzy stron. Astro tworzy stronę dopiero wtedy, gdy plik jest tutaj:

src/pages/poradnik/nazwa-strony.astro
Czyli u Ciebie 404 oznacza: link istnieje, ale pliku strony nie ma w deployu.


PS C:\Users\piotr\strony\permanentnybielsko-astro> Get-ChildItem .\src\pages\poradnik\*bielsko-biala*.astro


    Directory: C:\Users\piotr\strony\permanentnybielsko-astro\src\pages\poradnik


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----        05.07.2026     18:11          28924 makijaz-permanentny-bielsko-biala.astro
-a----        05.07.2026     18:11          28217 makijaz-permanentny-brwi-bielsko-biala.astro
-a----        05.07.2026     18:11          28090 makijaz-permanentny-oczu-bielsko-biala.astro
-a----        05.07.2026     18:11          27856 makijaz-permanentny-ust-bielsko-biala.astro


PS C:\Users\piotr\strony\permanentnybielsko-astro>

Myślał przez 5s
Super — czyli pliki są dobrze wgrane lokalnie. Teraz problem nie jest w folderze, tylko w tym, że Vercel najpewniej nie dostał tych plików albo deploy poszedł ze starego commita.

Zrób teraz dokładnie to:

cd C:\Users\piotr\strony\permanentnybielsko-astro
npm run build
Po buildzie sprawdź, czy Astro wygenerowało strony w dist:

Test-Path .\dist\poradnik\makijaz-permanentny-bielsko-biala\index.html
Test-Path .\dist\poradnik\makijaz-permanentny-brwi-bielsko-biala\index.html
Test-Path .\dist\poradnik\makijaz-permanentny-ust-bielsko-biala\index.html
Test-Path .\dist\poradnik\makijaz-permanentny-oczu-bielsko-biala\index.html
Jeśli pokaże:

True
True
True
True
to lokalnie wszystko jest OK i trzeba tylko wypchnąć na GitHub/Vercel:

git status
git add .
git commit -m "Dodanie regionalnych wpisow PMU Bielsko-Biala"
git push
Jeśli przy git commit pokaże coś w stylu:

nothing to commit, working tree clean
to znaczy, że commit już był. Wtedy sprawdź ostatni commit:

git log --oneline -5
I możesz wymusić nowy deploy na Vercel:

vercel --prod
Najważniejsze: skoro pliki są w src/pages/poradnik/, Astro powinno automatycznie zrobić takie adresy:

https://www.permanentnybielsko.com/poradnik/makijaz-permanentny-bielsko-biala/
https://www.permanentnybielsko.com/poradnik/makijaz-permanentny-brwi-bielsko-biala/
https://www.permanentnybielsko.com/poradnik/makijaz-permanentny-ust-bielsko-biala/
https://www.permanentnybielsko.com/poradnik/makijaz-permanentny-oczu-bielsko-biala/
Jeśli lokalnie w dist będzie True, a na stronie dalej 404, to znaczy tylko jedno: produkcja na Vercel nie ma aktualnego deploya.


Myślał przez sekundę
To normalny błąd PowerShella na Windowsie — blokuje plik npm.ps1. Najprościej omiń to przez npm.cmd.

Wklej tak:

cd C:\Users\piotr\strony\permanentnybielsko-astro
npm.cmd run build
Potem sprawdzenie stron w dist:

Test-Path .\dist\poradnik\makijaz-permanentny-bielsko-biala\index.html
Test-Path .\dist\poradnik\makijaz-permanentny-brwi-bielsko-biala\index.html
Test-Path .\dist\poradnik\makijaz-permanentny-ust-bielsko-biala\index.html
Test-Path .\dist\poradnik\makijaz-permanentny-oczu-bielsko-biala\index.html
Jak pokaże cztery razy True, robisz app:

git status
git add .
git commit -m "Dodanie regionalnych wpisow PMU Bielsko-Biala"
git push
Możesz też użyć zwykłego CMD zamiast PowerShella. Wtedy komendy są takie:

cd C:\Users\piotr\strony\permanentnybielsko-astro
npm run build
git status
git add .
git commit -m "Dodanie regionalnych wpisow PMU Bielsko-Biala"
git push
Nie zmieniaj teraz systemowych ustawień Windowsa — npm.cmd run build powinno wystarczyć.



18:21:57 [types] Generated 53ms
18:21:57 [build] output: "static"
18:21:57 [build] mode: "server"
18:21:57 [build] directory: C:\Users\piotr\strony\permanentnybielsko-astro\dist\
18:21:57 [build] adapter: @astrojs/vercel
18:21:57 [build] Collecting build info...
18:21:57 [build] ✓ Completed in 246ms.
18:21:57 [build] Building server entrypoints...
18:22:04 [ERROR] [vite] ✗ Build failed in 7.09s
Expected "]" but found "{"
  Location:
    C:/Users/piotr/strony/permanentnybielsko-astro/src/pages/poradnik.astro:295:0
  Stack trace:
    at failureErrorWithLog (C:\Users\piotr\strony\permanentnybielsko-astro\node_modules\esbuild\lib\main.js:1748:15)
    at responseCallbacks.<computed> (C:\Users\piotr\strony\permanentnybielsko-astro\node_modules\esbuild\lib\main.js:884:9)
    at Socket.readFromStdout (C:\Users\piotr\strony\permanentnybielsko-astro\node_modules\esbuild\lib\main.js:862:7)
    at addChunk (node:internal/streams/readable:563:12)
    at Readable.push (node:internal/streams/readable:394:5)
PS C:\Users\piotr\strony\permanentnybielsko-astro>
PS C:\Users\piotr\strony\permanentnybielsko-astro> Test-Path .\dist\poradnik\makijaz-permanentny-bielsko-biala\index.html
False
PS C:\Users\piotr\strony\permanentnybielsko-astro> Test-Path .\dist\poradnik\makijaz-permanentny-brwi-bielsko-biala\index.html
False
PS C:\Users\piotr\strony\permanentnybielsko-astro> Test-Path .\dist\poradnik\makijaz-permanentny-ust-bielsko-biala\index.html
False
PS C:\Users\piotr\strony\permanentnybielsko-astro> Test-Path .\dist\poradnik\makijaz-permanentny-oczu-bielsko-biala\index.html
False
PS C:\Users\piotr\strony\permanentnybielsko-astro>

Build zatrzymał się przed generowaniem dist, więc 404 jest logiczne. Błąd jest konkretny: w src/pages/poradnik.astro masz źle doklejony fragment w tablicy articleCards — najpewniej brakuje przecinka przed nowym wpisem albo wpisy regionalne trafiły za ];.

Myślał przez 20s
Błąd jest w src/pages/poradnik.astro, nie w tych 4 nowych stronach.

W Twoim oryginalnym poradniku tablica articleCards kończy się po numerze 26 tak:

  {
    number: "26",
    category: "Usta permanentne",
    title: "Usta permanentne po wygojeniu — kiedy ocenić kolor i efekt?",
    text: "Jak wyglądają usta permanentne po wygojeniu: kolor, chwilowe rozjaśnienie, stabilizacja pigmentu i decyzja o dopigmentowaniu.",
    href: "/poradnik/usta-permanentne-po-wygojeniu/",
    featured: false,
    groups: ["usta", "gojenie"]
  }];
A zaraz potem zaczyna się const categorySections = [ 


Czyli wpisy regionalne muszą być przed tym zamknięciem ];, a nie po nim. Najprościej napraw tak:

W src/pages/poradnik.astro znajdź końcówkę wpisu numer 26 i zamień samo zakończenie:

  }];
na to:

  },
  {
    number: "27",
    category: "PMU Bielsko-Biała",
    title: "Makijaż permanentny Bielsko-Biała — brwi, usta i kreski",
    text: "Regionalny przewodnik po makijażu permanentnym w Bielsku-Białej: brwi, usta, kreski, konsultacja, naturalny efekt i świadomy wybór gabinetu PMU.",
    href: "/poradnik/makijaz-permanentny-bielsko-biala/",
    featured: true,
    groups: ["regionalne", "brwi", "usta", "kreski"]
  },
  {
    number: "28",
    category: "PMU Bielsko-Biała",
    title: "Makijaż permanentny brwi Bielsko-Biała — jak wybrać metodę?",
    text: "Brwi permanentne w Bielsku-Białej: metoda włoskowa, cieniowanie, włos z cieniem, rysunek wstępny, skóra i naturalny efekt bez przerysowania.",
    href: "/poradnik/makijaz-permanentny-brwi-bielsko-biala/",
    featured: true,
    groups: ["regionalne", "brwi"]
  },
  {
    number: "29",
    category: "PMU Bielsko-Biała",
    title: "Makijaż permanentny ust Bielsko-Biała — kolor, gojenie i efekt",
    text: "Usta permanentne w Bielsku-Białej: dobór koloru, opryszczka, gojenie, naturalne odświeżenie czerwieni wargowej i konsultacja przed zabiegiem.",
    href: "/poradnik/makijaz-permanentny-ust-bielsko-biala/",
    featured: false,
    groups: ["regionalne", "usta"]
  },
  {
    number: "30",
    category: "PMU Bielsko-Biała",
    title: "Makijaż permanentny oczu Bielsko-Biała — kreski i zagęszczenie rzęs",
    text: "Kreski permanentne w Bielsku-Białej: zagęszczenie linii rzęs, kreska górna, dolna, opadająca powieka i bezpieczny dobór efektu do oka.",
    href: "/poradnik/makijaz-permanentny-oczu-bielsko-biala/",
    featured: false,
    groups: ["regionalne", "kreski"]
  }
];
Potem w categorySections dodaj nową kategorię. Najlepiej zaraz przed kategorią ceny:

  {
    id: "regionalne",
    label: "Bielsko-Biała",
    title: "Makijaż permanentny Bielsko-Biała",
    text: "Regionalne poradniki PMU dla osób szukających makijażu permanentnego brwi, ust i oczu w Bielsku-Białej oraz okolicy."
  },
Czyli ma być tak:

const categorySections = [
  {
    id: "regionalne",
    label: "Bielsko-Biała",
    title: "Makijaż permanentny Bielsko-Biała",
    text: "Regionalne poradniki PMU dla osób szukających makijażu permanentnego brwi, ust i oczu w Bielsku-Białej oraz okolicy."
  },
  {
    id: "ceny",
    label: "Ceny",
    title: "Ceny PMU i decyzje przed wyborem zabiegu",
    text: "Najbardziej decyzyjne tematy: ile kosztuje zabieg, co obejmuje cena, czym różni się korekta od odświeżenia i kiedy wycena musi być indywidualna."
  },
Potem odpal:

npm.cmd run build
Jak przejdzie, sprawdź:

Test-Path .\dist\poradnik\makijaz-permanentny-bielsko-biala\index.html
Test-Path .\dist\poradnik\makijaz-permanentny-brwi-bielsko-biala\index.html
Test-Path .\dist\poradnik\makijaz-permanentny-ust-bielsko-biala\index.html
Test-Path .\dist\poradnik\makijaz-permanentny-oczu-bielsko-biala\index.html
Ma być:

True
True
True
True
I dopiero wtedy:

git status
git add .
git commit -m "Naprawa regionalnych wpisow PMU w poradniku"
git push
Najważniejsze: nie może być tak, że po ]; doklejasz kolejny { ... }. Każdy nowy wpis musi być częścią tablicy articleCards, czyli przed końcowym ];.



Wklejony tekst.txt
Dokument

Myślał przez 40s
Ten plik, który teraz wkleiłeś, wygląda już prawie dobrze. Regionalne wpisy 27–30 są już w środku tablicy articleCards, a nie poza nią, więc główny błąd został poprawiony 


Została jedna rzecz: masz brzydki zapis po wpisie 18:

  }
,
  {
    number: "19",
To jest technicznie poprawne, ale popraw to dla porządku na:

  },
  {
    number: "19",
Potem zapisz plik w VS Code: Ctrl + S.

Teraz odpal ponownie:

cd C:\Users\piotr\strony\permanentnybielsko-astro
npm.cmd run build
Jeśli dalej pokaże błąd przy src/pages/poradnik.astro:295:0, to znaczy, że na dysku nadal masz inną wersję niż ta, którą wkleiłeś. Wtedy sprawdź dokładnie okolice linii 280–300:

$i=1; Get-Content .\src\pages\poradnik.astro | ForEach-Object { if ($i -ge 280 -and $i -le 300) { "{0}: {1}" -f $i, $_ }; $i++ }
W tym miejscu powinno być mniej więcej tak:

  }
];

const categorySections = [
  {
    id: "regionalne",
    label: "Bielsko-Biała",
    title: "Makijaż permanentny Bielsko-Biała i okolice",
    text: "Regionalne poradniki pod najważniejsze frazy: makijaż permanentny Bielsko-Biała, brwi permanentne, usta permanentne i kreski permanentne w Bielsku-Białej."
  },
  {
    id: "ceny",
Jeśli u Ciebie między pierwszym obiektem regionalne a obiektem ceny nie ma przecinka, build poleci błędem. Ma być dokładnie:

  },
  {
    id: "ceny",
Po udanym buildzie sprawdź:

Test-Path .\dist\poradnik\makijaz-permanentny-bielsko-biala\index.html
Test-Path .\dist\poradnik\makijaz-permanentny-brwi-bielsko-biala\index.html
Test-Path .\dist\poradnik\makijaz-permanentny-ust-bielsko-biala\index.html
Test-Path .\dist\poradnik\makijaz-permanentny-oczu-bielsko-biala\index.html
Ma być:

True
True
True
True
Potem app:

git status
git add .
git commit -m "Naprawa poradnika i regionalnych wpisow PMU"
git push
Czyli teraz najważniejsze: zapisz plik, popraw tylko ten przecinek po 18 dla porządku i odpal build ponownie przez npm.cmd run build.


False
PS C:\Users\piotr\strony\permanentnybielsko-astro> Test-Path .\dist\poradnik\makijaz-permanentny-oczu-bielsko-biala\index.html$i=1; Get-Content .\src\pages\poradnik.astro | ForEach-Object { if ($i -ge 280 -and $i -le 300) { "{0}: {1}" -f $i, $_ }; $i++ }
False
PS C:\Users\piotr\strony\permanentnybielsko-astro> $i=1; Get-Content .\src\pages\poradnik.astro | ForEach-Object { if ($i -ge 280 -and $i -le 300) { "{0}: {1}" -f $i, $_ }; $i++ }
280:     title: "MakijaĹĽ permanentny oczu Bielsko-BiaĹ‚a â€” kreska permanentna i zagÄ™szczenie linii rzÄ™s",
281:     text: "Kreska permanentna, zagÄ™szczenie linii rzÄ™s, kreska gĂłrna i dolna, opadajÄ…ca powieka, gojenie i dobĂłr efektu.",
282:     href: "/poradnik/makijaz-permanentny-oczu-bielsko-biala/",
283:     featured: true,
284:     groups: ["regionalne", "kreski", "przed-zabiegiem", "gojenie"]
285:   }
286: ];
287:
288: const categorySections = [
289:  {
290:     id: "regionalne",
291:     label: "Bielsko-BiaĹ‚a",
292:     title: "MakijaĹĽ permanentny Bielsko-BiaĹ‚a i okolice",
293:     text: "Regionalne poradniki pod najwaĹĽniejsze frazy: makijaĹĽ permanentny Bielsko-BiaĹ‚a, brwi permanentne, usta permanentne i kreski permanentne w Bielsku-BiaĹ‚ej."
294:   },
295: {
296:     id: "ceny",
297:     label: "Ceny",
298:     title: "Ceny PMU i decyzje przed wyborem zabiegu",
299:     text: "Najbardziej decyzyjne tematy: ile kosztuje zabieg, co obejmuje cena, czym rĂłĹĽni siÄ™ korekta od odĹ›wieĹĽenia i kiedy wycena musi byÄ‡ indywidualna."
300:   },
PS C:\Users\piotr\strony\permanentnybielsko-astro>

Myślał przez 10s
Teraz ten fragment wygląda składniowo dobrze. Linia 294 ma przecinek:

294:   },
295: {
czyli błąd Expected "]" but found "{" z poprzedniego builda był najpewniej ze starej wersji pliku albo build nie został ponownie puszczony po poprawce.

Te False z Test-Path teraz nic jeszcze nie znaczą, bo poprzedni build się wysypał i dist nie wygenerował tych stron.

Zrób teraz tylko to:

cd C:\Users\piotr\strony\permanentnybielsko-astro
npm.cmd run build
Jeśli build przejdzie, dopiero wtedy sprawdź:

Test-Path .\dist\poradnik\makijaz-permanentny-bielsko-biala\index.html
Test-Path .\dist\poradnik\makijaz-permanentny-brwi-bielsko-biala\index.html
Test-Path .\dist\poradnik\makijaz-permanentny-ust-bielsko-biala\index.html
Test-Path .\dist\poradnik\makijaz-permanentny-oczu-bielsko-biala\index.html
Jeżeli pokaże True True True True, robisz:

git status
git add .
git commit -m "Naprawa poradnika i regionalnych wpisow PMU"
git push
To, że w PowerShellu widzisz MakijaĹĽ zamiast Makijaż, to najczęściej problem wyświetlania kodowania w terminalu, niekoniecznie błąd pliku. Najważniejsze teraz: puść ponownie build.


false

Samo False nie musi już oznaczać błędu, bo projekt masz na adapterze @astrojs/vercel i przy trybie server/hybrid strony nie zawsze pojawiają się jako klasyczne dist/.../index.html. Teraz musimy ustalić jedną rzecz: czy build przeszedł bez czerwonego ERROR.

Myślał przez 11s
Jeżeli po npm.cmd run build nie było już czerwonego błędu, tylko Test-Path pokazuje False, to nie panikuj — ten test mógł być zły dla Twojego trybu builda.

U Ciebie wcześniej było:

adapter: @astrojs/vercel
mode: "server"
Przy tym trybie strona nie zawsze generuje się jako:

dist/poradnik/.../index.html
Zrób teraz lepsze sprawdzenie, czy build w ogóle widzi te strony:

cd C:\Users\piotr\strony\permanentnybielsko-astro

Get-ChildItem .\dist -Recurse | Where-Object { $_.FullName -like "*bielsko-biala*" } | Select-Object FullName
I jeszcze:

Get-ChildItem .\.vercel -Recurse | Where-Object { $_.FullName -like "*bielsko-biala*" } | Select-Object FullName
Jeśli nic nie pokaże, ale npm.cmd run build zakończył się bez błędu, zrób jeszcze lokalny test dev:

npm.cmd run dev
Terminal pokaże coś w stylu:

http://localhost:4321/
Wejdź w przeglądarce:

http://localhost:4321/poradnik/makijaz-permanentny-bielsko-biala/
http://localhost:4321/poradnik/makijaz-permanentny-brwi-bielsko-biala/
http://localhost:4321/poradnik/makijaz-permanentny-ust-bielsko-biala/
http://localhost:4321/poradnik/makijaz-permanentny-oczu-bielsko-biala/
Jeśli lokalnie się otwierają, to robisz normalnie:

git status
git add .
git commit -m "Dodanie regionalnych wpisow PMU Bielsko-Biala"
git push
Jeśli natomiast po npm.cmd run build nadal jest czerwony błąd, wklej mi dokładnie fragment od linii:

[ERROR]
Najważniejsze: False z Test-Path nie jest teraz decydujące. Decydujące jest to, czy npm.cmd run build kończy się sukcesem oraz czy adresy działają lokalnie przez npm.cmd run dev.


ile powinno być pozycji 40? https://www.permanentnybielsko.com/sitemap.xml

Myślał przez 13s
Po Twoim sitemapie powinno być teraz 44 pozycje, nie 40.

Masz:

40 pozycji było wcześniej
+ 4 nowe wpisy regionalne
= 44 pozycje w sitemap.xml
Te 4 nowe to:

/poradnik/makijaz-permanentny-bielsko-biala/
/poradnik/makijaz-permanentny-brwi-bielsko-biala/
/poradnik/makijaz-permanentny-ust-bielsko-biala/
/poradnik/makijaz-permanentny-oczu-bielsko-biala/
Jeśli na stronie widzisz tylko 40, to znaczy, że w sitemapie nie ma jeszcze tych 4 adresów albo Vercel pokazuje starszy deploy.

Możesz szybko sprawdzić lokalnie w PowerShellu:

cd C:\Users\piotr\strony\permanentnybielsko-astro
(Invoke-WebRequest https://www.permanentnybielsko.com/sitemap.xml).Content | Select-String "<url>" -AllMatches | ForEach-Object { $_.Matches.Count }
Albo prościej: otwórz sitemap i wyszukaj bielsko-biala. Powinny wyskoczyć minimum te 4 regionalne wpisy poradnikowe.

Czyli finalnie: prawidłowo powinno być 44 URL-e.


teraz konkurencja zastanów się robimy stricte bielsko biała

Tak, teraz robimy stricte Bielsko-Biała i okolice, ale nie jako kopiowanie konkurencji. Sprawdzę aktualny układ wyników i zaproponuję bezpieczny plan: frazy, wpisy, kąty treści i linkowanie pod realne intencje klientek.

Myślał przez 23s
Tak — teraz robimy stricte Bielsko-Biała i to jest najlepszy kierunek.

Po szybkim sprawdzeniu rynku widać, że fraza lokalna ma realną konkurencję: Booksy pokazuje osobne wyniki dla „makijaż permanentny Bielsko-Biała” oraz osobne dla „makijaż permanentny brwi Bielsko-Biała”, gdzie widocznych jest wiele gabinetów i usług, więc klientki faktycznie szukają tego lokalnie, nie tylko ogólnie. 
 Jest też mocny lokalny konkurent z własną stroną — Instytut Pięknych Brwi w Bielsku-Białej, który komunikuje PMU brwi, oczu, ust oraz usuwanie laserem i removerem. 

Moja decyzja: nie robimy teraz Kozy / Żywiec / Czechowice / Jaworze jako osobnych stron.
Robimy najpierw dominację na Bielsko-Biała, bo to jest główne miasto, główna intencja i najsilniejszy lokalny sygnał.

Co już mamy dobrze
Mamy teraz 4 wpisy regionalne:

/poradnik/makijaz-permanentny-bielsko-biala/
/poradnik/makijaz-permanentny-brwi-bielsko-biala/
/poradnik/makijaz-permanentny-ust-bielsko-biala/
/poradnik/makijaz-permanentny-oczu-bielsko-biala/
To jest fundament. Ale żeby realnie zawalczyć z konkurencją, potrzebujemy jeszcze warstwy porównawczo-decyzyjnej, bo osoby szukające PMU w Bielsku nie wpisują tylko „makijaż permanentny Bielsko-Biała”. One często porównują: cena, opinie, efekty, najlepszy gabinet, naturalne brwi, metoda włoskowa, tani zabieg, korekta po innym salonie.

Google zaleca robić treści unikalne, pomocne i oparte na realnej wiedzy, a nie tylko przepisywać to, co jest już w internecie. 
 Dlatego nie kopiujemy konkurencji i nie tworzymy pustych stron pod miasta. Google ostrzega też przed stronami typu doorway, czyli stronami tworzonymi głównie pod przechwytywanie ruchu z wielu podobnych lokalizacji. 

Najlepszy plan na konkurencję w Bielsku-Białej
Robimy kolejne wpisy, ale każdy ma inną intencję wyszukiwania.

1. Jak wybrać gabinet makijażu permanentnego w Bielsku-Białej?
To będzie najważniejszy wpis pod ruch od osób, które porównują gabinety. Bez nazw konkurencji, ale z checklistą:

Jak wybrać gabinet makijażu permanentnego w Bielsku-Białej?
Frazy:

najlepszy makijaż permanentny Bielsko-Biała
gabinet makijażu permanentnego Bielsko-Biała
makijaż permanentny Bielsko opinie
linergistka Bielsko-Biała
Ten tekst ma pokazać: doświadczenie, rysunek wstępny, zdjęcia wygojonych efektów, sterylność, pigmenty, korekta, konsultacja, naturalny efekt, praca z trudnym/starym PMU.

2. Makijaż permanentny Bielsko-Biała cena — ile kosztują brwi, usta i kreski?
Booksy mocno pokazuje ceny i promocje, np. w wynikach lokalnych pojawiają się oferty PMU brwi/ust od okolic 750 zł, czasem z rabatami. 
 My nie walczymy najniższą ceną. My robimy tekst: co zawiera cena i dlaczego doświadczenie ma znaczenie.

Frazy:

makijaż permanentny Bielsko-Biała cena
brwi permanentne Bielsko-Biała cena
makijaż permanentny ust Bielsko cena
kreska permanentna Bielsko cena
3. Tani makijaż permanentny Bielsko-Biała — na co uważać?
To jest bardzo mocny wpis przechwytujący ruch od klientek, które porównują tanie oferty. Nie atakujemy konkurencji. Tłumaczymy spokojnie:

niska cena ≠ zły zabieg
wysoka cena ≠ automatycznie dobry zabieg
ale trzeba sprawdzić doświadczenie, zdjęcia wygojone, korektę, kwalifikację skóry i plan zabiegu
To będzie idealne pod frazy:

tani makijaż permanentny Bielsko-Biała
promocja makijaż permanentny Bielsko-Biała
makijaż permanentny brwi tanio Bielsko
4. Naturalny makijaż permanentny brwi Bielsko-Biała — metoda włoskowa czy cieniowanie?
To może być bardzo mocny wpis, bo Wy macie przewagę: naturalność, Silky Hairstroke Brows, metoda włoskowa, włos maszynowy, „Powrót do natury”.

Frazy:

naturalny makijaż permanentny brwi Bielsko-Biała
metoda włoskowa Bielsko-Biała
brwi permanentne naturalny efekt Bielsko
brwi permanentne włoskowe Bielsko-Biała
5. Nieudany makijaż permanentny Bielsko-Biała — korekta, usuwanie, rozjaśnianie
To jest wpis wysokiej intencji. Osoba z problemem często jest gotowa szybko umówić konsultację. Konkurencja lokalna też komunikuje usuwanie PMU, więc musimy mieć bardzo mocny tekst pod naprawę i rozjaśnianie. 

Frazy:

nieudany makijaż permanentny Bielsko-Biała
korekta makijażu permanentnego Bielsko
usuwanie makijażu permanentnego Bielsko-Biała
laserowe usuwanie brwi permanentnych Bielsko
Jak wykorzystać konkurencję bez ryzyka
Nie piszemy: „lepsi niż X” albo „porównanie z X”. To może wyglądać słabo wizerunkowo i niepotrzebnie ich wzmacniać.

Robimy za to teksty, które odpowiadają na pytania klientek zanim wybiorą gabinet:

Na co zwrócić uwagę przed wyborem linergistki?
Czy patrzeć tylko na cenę?
Czy zdjęcie od razu po zabiegu wystarczy?
Jak rozpoznać naturalny efekt?
Czy korekta jest w cenie?
Czy gabinet pokazuje wygojone efekty?
Czy metoda włoskowa jest dla każdej skóry?
Co zrobić, jeśli mam stary pigment?
To jest bezpieczne, profesjonalne i skuteczne.

Moja rekomendacja kolejności
Najpierw zrobiłbym te 3 wpisy:

1. Jak wybrać gabinet makijażu permanentnego w Bielsku-Białej?
2. Makijaż permanentny Bielsko-Biała cena — brwi, usta, kreski
3. Tani makijaż permanentny Bielsko-Biała — na co uważać?
Dopiero potem:

4. Naturalne brwi permanentne Bielsko-Biała — metoda włoskowa, cieniowanie, włos z cieniem
5. Nieudany makijaż permanentny Bielsko-Biała — korekta i usuwanie
Co bym zrobił na stronie głównej PMU
Na /makijaz-permanentny-bielsko/ dodałbym jedną sekcję:

Szukasz makijażu permanentnego w Bielsku-Białej?
I tam 4 linki:

Makijaż permanentny Bielsko-Biała — poradnik
Makijaż permanentny brwi Bielsko-Biała
Makijaż permanentny ust Bielsko-Biała
Makijaż permanentny oczu Bielsko-Biała
To wzmocni linkowanie wewnętrzne. Google jasno podkreśla, że linki powinny być crawlable i pomagać wyszukiwarce odkrywać oraz rozumieć strony. 

Moja decyzja końcowa
Tak: robimy stricte Bielsko-Biała.

Nie rozdrabniamy się jeszcze na okolice. Okolice dodajemy tylko naturalnie w treści, np.:

Z gabinetu w centrum Bielska-Białej korzystają klientki z Bielska, Czechowic-Dziedzic, Kóz, Jaworza, Wilkowic, Szczyrku, Żywca i okolic.
Ale osobnych stron pod te miasta teraz nie tworzymy. Najpierw dominujemy główną frazę lokalną, potem dopiero rozbudowujemy region.


to dawaj do poradnika nowe wpisy 

Robimy drugi pakiet do poradnika: wpisy stricte decyzyjne pod Bielsko-Białą, czyli takie, które łapią klientkę porównującą gabinety, ceny, naturalny efekt i poprawki po nieudanym PMU. Przygotuję pliki .astro, fragment do poradnik.astro i fragment do sitemap.

Myślał przez 4m 56s
Gotowe — przygotowałem drugi pakiet wpisów stricte pod Bielsko-Biała + konkurencja / porównywanie gabinetów.

Download ZIP — nowe wpisy PMU Bielsko-Biała

W środku masz 5 nowych wpisów .astro:

src/pages/poradnik/jak-wybrac-gabinet-makijazu-permanentnego-bielsko-biala.astro
src/pages/poradnik/makijaz-permanentny-bielsko-biala-cena.astro
src/pages/poradnik/tani-makijaz-permanentny-bielsko-biala.astro
src/pages/poradnik/naturalny-makijaz-permanentny-brwi-bielsko-biala.astro
src/pages/poradnik/nieudany-makijaz-permanentny-bielsko-biala.astro
Dodatkowo w ZIP są:

poradnik-update-fragment-31-35.txt
sitemap-fragment-31-35.txt
README.md
Te wpisy celują w frazy:

jak wybrać gabinet makijażu permanentnego Bielsko-Biała
makijaż permanentny Bielsko-Biała cena
tani makijaż permanentny Bielsko-Biała
naturalny makijaż permanentny brwi Bielsko-Biała
nieudany makijaż permanentny Bielsko-Biała
korekta makijażu permanentnego Bielsko-Biała
usuwanie makijażu permanentnego Bielsko-Biała
Dopasowałem to do Twojego obecnego poradnika, gdzie wpisy są kartami w articleCards, a kategorie działają przez groups i articlesByCategory 


Ważne: nie dodawaj drugi raz kategorii Bielsko-Biała. Już ją masz jako regionalne. Teraz tylko doklejasz nowe karty z pliku:

poradnik-update-fragment-31-35.txt
Wklej je w src/pages/poradnik.astro po wpisie 30, przed końcowym ]; tablicy articleCards. Fragment zaczyna się przecinkiem celowo, żeby nie wywaliło buildu.

Do sitemap dodajesz fragment z:

sitemap-fragment-31-35.txt
Po wdrożeniu sitemap powinien mieć:

44 obecne pozycje + 5 nowych = 49 pozycji
Potem build i app:

cd C:\Users\piotr\strony\permanentnybielsko-astro
npm.cmd run build
git status
git add .
git commit -m "Dodanie konkurencyjnych wpisow PMU Bielsko-Biala"
git push
Po deployu sprawdź nowe adresy:

https://www.permanentnybielsko.com/poradnik/jak-wybrac-gabinet-makijazu-permanentnego-bielsko-biala/
https://www.permanentnybielsko.com/poradnik/makijaz-permanentny-bielsko-biala-cena/
https://www.permanentnybielsko.com/poradnik/tani-makijaz-permanentny-bielsko-biala/
https://www.permanentnybielsko.com/poradnik/naturalny-makijaz-permanentny-brwi-bielsko-biala/
https://www.permanentnybielsko.com/poradnik/nieudany-makijaz-permanentny-bielsko-biala/

import type { APIRoute } from "astro";
import { siteConfig } from "../config/site";

const pages = [
  {
    path: "/",
    priority: "1.0",
    changefreq: "weekly"
  },
  {
    path: "/makijaz-permanentny-bielsko/",
    priority: "0.95",
    changefreq: "weekly"
  },
  {
    path: "/makijaz-permanentny-brwi/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/makijaz-permanentny-ust/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/makijaz-permanentny-oczu/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/usuwanie-makijazu-permanentnego/",
    priority: "0.85",
    changefreq: "monthly"
  },
  {
    path: "/cennik-makijaz-permanentny/",
    priority: "0.85",
    changefreq: "monthly"
  },
  {
    path: "/galeria/",
    priority: "0.75",
    changefreq: "monthly"
  },
  {
    path: "/szkolenie-makijaz-permanentny/",
    priority: "0.85",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/",
    priority: "0.86",
    changefreq: "weekly"
  },
    /*
    Poradnik PMU — regionalne wpisy Bielsko-Biała
  */
  {
    path: "/poradnik/makijaz-permanentny-bielsko-biala/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-brwi-bielsko-biala/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-ust-bielsko-biala/",
    priority: "0.85",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-oczu-bielsko-biala/",
    priority: "0.85",
    changefreq: "monthly"
  },

  /*
    Poradnik PMU — wpisy cenowe / Senuto
  */
  {
    path: "/poradnik/makijaz-permanentny-brwi-cena/",
    priority: "0.82",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kreska-permanentna-cena/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/odswiezenie-makijazu-permanentnego-cena/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kurs-makijazu-permanentnego-cena/",
    priority: "0.78",
    changefreq: "monthly"
  },

  /*
    Poradnik PMU — zaawansowane wpisy edukacyjne / Senuto
  */
  {
    path: "/poradnik/brwi-permanentne-dzien-po-dniu/",
    priority: "0.82",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kiedy-mozna-myc-brwi-po-makijazu-permanentnym/",
    priority: "0.79",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/czym-smarowac-brwi-po-makijazu-permanentnym/",
    priority: "0.79",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/microblading-a-makijaz-permanentny-brwi/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/metoda-piorkowa-brwi/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/laserowe-usuwanie-brwi-permanentnych/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kreska-permanentna-gojenie/",
    priority: "0.78",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/usta-permanentne-po-wygojeniu/",
    priority: "0.78",
    changefreq: "monthly"
  },

  /*
    Poradnik PMU — artykuły fundamenty
  */
  {
    path: "/poradnik/jak-przygotowac-sie-do-makijazu-permanentnego-brwi/",
    priority: "0.78",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/jak-goja-sie-brwi-permanentne/",
    priority: "0.78",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/czego-nie-wolno-po-makijazu-permanentnym-brwi/",
    priority: "0.78",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/silky-hairstroke-brows-naturalny-wlos-maszynowy/",
    priority: "0.76",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/metody-brwi-permanentnych-ombre-pudrowe-wloskowe/",
    priority: "0.77",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/rysunek-wstepny-przed-makijazem-permanentnym/",
    priority: "0.74",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kiedy-usuwac-stary-makijaz-permanentny/",
    priority: "0.74",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/nieudany-makijaz-permanentny-brwi-co-zrobic/",
    priority: "0.77",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-ust-jak-wybrac-kolor/",
    priority: "0.74",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-ust-gojenie-dzien-po-dniu/",
    priority: "0.77",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/opryszczka-a-makijaz-permanentny-ust/",
    priority: "0.75",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kreska-permanentna-jak-wybrac-rodzaj/",
    priority: "0.76",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kreska-permanentna-przy-opadajacej-powiece/",
    priority: "0.76",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/jak-wybrac-szkolenie-pmu/",
    priority: "0.7",
    changefreq: "monthly"
  },

  {
    path: "/sercemmalowane/",
    priority: "0.6",
    changefreq: "monthly"
  },
  {
    path: "/kontakt/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/regulamin-salonu/",
    priority: "0.35",
    changefreq: "yearly"
  },
  {
    path: "/rodo-polityka-prywatnosci-regulamin/",
    priority: "0.3",
    changefreq: "yearly"
  }
];

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString();

  const urls = pages
    .map((page) => {
      const loc = new URL(page.path, siteConfig.siteUrl).toString();

      return   <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>;
    })
    .join("\n");

  const body = <?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};daj mi sitemap nową v=całą

Myślał kilka sekund
Tak — wklej cały plik jako nową sitemapę. Dodałem 5 nowych wpisów po sekcji regionalnej, więc finalnie powinno być 49 pozycji.

import type { APIRoute } from "astro";
import { siteConfig } from "../config/site";

const pages = [
  {
    path: "/",
    priority: "1.0",
    changefreq: "weekly"
  },
  {
    path: "/makijaz-permanentny-bielsko/",
    priority: "0.95",
    changefreq: "weekly"
  },
  {
    path: "/makijaz-permanentny-brwi/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/makijaz-permanentny-ust/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/makijaz-permanentny-oczu/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/usuwanie-makijazu-permanentnego/",
    priority: "0.85",
    changefreq: "monthly"
  },
  {
    path: "/cennik-makijaz-permanentny/",
    priority: "0.85",
    changefreq: "monthly"
  },
  {
    path: "/galeria/",
    priority: "0.75",
    changefreq: "monthly"
  },
  {
    path: "/szkolenie-makijaz-permanentny/",
    priority: "0.85",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/",
    priority: "0.86",
    changefreq: "weekly"
  },

  /*
    Poradnik PMU — regionalne wpisy Bielsko-Biała
  */
  {
    path: "/poradnik/makijaz-permanentny-bielsko-biala/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-brwi-bielsko-biala/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-ust-bielsko-biala/",
    priority: "0.85",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-oczu-bielsko-biala/",
    priority: "0.85",
    changefreq: "monthly"
  },

  /*
    Poradnik PMU — wpisy konkurencyjne / decyzyjne Bielsko-Biała
  */
  {
    path: "/poradnik/jak-wybrac-gabinet-makijazu-permanentnego-bielsko-biala/",
    priority: "0.9",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-bielsko-biala-cena/",
    priority: "0.88",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/tani-makijaz-permanentny-bielsko-biala/",
    priority: "0.86",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/naturalny-makijaz-permanentny-brwi-bielsko-biala/",
    priority: "0.88",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/nieudany-makijaz-permanentny-bielsko-biala/",
    priority: "0.88",
    changefreq: "monthly"
  },

  /*
    Poradnik PMU — wpisy cenowe / Senuto
  */
  {
    path: "/poradnik/makijaz-permanentny-brwi-cena/",
    priority: "0.82",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kreska-permanentna-cena/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/odswiezenie-makijazu-permanentnego-cena/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kurs-makijazu-permanentnego-cena/",
    priority: "0.78",
    changefreq: "monthly"
  },

  /*
    Poradnik PMU — zaawansowane wpisy edukacyjne / Senuto
  */
  {
    path: "/poradnik/brwi-permanentne-dzien-po-dniu/",
    priority: "0.82",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kiedy-mozna-myc-brwi-po-makijazu-permanentnym/",
    priority: "0.79",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/czym-smarowac-brwi-po-makijazu-permanentnym/",
    priority: "0.79",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/microblading-a-makijaz-permanentny-brwi/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/metoda-piorkowa-brwi/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/laserowe-usuwanie-brwi-permanentnych/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kreska-permanentna-gojenie/",
    priority: "0.78",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/usta-permanentne-po-wygojeniu/",
    priority: "0.78",
    changefreq: "monthly"
  },

  /*
    Poradnik PMU — artykuły fundamenty
  */
  {
    path: "/poradnik/jak-przygotowac-sie-do-makijazu-permanentnego-brwi/",
    priority: "0.78",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/jak-goja-sie-brwi-permanentne/",
    priority: "0.78",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/czego-nie-wolno-po-makijazu-permanentnym-brwi/",
    priority: "0.78",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/silky-hairstroke-brows-naturalny-wlos-maszynowy/",
    priority: "0.76",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/metody-brwi-permanentnych-ombre-pudrowe-wloskowe/",
    priority: "0.77",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/rysunek-wstepny-przed-makijazem-permanentnym/",
    priority: "0.74",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kiedy-usuwac-stary-makijaz-permanentny/",
    priority: "0.74",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/nieudany-makijaz-permanentny-brwi-co-zrobic/",
    priority: "0.77",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-ust-jak-wybrac-kolor/",
    priority: "0.74",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/makijaz-permanentny-ust-gojenie-dzien-po-dniu/",
    priority: "0.77",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/opryszczka-a-makijaz-permanentny-ust/",
    priority: "0.75",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kreska-permanentna-jak-wybrac-rodzaj/",
    priority: "0.76",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/kreska-permanentna-przy-opadajacej-powiece/",
    priority: "0.76",
    changefreq: "monthly"
  },
  {
    path: "/poradnik/jak-wybrac-szkolenie-pmu/",
    priority: "0.7",
    changefreq: "monthly"
  },

  {
    path: "/sercemmalowane/",
    priority: "0.6",
    changefreq: "monthly"
  },
  {
    path: "/kontakt/",
    priority: "0.8",
    changefreq: "monthly"
  },
  {
    path: "/regulamin-salonu/",
    priority: "0.35",
    changefreq: "yearly"
  },
  {
    path: "/rodo-polityka-prywatnosci-regulamin/",
    priority: "0.3",
    changefreq: "yearly"
  }
];

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString();

  const urls = pages
    .map((page) => {
      const loc = new URL(page.path, siteConfig.siteUrl).toString();

      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};



