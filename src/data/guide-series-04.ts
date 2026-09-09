import type { GuideMedia, GuidePhoto } from "./guide-series-01";
import image0 from "../assets/poradnik/seria-04/brwi-higiena.png";
import image1 from "../assets/poradnik/seria-04/brwi01.webp";
import image2 from "../assets/poradnik/seria-04/brwi02.webp";
import image3 from "../assets/poradnik/seria-04/brwi05.webp";
import image4 from "../assets/poradnik/seria-04/pielegnacja-spokojna.png";
import image5 from "../assets/poradnik/seria-04/brwi12.webp";
import image6 from "../assets/poradnik/seria-04/brwi-tekstura-skory.png";
import image7 from "../assets/poradnik/seria-04/brwi06.webp";
import image8 from "../assets/poradnik/seria-04/brwi17.webp";
import image9 from "../assets/poradnik/seria-04/usta05.webp";
import image10 from "../assets/poradnik/seria-04/usta07.webp";
import image11 from "../assets/poradnik/seria-04/usta08.webp";
import image12 from "../assets/poradnik/seria-04/kosmetyki-planowanie.png";
import image13 from "../assets/poradnik/seria-04/brwi09.webp";
import image14 from "../assets/poradnik/seria-04/konsultacja-telefon.png";
import image15 from "../assets/poradnik/seria-04/brwi-skora-dojrzala.png";
import image16 from "../assets/poradnik/seria-04/gabinet04.webp";
import image17 from "../assets/poradnik/seria-04/oczy03.webp";
import image18 from "../assets/poradnik/seria-04/oczy01.webp";
import image19 from "../assets/poradnik/seria-04/oczy04.webp";
import image20 from "../assets/poradnik/seria-04/gabinet28.webp";
import image21 from "../assets/poradnik/seria-04/brwi07.webp";
import image22 from "../assets/poradnik/seria-04/ruch-planowanie.png";
import image23 from "../assets/poradnik/seria-04/brwi16.webp";
import image24 from "../assets/poradnik/seria-04/brwi10.webp";
import image25 from "../assets/poradnik/seria-04/gabinet31.webp";
import image26 from "../assets/poradnik/seria-04/brwi04.webp";
import image27 from "../assets/poradnik/seria-04/gabinet18.webp";
import image28 from "../assets/poradnik/seria-04/brwi08.webp";
import image29 from "../assets/poradnik/seria-04/brwi14.webp";
import image30 from "../assets/poradnik/seria-04/gabinet21.webp";
import image31 from "../assets/poradnik/seria-04/gabinet20.webp";
import image32 from "../assets/poradnik/seria-04/gabinet26.webp";
import image33 from "../assets/poradnik/seria-04/oczy06.webp";
import image34 from "../assets/poradnik/seria-04/kreska-nowa-twarz.png";
import image35 from "../assets/poradnik/seria-04/oczy02.webp";
import image36 from "../assets/poradnik/seria-04/oczy05.webp";
const photos: Record<string, GuidePhoto> = {
"brwi-higiena": { src: image0, alt: "Spokojna codzienna higiena. Pielęgnację po pigmentacji ustalamy indywidualnie.", caption: "Spokojna codzienna higiena. Pielęgnację po pigmentacji ustalamy indywidualnie.", kind: "illustration" },
"brwi01": { src: image1, alt: "Delikatne podkreślenie brwi i naturalna oprawa oczu.", caption: "Delikatne podkreślenie brwi i naturalna oprawa oczu.", kind: "gallery" },
"brwi02": { src: image2, alt: "Detal brwi: gęstość włosków, kierunek i zaznaczenie kształtu.", caption: "Detal brwi: gęstość włosków, kierunek i zaznaczenie kształtu.", kind: "gallery" },
"brwi05": { src: image3, alt: "Praca przy pigmentacji brwi w gabinecie.", caption: "Praca przy pigmentacji brwi w gabinecie.", kind: "gallery" },
"pielegnacja-spokojna": { src: image4, alt: "Delikatność i prostota pielęgnacji. Konkretny preparat dobiera gabinet.", caption: "Delikatność i prostota pielęgnacji. Konkretny preparat dobiera gabinet.", kind: "illustration" },
"brwi12": { src: image5, alt: "Detal brwi: cienkie linie, włoski i budowanie kształtu.", caption: "Detal brwi: cienkie linie, włoski i budowanie kształtu.", kind: "gallery" },
"brwi-tekstura-skory": { src: image6, alt: "Brwi i naturalna struktura skóry w zbliżeniu. Warunki pigmentacji są indywidualne.", caption: "Brwi i naturalna struktura skóry w zbliżeniu. Warunki pigmentacji są indywidualne.", kind: "illustration" },
"brwi06": { src: image7, alt: "Makrofotografia włosków brwi i faktury skóry.", caption: "Makrofotografia włosków brwi i faktury skóry.", kind: "gallery" },
"brwi17": { src: image8, alt: "Brwi i oczy w jednym kadrze — materiał z galerii gabinetu.", caption: "Brwi i oczy w jednym kadrze — materiał z galerii gabinetu.", kind: "gallery" },
"usta05": { src: image9, alt: "Malinowy odcień ust — materiał z galerii gabinetu.", caption: "Malinowy odcień ust — materiał z galerii gabinetu.", kind: "gallery" },
"usta07": { src: image10, alt: "Cieplejszy odcień czerwieni i kształt ust.", caption: "Cieplejszy odcień czerwieni i kształt ust.", kind: "gallery" },
"usta08": { src: image11, alt: "Różowy odcień z nutą brązu i połysk na ustach.", caption: "Różowy odcień z nutą brązu i połysk na ustach.", kind: "gallery" },
"kosmetyki-planowanie": { src: image12, alt: "Kosmetyki i terminy pielęgnacji warto omówić przed wizytą.", caption: "Kosmetyki i terminy pielęgnacji warto omówić przed wizytą.", kind: "illustration" },
"brwi09": { src: image13, alt: "Brwi i kierunek włosków widziane z boku.", caption: "Brwi i kierunek włosków widziane z boku.", kind: "gallery" },
"konsultacja-telefon": { src: image14, alt: "Wątpliwości dotyczące pigmentacji warto omówić z gabinetem.", caption: "Wątpliwości dotyczące pigmentacji warto omówić z gabinetem.", kind: "illustration" },
"brwi-skora-dojrzala": { src: image15, alt: "Dojrzała twarz, naturalna struktura skóry i miękko zaznaczone brwi.", caption: "Dojrzała twarz, naturalna struktura skóry i miękko zaznaczone brwi.", kind: "illustration" },
"gabinet04": { src: image16, alt: "Bogusława Herda w gabinecie — rozmowa o oczekiwaniach i możliwościach.", caption: "Bogusława Herda w gabinecie — rozmowa o oczekiwaniach i możliwościach.", kind: "gallery" },
"oczy03": { src: image17, alt: "Subtelna pigmentacja przy górnej linii rzęs.", caption: "Subtelna pigmentacja przy górnej linii rzęs.", kind: "gallery" },
"oczy01": { src: image18, alt: "Delikatne podkreślenie górnej powieki z cienkim zakończeniem kreski.", caption: "Delikatne podkreślenie górnej powieki z cienkim zakończeniem kreski.", kind: "gallery" },
"oczy04": { src: image19, alt: "Podkreślenie górnej powieki widziane z boku.", caption: "Podkreślenie górnej powieki widziane z boku.", kind: "gallery" },
"gabinet28": { src: image20, alt: "Praca przy zabiegu PMU w szerszym ujęciu.", caption: "Praca przy zabiegu PMU w szerszym ujęciu.", kind: "gallery" },
"brwi07": { src: image21, alt: "Łuk brwiowy i okolica oka w zbliżeniu.", caption: "Łuk brwiowy i okolica oka w zbliżeniu.", kind: "gallery" },
"ruch-planowanie": { src: image22, alt: "Planowanie aktywności w kalendarzu zabiegu i gojenia.", caption: "Planowanie aktywności w kalendarzu zabiegu i gojenia.", kind: "illustration" },
"brwi16": { src: image23, alt: "Zbliżenie łuku brwiowego i oprawy oka.", caption: "Zbliżenie łuku brwiowego i oprawy oka.", kind: "gallery" },
"brwi10": { src: image24, alt: "Brwi jako część naturalnej oprawy twarzy.", caption: "Brwi jako część naturalnej oprawy twarzy.", kind: "gallery" },
"gabinet31": { src: image25, alt: "Bogusława Herda — portret w jasnym wnętrzu.", caption: "Bogusława Herda — portret w jasnym wnętrzu.", kind: "gallery" },
"brwi04": { src: image26, alt: "Oprawa oczu i kształt brwi widziane z bliska.", caption: "Oprawa oczu i kształt brwi widziane z bliska.", kind: "gallery" },
"gabinet18": { src: image27, alt: "Bogusława Herda — powrót do natury.", caption: "Bogusława Herda — powrót do natury.", kind: "gallery" },
"brwi08": { src: image28, alt: "Kształt brwi w proporcjach całej twarzy.", caption: "Kształt brwi w proporcjach całej twarzy.", kind: "gallery" },
"brwi14": { src: image29, alt: "Praca w gabinecie przy pigmentacji okolicy brwi.", caption: "Praca w gabinecie przy pigmentacji okolicy brwi.", kind: "gallery" },
"gabinet21": { src: image30, alt: "Bogusława Herda i edukacja w makijażu permanentnym.", caption: "Bogusława Herda i edukacja w makijażu permanentnym.", kind: "gallery" },
"gabinet20": { src: image31, alt: "Bogusława Herda podczas wręczenia certyfikatu szkoleniowego.", caption: "Bogusława Herda podczas wręczenia certyfikatu szkoleniowego.", kind: "gallery" },
"gabinet26": { src: image32, alt: "Praktyczna część szkolenia PMU: praca przy klientce.", caption: "Praktyczna część szkolenia PMU: praca przy klientce.", kind: "gallery" },
"oczy06": { src: image33, alt: "Praca przy pigmentacji powieki w gabinecie.", caption: "Praca przy pigmentacji powieki w gabinecie.", kind: "gallery" },
"kreska-nowa-twarz": { src: image34, alt: "Górna kreska z miękkim zakończeniem dopasowana do oprawy oczu.", caption: "Górna kreska z miękkim zakończeniem dopasowana do oprawy oczu.", kind: "illustration" },
"oczy02": { src: image35, alt: "Wyraźniejsza górna kreska z miękkim cieniowaniem.", caption: "Wyraźniejsza górna kreska z miękkim cieniowaniem.", kind: "gallery" },
"oczy05": { src: image36, alt: "Miękkie cieniowanie i wyraźniejsza oprawa górnej powieki.", caption: "Miękkie cieniowanie i wyraźniejsza oprawa górnej powieki.", kind: "gallery" },
};
export const guideMedia: Record<string, GuideMedia> = {
"kiedy-mozna-myc-brwi-po-makijazu-permanentnym": { cover: photos["brwi-higiena"], photos: [photos["brwi01"]], label: "Zdjęcia i ilustracje do poradnika" },
"dopigmentowanie-brwi-permanentnych": { cover: photos["brwi02"], photos: [photos["brwi05"]], label: "Zdjęcia i ilustracje do poradnika" },
"czym-smarowac-brwi-po-makijazu-permanentnym": { cover: photos["pielegnacja-spokojna"], photos: [photos["brwi12"]], label: "Zdjęcia i ilustracje do poradnika" },
"makijaz-permanentny-na-bliznie": { cover: photos["brwi-tekstura-skory"], photos: [photos["brwi06"]], label: "Zdjęcia i ilustracje do poradnika" },
"czego-nie-wolno-po-makijazu-permanentnym-brwi": { cover: photos["brwi17"], photos: [photos["pielegnacja-spokojna"]], label: "Zdjęcia i ilustracje do poradnika" },
"makijaz-permanentny-ust-cena": { cover: photos["usta05"], photos: [photos["usta07"], photos["usta08"]], label: "Zdjęcia i ilustracje do poradnika" },
"retinol-kwasy-a-makijaz-permanentny": { cover: photos["kosmetyki-planowanie"], photos: [photos["brwi09"]], label: "Zdjęcia i ilustracje do poradnika" },
"reakcja-alergiczna-czy-normalne-gojenie-po-pmu": { cover: photos["konsultacja-telefon"], photos: [photos["pielegnacja-spokojna"]], label: "Zdjęcia i ilustracje do poradnika" },
"brwi-permanentne-po-latach": { cover: photos["brwi-skora-dojrzala"], photos: [photos["gabinet04"]], label: "Zajrzyj do gabinetu" },
"kreska-zageszczajaca-linie-rzes": { cover: photos["oczy03"], photos: [photos["oczy01"], photos["oczy04"]], label: "Zdjęcia i ilustracje do poradnika" },
"botoks-a-makijaz-permanentny-brwi": { cover: photos["brwi09"], photos: [photos["gabinet28"]], label: "Zajrzyj do gabinetu" },
"brwi-permanentne-dzien-po-dniu": { cover: photos["brwi01"], photos: [photos["brwi02"]], label: "Zdjęcia i ilustracje do poradnika" },
"czy-kazda-skora-nadaje-sie-do-metody-wloskowej": { cover: photos["brwi07"], photos: [photos["brwi06"], photos["brwi12"]], label: "Zdjęcia i ilustracje do poradnika" },
"czy-makijaz-permanentny-boli": { cover: photos["gabinet28"], photos: [photos["gabinet04"]], label: "Zajrzyj do gabinetu" },
"czy-mozna-cwiczyc-po-makijazu-permanentnym": { cover: photos["ruch-planowanie"], photos: [photos["kosmetyki-planowanie"]], label: "Zdjęcia i ilustracje do poradnika" },
"dlaczego-brwi-permanentne-sa-ciemne-po-zabiegu": { cover: photos["brwi16"], photos: [photos["brwi17"]], label: "Zdjęcia i ilustracje do poradnika" },
"dlaczego-makijaz-permanentny-zmienia-kolor": { cover: photos["brwi10"], photos: [photos["gabinet31"]], label: "Zajrzyj do gabinetu" },
"dlaczego-pigment-po-wygojeniu-miejscami-znika": { cover: photos["brwi04"], photos: [photos["brwi05"]], label: "Zdjęcia i ilustracje do poradnika" },
"jak-dlugo-utrzymuje-sie-makijaz-permanentny": { cover: photos["gabinet18"], photos: [photos["brwi08"]], label: "Zdjęcia i ilustracje do poradnika" },
"jak-przygotowac-sie-do-makijazu-permanentnego-brwi": { cover: photos["brwi14"], photos: [photos["gabinet04"]], label: "Zajrzyj do gabinetu" },
"jak-wybrac-gabinet-makijazu-permanentnego-bielsko-biala": { cover: photos["gabinet31"], photos: [photos["gabinet21"]], label: "Zajrzyj do gabinetu" },
"jak-wybrac-szkolenie-pmu": { cover: photos["gabinet20"], photos: [photos["gabinet26"]], label: "Zajrzyj do gabinetu" },
"kiedy-usuwac-stary-makijaz-permanentny": { cover: photos["gabinet04"], photos: [photos["brwi-skora-dojrzala"]], label: "Zdjęcia i ilustracje do poradnika" },
"kreska-permanentna-gojenie": { cover: photos["oczy04"], photos: [photos["oczy06"]], label: "Zdjęcia i ilustracje do poradnika" },
"kreski-permanentne-cieniowane": { cover: photos["kreska-nowa-twarz"], photos: [photos["oczy02"], photos["oczy05"]], label: "Zdjęcia i ilustracje do poradnika" },
};
