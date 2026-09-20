import type { GuideMedia, GuidePhoto } from "./guide-series-01";
// Wymiana wyłącznie zdjęć widocznych w artykułach. Istniejące meta i schema pozostają bez zmian.
import photo1 from "../../public/images/galeria-10/silky/silky-03.webp";
import photo2 from "../../public/images/galeria-10/cien/cien-02.webp";
import photo3 from "../../public/images/galeria-10/cien/cien-06.webp";
import photo4 from "../../public/images/galeria-10/cien/cien-04.webp";
import photo5 from "../../public/images/galeria-10/silky/silky-04.webp";
import photo6 from "../../public/images/galeria-10/cien/cien-10.webp";
import photo7 from "../../public/images/galeria-10/cien/cien-12.webp";
import photo8 from "../../public/images/galeria-10/silky/silky-08.webp";
import photo9 from "../../public/images/galeria-10/silky/silky-11.webp";
import photo10 from "../../public/images/galeria-10/silky/silky-06.webp";
import photo11 from "../../public/images/galeria-10/oczy/oczy-03.webp";
import photo12 from "../../public/images/galeria-10/cien/cien-08.webp";
import photo13 from "../../public/images/galeria-10/usta/usta-08.webp";
import photo14 from "../../public/images/galeria-10/silky/silky-17.webp";
import photo15 from "../../public/images/galeria-10/usta/usta-09.webp";
import photo16 from "../../public/images/galeria-10/silky/silky-19.webp";
import photo17 from "../../public/images/galeria-10/cien/cien-15.webp";
import photo18 from "../../public/images/galeria-10/silky/silky-07.webp";
import photo19 from "../../public/images/galeria-10/silky/silky-02.webp";
import photo20 from "../../public/images/galeria-10/cien/cien-05.webp";
import photo21 from "../../public/images/galeria-10/silky/silky-01.webp";
import photo22 from "../../public/images/galeria-10/silky/silky-05.webp";
import photo23 from "../../public/images/galeria-10/silky/silky-13.webp";
import photo24 from "../assets/poradnik/korekta-19/brwi-stary-pigment-ocena-przed-korekta.webp";
import photo25 from "../../public/images/szkolenia-pmu-praktyka-zabiegowa-long-time-liner.webp";
import photo26 from "../../public/images/galeria-10/oczy/oczy-10.webp";
import photo27 from "../../public/images/galeria-10/silky/silky-12.webp";
import photo28 from "../../public/images/galeria-10/usta/usta-13.webp";
import photo29 from "../../public/images/galeria-10/silky/silky-10.webp";
import photo30 from "../../public/images/galeria-10/silky/silky-14.webp";
import photo31 from "../../public/images/galeria-10/silky/silky-15.webp";
import photo32 from "../../public/images/galeria-10/silky/silky-16.webp";
import photo33 from "../../public/images/galeria-10/silky/silky-20.webp";
import photo34 from "../../public/images/galeria-10/cien/cien-16.webp";
import photo35 from "../../public/images/galeria-10/cien/cien-07.webp";
import photo36 from "../../public/images/galeria-10/usta/usta-26.webp";
import photo37 from "../../public/images/szkolenia-pmu-praktyka-zabieg-poziom.webp";
import photo38 from "../../public/images/brwi-permanentne-konsultacja.webp";
import photo39 from "../../public/images/galeria-10/cien/cien-11.webp";
import photo40 from "../assets/poradnik/korekta-19/brwi-wyblakly-cieply-pigment.webp";
import photo41 from "../../public/images/galeria-10/cien/cien-13.webp";

const photos: Record<string, GuidePhoto> = {
  "silky-03": { src: photo1, alt: "Detal brwi Silky Hairstroke Brows z widocznymi kreskami imitującymi włoski", caption: "Silky Hairstroke Brows — włos maszynowy widoczny w zbliżeniu.", kind: "gallery" },
  "cien-02": { src: photo2, alt: "Brew wykonana metodą cienia z łagodnym przejściem nasycenia przy początku", caption: "Metoda cienia — łagodne przejście nasycenia przy początku brwi, charakterystyczne dla efektu ombre.", kind: "gallery" },
  "cien-06": { src: photo3, alt: "Brew wykonana metodą cienia z równomiernym pudrowym wypełnieniem", caption: "Pudrowe cieniowanie — wypełnienie kolorem zamiast rysunku pojedynczych włosków.", kind: "gallery" },
  "cien-04": { src: photo4, alt: "Metoda cienia — pigmentacja w zbliżeniu — praca gabinetu Bogusława Herda", caption: "Metoda cienia — pigmentacja w zbliżeniu.", kind: "gallery" },
  "silky-04": { src: photo5, alt: "Silky — włos maszynowy w zbliżeniu — praca gabinetu Bogusława Herda", caption: "Silky — włos maszynowy w zbliżeniu.", kind: "gallery" },
  "cien-10": { src: photo6, alt: "Metoda cienia — spojrzenie i proporcje — praca gabinetu Bogusława Herda", caption: "Metoda cienia — spojrzenie i proporcje.", kind: "gallery" },
  "cien-12": { src: photo7, alt: "Metoda cienia — miękki początek brwi — praca gabinetu Bogusława Herda", caption: "Metoda cienia — miękki początek brwi.", kind: "gallery" },
  "silky-08": { src: photo8, alt: "Zbliżenie brwi wykonanej metodą włosa maszynowego Silky Hairstroke Brows", caption: "Włos maszynowy Silky — wyraźnie widoczny rysunek pojedynczych włosków.", kind: "gallery" },
  "silky-11": { src: photo9, alt: "Silky — włos maszynowy w zbliżeniu — praca gabinetu Bogusława Herda", caption: "Silky — włos maszynowy w zbliżeniu.", kind: "gallery" },
  "silky-06": { src: photo10, alt: "Silky — włos maszynowy w zbliżeniu — praca gabinetu Bogusława Herda", caption: "Silky — włos maszynowy w zbliżeniu.", kind: "gallery" },
  "oczy-03": { src: photo11, alt: "Kreska — miękkie podkreślenie spojrzenia — praca gabinetu Bogusława Herda", caption: "Kreska — miękkie podkreślenie spojrzenia.", kind: "gallery" },
  "cien-08": { src: photo12, alt: "Metoda cienia — brwi w szerszym kadrze — praca gabinetu Bogusława Herda", caption: "Metoda cienia — brwi w szerszym kadrze.", kind: "gallery" },
  "usta-08": { src: photo13, alt: "Czerwień — kształt i kontur — praca gabinetu Bogusława Herda", caption: "Czerwień — kształt i kontur.", kind: "gallery" },
  "silky-17": { src: photo14, alt: "Okolica oczu i brwi Silky w ujęciu z zielonymi trawami na pierwszym planie", caption: "Brwi Silky Hairstroke Brows w szerszym ujęciu spojrzenia.", kind: "gallery" },
  "usta-09": { src: photo15, alt: "Róż — równomierne podkreślenie — praca gabinetu Bogusława Herda", caption: "Róż — równomierne podkreślenie.", kind: "gallery" },
  "silky-19": { src: photo16, alt: "Twarz kobiety z jasnymi włosami i brwiami podkreślonymi metodą Silky", caption: "Brwi i proporcje twarzy — praca Silky Hairstroke Brows.", kind: "gallery" },
  "cien-15": { src: photo17, alt: "Metoda cienia — kształt i nasycenie — praca gabinetu Bogusława Herda", caption: "Metoda cienia — kształt i nasycenie.", kind: "gallery" },
  "silky-07": { src: photo18, alt: "Silky — włos maszynowy w zbliżeniu — praca gabinetu Bogusława Herda", caption: "Silky — włos maszynowy w zbliżeniu.", kind: "gallery" },
  "silky-02": { src: photo19, alt: "Silky — włos maszynowy w zbliżeniu — praca gabinetu Bogusława Herda", caption: "Silky — włos maszynowy w zbliżeniu.", kind: "gallery" },
  "cien-05": { src: photo20, alt: "Metoda cienia — kontur brwi — praca gabinetu Bogusława Herda", caption: "Metoda cienia — kontur brwi.", kind: "gallery" },
  "silky-01": { src: photo21, alt: "Brew wykonana metodą włosa maszynowego nad niebieskim okiem", caption: "Silky Hairstroke Brows — przykład włosa maszynowego, odrębnego od ręcznego microbladingu.", kind: "gallery" },
  "silky-05": { src: photo22, alt: "Silky — włos maszynowy w zbliżeniu — praca gabinetu Bogusława Herda", caption: "Silky — włos maszynowy w zbliżeniu.", kind: "gallery" },
  "silky-13": { src: photo23, alt: "Silky — brwi w szerszym kadrze — praca gabinetu Bogusława Herda", caption: "Silky — brwi w szerszym kadrze.", kind: "gallery" },
  "old-grey": { src: photo24, alt: "Brwi z delikatnym szarobrązowym śladem dawnej pigmentacji", caption: "Stary pigment w okolicy brwi — przykład do omówienia przed korektą lub usuwaniem.", kind: "illustration" },
  "practice-portrait": { src: photo25, alt: "Bogusława Herda w maseczce i rękawiczkach podczas pracy w okolicy brwi", caption: "Praca w okolicy brwi w gabinecie Bogusława Herda.", kind: "gallery" },
  "oczy-10": { src: photo26, alt: "Górna kreska — zbliżenie brązowego oka — praca gabinetu Bogusława Herda", caption: "Górna kreska — zbliżenie brązowego oka.", kind: "gallery" },
  "silky-12": { src: photo27, alt: "Silky — brwi w szerszym kadrze — praca gabinetu Bogusława Herda", caption: "Silky — brwi w szerszym kadrze.", kind: "gallery" },
  "usta-13": { src: photo28, alt: "Czerwień — usta w szerszym kadrze — praca gabinetu Bogusława Herda", caption: "Czerwień — usta w szerszym kadrze.", kind: "gallery" },
  "silky-10": { src: photo29, alt: "Niebieskie oko i brew z rysunkiem włosków Silky Hairstroke Brows", caption: "Włos maszynowy Silky — przykład techniki maszynowej w porównaniu metod.", kind: "gallery" },
  "silky-14": { src: photo30, alt: "Silky — brwi w szerszym kadrze — praca gabinetu Bogusława Herda", caption: "Silky — brwi w szerszym kadrze.", kind: "gallery" },
  "silky-15": { src: photo31, alt: "Silky — brwi w szerszym kadrze — praca gabinetu Bogusława Herda", caption: "Silky — brwi w szerszym kadrze.", kind: "gallery" },
  "silky-16": { src: photo32, alt: "Twarz kobiety z krótkimi jasnymi włosami i naturalnie podkreślonymi brwiami", caption: "Silky Hairstroke Brows — naturalny efekt brwi dopasowanych do twarzy.", kind: "gallery" },
  "silky-20": { src: photo33, alt: "Silky — kompozycja portretu i zbliżeń — praca gabinetu Bogusława Herda", caption: "Silky — kompozycja portretu i zbliżeń.", kind: "gallery" },
  "cien-16": { src: photo34, alt: "Metoda cienia — profil brwi — praca gabinetu Bogusława Herda", caption: "Metoda cienia — profil brwi.", kind: "gallery" },
  "cien-07": { src: photo35, alt: "Metoda cienia — wykończenie łuku brwiowego — praca gabinetu Bogusława Herda", caption: "Metoda cienia — wykończenie łuku brwiowego.", kind: "gallery" },
  "usta-26": { src: photo36, alt: "Ciepły odcień — detal ust — praca gabinetu Bogusława Herda", caption: "Ciepły odcień — detal ust.", kind: "gallery" },
  "practice-wide": { src: photo37, alt: "Pigmentacja brwi w gabinecie: linergistka w maseczce i rękawiczkach", caption: "Precyzyjna praca w okolicy brwi z użyciem urządzenia do pigmentacji.", kind: "gallery" },
  "consultation": { src: photo38, alt: "Bogusława Herda podczas pracy urządzeniem do pigmentacji w okolicy brwi", caption: "Pigmentacja brwi w gabinecie Bogusława Herda.", kind: "gallery" },
  "cien-11": { src: photo39, alt: "Cieniowana brew nad przymkniętym okiem", caption: "Metoda cienia — równomierne nasycenie i wyraźny kształt brwi.", kind: "gallery" },
  "old-warm": { src: photo40, alt: "Okolica brwi z jasnym, ciepłym śladem pigmentu pod naturalnymi włoskami", caption: "Wyblakły pigment w ciepłym odcieniu pod naturalnymi włoskami brwi.", kind: "illustration" },
  "cien-13": { src: photo41, alt: "Zbliżenie łuku brwiowego z widoczną pigmentacją metodą cienia", caption: "Metoda cienia — kolor pigmentacji i naturalne włoski w zbliżeniu.", kind: "gallery" },
};

export const guidePhotoUpdates: Record<string, GuideMedia> = {
  "metody-brwi-permanentnych-ombre-pudrowe-wloskowe": { cover: photos["silky-03"], photos: [photos["cien-02"], photos["cien-06"]], label: "Porównanie efektów: włos maszynowy i cień" },
  "brwi-permanentne-dzien-po-dniu": { cover: photos["cien-04"], photos: [photos["silky-04"]], label: "Zdjęcia z galerii gabinetu" },
  "kiedy-mozna-myc-brwi-po-makijazu-permanentnym": { cover: photos["cien-10"], photos: [photos["cien-12"]], label: "Zdjęcia z galerii gabinetu" },
  "czy-kazda-skora-nadaje-sie-do-metody-wloskowej": { cover: photos["silky-08"], photos: [photos["silky-11"], photos["silky-06"]], label: "Włos maszynowy — przykłady Silky" },
  "makijaz-permanentny-bielsko-biala": { cover: photos["oczy-03"], photos: [photos["cien-08"], photos["usta-08"]], label: "Zdjęcia z galerii gabinetu" },
  "jak-dlugo-utrzymuje-sie-makijaz-permanentny": { cover: photos["silky-17"], photos: [photos["usta-09"]], label: "Zdjęcia z galerii gabinetu" },
  "botoks-a-makijaz-permanentny-brwi": { cover: photos["silky-19"], photos: [photos["cien-15"]], label: "Zdjęcia z galerii gabinetu" },
  "makijaz-permanentny-brwi-cena": { cover: photos["silky-07"], photos: [photos["silky-02"], photos["cien-05"]], label: "Zdjęcia z galerii gabinetu" },
  "metoda-piorkowa-brwi": { cover: photos["silky-01"], photos: [photos["silky-05"], photos["silky-13"]], label: "Włos maszynowy — przykłady Silky" },
  "laserowe-usuwanie-brwi-permanentnych": { cover: photos["old-grey"], photos: [photos["practice-portrait"]], label: "Zdjęcia z galerii gabinetu" },
  "makijaz-permanentny-bielsko-biala-cena": { cover: photos["oczy-10"], photos: [photos["silky-12"], photos["usta-13"]], label: "Zdjęcia z galerii gabinetu" },
  "microblading-a-makijaz-permanentny-brwi": { cover: photos["silky-10"], photos: [photos["silky-14"], photos["silky-15"]], label: "Włos maszynowy — przykłady Silky" },
  "naturalny-makijaz-permanentny-brwi-bielsko-biala": { cover: photos["silky-16"], photos: [photos["silky-20"], photos["cien-16"]], label: "Zdjęcia z galerii gabinetu" },
  "odswiezenie-makijazu-permanentnego-cena": { cover: photos["cien-07"], photos: [photos["usta-26"]], label: "Zdjęcia z galerii gabinetu" },
  "makijaz-permanentny-a-rezonans-magnetyczny-mri": { cover: photos["practice-wide"], photos: [photos["consultation"]], label: "Zdjęcia z galerii gabinetu" },
  "nieudany-makijaz-permanentny-bielsko-biala": { cover: photos["old-grey"], photos: [photos["cien-11"]], label: "Zdjęcia z galerii gabinetu" },
  "dlaczego-makijaz-permanentny-zmienia-kolor": { cover: photos["old-warm"], photos: [photos["cien-13"]], label: "Zdjęcia z galerii gabinetu" },
};
