/** Editorial text library, not a replacement for demo MP3 files.
 * GPS coordinates unverified; 29 chapters are grouped into 9 listening zones.
 * Only English and Montenegrin story copy is authored in this version.
 */
export type TextChapter = {
  number: number;
  title_en: string;
  title_me: string;
  zone: string;
  en: string;
  me: string;
  sources: string[];
  targetSeconds: number;
  estimatedEnglishSeconds: number;
  estimatedMontenegrinSeconds: number;
};
export const storiesContent: TextChapter[] = [
  {
    "number": 1,
    "title_en": "Sea Gate: Welcome to Kotor",
    "title_me": "Morska vrata: dobro došli u Kotor",
    "zone": "Morska vrata",
    "en": "Welcome to Kotor. Before you cross this threshold, look up at the heavy stone arch of the Sea Gate. The entrance you see today dates from 1555, when the city was governed by Venice. Imagine approaching these walls centuries ago. The water lay much closer to the gate, and arriving in Kotor often meant arriving by boat. For a maritime town, the bay was both a highway to the wider world and a source of danger. Behind the walls, merchants, craftspeople and sailors built a life in streets you can still walk. Take a moment to notice the contrast: mountains behind you, stone ahead, and a whole city waiting on the other side. When you're ready, step through the gate.",
    "me": "Dobro došli u Kotor. Prije nego što prođete kroz ova vrata, pogledajte masivni kameni luk Morskih vrata. Današnji ulaz potiče iz 1555. godine, iz vremena mletačke uprave. Zamislite kako se gradu prilazilo prije nekoliko vjekova. More je bilo bliže vratima, a u Kotor se često stizalo brodom. Za pomorski grad zaliv je bio put prema svijetu, ali i pravac iz kojeg je mogla doći opasnost. Iza bedema trgovci, zanatlije i pomorci gradili su život u ulicama kojima i danas možete proći. Zastanite na trenutak: planine iza vas, kamen ispred vas i cijeli grad s druge strane vrata. Kada budete spremni, zakoračite unutra.",
    "sources": [
      "municipality",
      "unesco"
    ],
    "targetSeconds": 65,
    "estimatedEnglishSeconds": 53,
    "estimatedMontenegrinSeconds": 45
  },
  {
    "number": 2,
    "title_en": "Sea Gate: Signs of Changing Times",
    "title_me": "Morska vrata: tragovi različitih vremena",
    "zone": "Morska vrata",
    "en": "Stay near the Sea Gate for one more moment. Old entrances speak through small details: the curve of an arch, a carved stone, an inscription added long after the first builders had gone. Different authorities left their marks on Kotor over the centuries, and a single doorway can remind us that history is not one unbroken story. Under Venetian rule, symbols of the republic belonged to the language of public power. In more recent times, new signs and messages appeared in the city. Look carefully at what is actually visible around you, rather than rushing past. A gate does two things at once: it welcomes and it protects. Those two roles shaped life here for generations.",
    "me": "Ostanite još trenutak kod Morskih vrata. Stari ulazi govore sitnim detaljima: oblikom luka, obrađenim kamenom, natpisima dodatim mnogo kasnije. Različite vlasti ostavljale su svoje tragove u Kotoru, pa nas jedna kapija podsjeća da istorija nije jedna neprekinuta priča. U doba Mletačke republike javni simboli govorili su o vlasti i njenom autoritetu. U novijim vremenima u gradu su se pojavile i druge oznake i poruke. Pogledajte šta se zaista nalazi oko vas, bez žurbe. Gradska vrata istovremeno pozivaju i štite. Te dvije uloge vjekovima su određivale svakodnevni život ovdje.",
    "sources": [
      "municipality"
    ],
    "targetSeconds": 46,
    "estimatedEnglishSeconds": 52,
    "estimatedMontenegrinSeconds": 39
  },
  {
    "number": 3,
    "title_en": "The Walls and the Sea",
    "title_me": "Bedemi i more",
    "zone": "Morska vrata",
    "en": "Imagine the waterfront before modern traffic. Ships, ropes, barrels, voices and the smell of salt belonged to Kotor's daily rhythm. The walls were not decorative. They marked the protected edge of a trading city whose safety depended on the sea and the steep mountain above it. Kotor's fortifications were developed over many centuries, not in a single building project. Look toward the stone around the entrance and then think of the walls continuing far above the roofs. The city and its landscape were designed to work together. That relationship between human architecture, mountain and bay is one reason the wider Kotor region is recognised as World Heritage. Now move into the main square.",
    "me": "Zamislite obalu prije današnjeg saobraćaja. Brodovi, konopi, burad, glasovi i miris soli bili su dio kotorske svakodnevice. Bedemi nijesu bili ukras. Označavali su zaštićenu granicu trgovačkog grada čija je bezbjednost zavisila i od mora i od strme planine iznad njega. Kotorska utvrđenja nastajala su i mijenjala se tokom više vjekova, a ne jednim građevinskim poduhvatom. Pogledajte kamen oko ulaza, pa zamislite kako se zidovi nastavljaju visoko iznad krovova. Grad i pejzaž ovdje čine jednu cjelinu. Upravo je ta veza arhitekture, planine i zaliva jedan od razloga što je kotorsko područje upisano na Listu svjetske baštine. Sada krenite prema glavnom trgu.",
    "sources": [
      "municipality",
      "unesco"
    ],
    "targetSeconds": 56,
    "estimatedEnglishSeconds": 50,
    "estimatedMontenegrinSeconds": 44
  },
  {
    "number": 4,
    "title_en": "Square of Arms: The Heart of the Town",
    "title_me": "Trg od oružja: srce grada",
    "zone": "Trg od oružja",
    "en": "Welcome to the Square of Arms, the largest open space within Kotor's old walls. Pause in the middle and let your eyes move from one façade to the next. This square was more than a convenient place to meet friends. It belonged to the civic and military life of the town. Along one side stood the palace associated with the Venetian governor and the guard tower. Imagine the square filled with news arriving from the harbour, conversations between traders, and the movement of officials and soldiers. Today you hear café tables and travellers instead. The sounds have changed, but the square remains Kotor's natural meeting point. Before leaving, find the Clock Tower: it will be our next story.",
    "me": "Dobro došli na Trg od oružja, najveći otvoreni prostor unutar kotorskih bedema. Zastanite na sredini i pređite pogledom s jedne fasade na drugu. Ovaj trg nije služio samo za susrete. Bio je važan dio građanskog i vojnog života grada. Uz jednu njegovu stranu nalaze se palata povezana s mletačkim providurom i kula gradske straže. Zamislite vijesti koje stižu iz luke, razgovore trgovaca i kretanje činovnika i vojnika. Danas se čuju kafići i putnici iz cijelog svijeta. Zvuci su drugačiji, ali trg je ostao prirodno sastajalište Kotora. Prije nego što krenete dalje, pronađite Sat kulu: o njoj govori sljedeća priča.",
    "sources": [
      "municipality"
    ],
    "targetSeconds": 50,
    "estimatedEnglishSeconds": 52,
    "estimatedMontenegrinSeconds": 44
  },
  {
    "number": 5,
    "title_en": "The Clock Tower",
    "title_me": "Sat kula",
    "zone": "Trg od oružja",
    "en": "Look at the Clock Tower rising above the Square of Arms. The tower is generally dated to 1602, when Kotor was part of the Venetian world. Think of a time when most people did not carry a watch. Public clocks helped give structure to the day: opening shops, arranging work and meeting neighbours. In a port town, time was especially valuable. Ships and merchants followed schedules set by weather, tides, work and opportunity. The clock tower offered a common reference in the middle of the city. Notice how the tower sits among buildings from different periods. It isn't simply a monument to time; it is a witness to the changing rhythm of the town. Listen for the sounds of the square before you continue.",
    "me": "Pogledajte Sat kulu koja se uzdiže iznad Trga od oružja. Najčešće se datira u 1602. godinu, kada je Kotor pripadao mletačkom svijetu. Zamislite vrijeme u kojem većina ljudi nije imala sat u džepu. Gradski sat pomagao je da se usklade radnje, posao i susreti među komšijama. U luci je vrijeme bilo posebno važno. Brodovi i trgovci zavisili su od vremena, plime, posla i prilika za putovanje. Sat kula davala je zajedničku mjeru dana. Primijetite kako stoji među zgradama iz različitih razdoblja. Nije samo spomenik mjerenju vremena, već i svjedok promjenljivog ritma grada. Poslušajte zvuke trga prije nego što nastavite.",
    "sources": [
      "clock",
      "municipality"
    ],
    "targetSeconds": 52,
    "estimatedEnglishSeconds": 55,
    "estimatedMontenegrinSeconds": 44
  },
  {
    "number": 6,
    "title_en": "The Pillory and the Public Square",
    "title_me": "Stub srama i život na trgu",
    "zone": "Trg od oružja",
    "en": "Near the Clock Tower, notice the stone structure traditionally known as the pillory. It recalls a less comfortable part of town life: the public display of justice and punishment. Today, a square feels like a place for coffee or photographs. In earlier centuries, the same open space could communicate the authority of the town and the rules expected of its people. Imagine the effect of being brought before neighbours in the busiest place in Kotor. It was not merely a legal decision; it was a public message. This is one of the contrasts that makes a historic town so compelling. Beautiful façades can hide difficult stories. Look again at the square, and see it as a stage on which many kinds of life unfolded.",
    "me": "U blizini Sat kule nalazi se kamena građevina poznata kao stub srama. Podsjeća na manje prijatnu stranu gradskog života: javno pokazivanje kazne i autoriteta. Danas trg doživljavamo kao mjesto za kafu ili fotografiju. Nekada je isti otvoreni prostor mogao biti pozornica na kojoj su vlasti pokazivale pravila i posljedice njihovog kršenja. Zamislite kako je izgledalo kada bi nekoga doveli pred komšije, na najprometnije mjesto u gradu. To nije bila samo pravna odluka nego i javna poruka. Upravo takvi kontrasti čine istorijski grad zanimljivim. Lijepe fasade ponekad skrivaju teške priče. Pogledajte ponovo trg: na njemu su se tokom vjekova odvijale različite strane života.",
    "sources": [
      "municipality",
      "clock"
    ],
    "targetSeconds": 43,
    "estimatedEnglishSeconds": 55,
    "estimatedMontenegrinSeconds": 45
  },
  {
    "number": 7,
    "title_en": "Venetian Kotor and its Palaces",
    "title_me": "Mletački Kotor i njegove palate",
    "zone": "Trg od oružja",
    "en": "As you leave the main square, look for the façades of the old palaces. Kotor was governed by the Venetian Republic for centuries, but that did not erase its local families or its own traditions. Architecture shows this mixture clearly. The Bizanti Palace, with one face toward the Square of Arms, began in the medieval period and was reshaped after the great earthquake of 1667. Its changes tell us that a wealthy house could be rebuilt, adapted and displayed differently by each generation. Don't rush to identify every style. Instead, notice stone doorways, carefully shaped windows and family emblems. These are clues to status, craftsmanship and the lives lived behind walls that tourists usually see only from outside.",
    "me": "Dok napuštate glavni trg, obratite pažnju na pročelja starih palata. Kotor je vjekovima bio pod upravom Mletačke republike, ali to nije izbrisalo njegove porodice i lokalne tradicije. Arhitektura dobro pokazuje to preplitanje. Palata Bizanti, čija je jedna fasada okrenuta Trgu od oružja, nastala je u srednjem vijeku, a znatno je izmijenjena poslije velikog zemljotresa 1667. godine. Njena istorija govori kako se bogata kuća mogla obnavljati, prilagođavati i drugačije predstavljati novim generacijama. Ne morate odmah prepoznati svaki stil. Pogledajte kamene portale, pažljivo izrađene prozore i porodične grbove. To su tragovi ugleda, zanatskog umijeća i života koji se odvijao iza zidova.",
    "sources": [
      "municipality"
    ],
    "targetSeconds": 55,
    "estimatedEnglishSeconds": 52,
    "estimatedMontenegrinSeconds": 44
  },
  {
    "number": 8,
    "title_en": "Saint Tryphon: Patron of Kotor",
    "title_me": "Sveti Tripun: zaštitnik Kotora",
    "zone": "Katedrala Sv. Tripuna",
    "en": "You have reached the square of Saint Tryphon. Before admiring the cathedral itself, meet the saint whose name it carries. Saint Tryphon is the patron of Kotor, and his place in the city's memory is closely linked to the sea. According to a longstanding local tradition, his relics arrived here in the year 809. The story is also connected with the origins of the Boka Navy, a maritime brotherhood that continues to preserve ceremonies and traditions. Whether you approach this square as a believer or a curious traveller, it is worth recognising what a patron saint meant to a medieval community: a shared identity, a calendar of celebrations and a link between everyday life and the sacred.",
    "me": "Stigli ste na Trg Svetog Tripuna. Prije nego što pogledate samu katedralu, upoznajte sveca čije ime ona nosi. Sveti Tripun je zaštitnik Kotora, a njegovo mjesto u gradskom pamćenju tijesno je povezano s morem. Prema dugoj lokalnoj tradiciji, njegove mošti stigle su u Kotor 809. godine. Ta priča vezuje se i za početke Bokeljske mornarice, pomorske bratovštine koja i danas čuva svoje običaje i svečanosti. Bilo da na trg dolazite kao vjernik ili radoznali putnik, vrijedi razumjeti šta je svetac zaštitnik značio srednjovjekovnoj zajednici: zajednički identitet, kalendar praznika i vezu između svakodnevice i svetog.",
    "sources": [
      "municipality",
      "navy"
    ],
    "targetSeconds": 74,
    "estimatedEnglishSeconds": 52,
    "estimatedMontenegrinSeconds": 42
  },
  {
    "number": 9,
    "title_en": "A Cathedral Built Across Centuries",
    "title_me": "Katedrala koja je rasla kroz vjekove",
    "zone": "Katedrala Sv. Tripuna",
    "en": "Stand in front of the Cathedral of Saint Tryphon and look carefully at its twin towers. The cathedral was consecrated in 1166, making it one of Kotor's defining medieval monuments. But the building you see today is not an untouched picture of the twelfth century. Its original Romanesque character was changed by earthquakes, repairs and later artistic choices. Some elements reflect the Baroque period; others preserve older ideas in stone. This is the fascinating thing about historic buildings: they carry the marks of damage and recovery as well as design. Think of the skill needed to raise these walls before modern machinery. Then imagine generations of stonemasons returning to care for them. The cathedral is both a building and a long conversation across centuries.",
    "me": "Stanite ispred Katedrale Svetog Tripuna i pažljivo pogledajte njena dva zvonika. Katedrala je osveštana 1166. godine i jedan je od najvažnijih srednjovjekovnih spomenika Kotora. Ali građevina pred vama nije netaknuta slika dvanaestog vijeka. Njene prvobitne romaničke osobine mijenjali su zemljotresi, popravke i kasniji umjetnički izbori. Neki dijelovi nose obilježja baroka, a drugi čuvaju starije zamisli isklesane u kamenu. Upravo je to zanimljivo kod istorijskih građevina: u njima se vide i ljepota i tragovi oštećenja i oporavka. Zamislite vještinu potrebnu da se podignu ovi zidovi bez današnjih mašina, a zatim generacije klesara koje su im se vraćale. Katedrala je i građevina i razgovor kroz vjekove.",
    "sources": [
      "municipality"
    ],
    "targetSeconds": 70,
    "estimatedEnglishSeconds": 55,
    "estimatedMontenegrinSeconds": 46
  },
  {
    "number": 10,
    "title_en": "Earthquakes That Changed the Skyline",
    "title_me": "Zemljotresi koji su mijenjali grad",
    "zone": "Katedrala Sv. Tripuna",
    "en": "It is easy to think of Kotor as a city that has always looked exactly like this. In reality, earthquakes repeatedly forced it to change. One devastating earthquake struck the region in 1667; another, in 1979, damaged many historic monuments and sections of the fortifications. The cathedral also bears traces of repair and reconstruction. When you look at an old church or palace, you are often seeing several centuries at once: an early foundation, a later doorway, a rebuilt wall. Preservation is not the same as stopping time. It is the careful work of deciding what can be saved, repaired and passed on. The stone around you has survived not only because it was strong, but because people kept returning to restore it.",
    "me": "Lako je pomisliti da je Kotor oduvijek izgledao upravo ovako. U stvarnosti, zemljotresi su ga više puta primorali na promjene. Jedan razoran potres pogodio je ovo područje 1667. godine, a drugi je 1979. oštetio brojne spomenike i djelove utvrđenja. Tragovi popravki i obnove vide se i na katedrali. Kada posmatrate staru crkvu ili palatu, često gledate više vjekova odjednom: starije temelje, kasniji portal, obnovljeni zid. Očuvanje nasljeđa ne znači zaustavljanje vremena. To je pažljiv rad u kojem se odlučuje šta se može sačuvati, popraviti i predati narednim generacijama. Kamen oko vas opstao je ne samo zato što je čvrst, već i zato što su ljudi iznova dolazili da ga obnove.",
    "sources": [
      "municipality",
      "unesco"
    ],
    "targetSeconds": 54,
    "estimatedEnglishSeconds": 55,
    "estimatedMontenegrinSeconds": 49
  },
  {
    "number": 11,
    "title_en": "Faith, Art and the Goldsmiths",
    "title_me": "Vjera, umjetnost i kotorski zlatari",
    "zone": "Katedrala Sv. Tripuna",
    "en": "The cathedral is also a reminder that medieval Kotor was a place of skilled artists. Inside, its treasury preserves sacred objects and works associated with generations of local goldsmiths, painters and craftsmen. Among the treasured pieces is the Golden Pala, connected with the cathedral's main altar. Much of this art was created for people who understood beauty as part of religious devotion. Even if you stay outside, imagine the patience involved in shaping metal, carving stone or painting a sacred image by hand. The city grew famous for artistic traditions that reached beyond its walls and across the Adriatic. Architecture may be the most visible inheritance of Kotor, but it is not the only one. The smaller works tell equally remarkable stories.",
    "me": "Katedrala nas podsjeća i da je srednjovjekovni Kotor bio grad vještih umjetnika. U njenoj riznici čuvaju se sakralni predmeti i djela povezana s generacijama domaćih zlatara, slikara i zanatlija. Među dragocjenostima ističe se Zlatna pala, vezana za glavni oltar. Mnoga od tih djela nastala su za ljude koji su ljepotu doživljavali kao dio vjere. Čak i ako ostanete ispred katedrale, zamislite strpljenje potrebno za oblikovanje metala, klesanje kamena ili oslikavanje svete slike. Grad je postao poznat po umjetničkim tradicijama koje su se širile i preko Jadrana. Arhitektura je možda najvidljivije kotorsko nasljeđe, ali nije jedino. I mnogo manji predmeti kriju podjednako izuzetne priče.",
    "sources": [
      "municipality",
      "unesco"
    ],
    "targetSeconds": 52,
    "estimatedEnglishSeconds": 54,
    "estimatedMontenegrinSeconds": 46
  },
  {
    "number": 12,
    "title_en": "Maritime Museum: A City of Sailors",
    "title_me": "Pomorski muzej: grad pomoraca",
    "zone": "Pomorski muzej",
    "en": "Welcome to the square of the Maritime Museum. Kotor's relationship with the sea can be difficult to imagine when you're surrounded by narrow stone streets, but for centuries navigation shaped the lives of families throughout the bay. The museum grew from a collection established by the Boka Marine fraternity around 1880 and opened to the public in 1900. Its exhibits preserve the memory of voyages, ships, portraits, instruments and the people who depended on them. Some sailed far beyond the bay; others kept homes, workshops and businesses running while they were away. You don't need to go inside to appreciate the idea behind the museum: a city preserving the experience of generations who measured distance in days at sea.",
    "me": "Dobro došli na trg Pomorskog muzeja. Dok stojite među uskim kamenim ulicama, možda nije lako zamisliti koliko je more određivalo život kotorskih porodica. Vjekovima je plovidba oblikovala svakodnevicu širom Boke. Muzej je nastao iz zbirke koju je Bokeljska mornarica počela da stvara oko 1880. godine, a javnosti je otvorena 1900. godine. Njegova građa čuva sjećanje na putovanja, brodove, portrete, instrumente i ljude čiji je život zavisio od mora. Neki su plovili daleko izvan zaliva, dok su drugi održavali kuće, radionice i poslove za vrijeme njihovog odsustva. Čak i bez ulaska u muzej možete razumjeti njegovu ideju: grad želi sačuvati iskustva generacija koje su udaljenost mjerile danima provedenim na moru.",
    "sources": [
      "museum",
      "municipality"
    ],
    "targetSeconds": 68,
    "estimatedEnglishSeconds": 53,
    "estimatedMontenegrinSeconds": 48
  },
  {
    "number": 13,
    "title_en": "Grgurina Palace: Life Behind the Façade",
    "title_me": "Palata Grgurina: život iza fasade",
    "zone": "Pomorski muzej",
    "en": "Before moving on, take a closer look at the Maritime Museum's building. This is the Baroque palace of the Grgurina family, built in the eighteenth century. Its stone balconies and elegant façade speak of a household able to invest in design and craftsmanship. Kotor's palaces were not only signs of wealth. They were working homes, with rooms shaped by family life, visitors and the customs of their time. The Grgurina Palace preserves a layout influenced by Venetian domestic architecture, with a central salon and surrounding rooms. Today it holds the maritime collections, giving the building a new public purpose. Imagine the conversations once held behind those windows, and then consider the very different visitors who pass through its doors today.",
    "me": "Prije nego što krenete dalje, pažljivije pogledajte zgradu Pomorskog muzeja. To je barokna palata porodice Grgurina, podignuta u osamnaestom vijeku. Njeni kameni balkoni i elegantna fasada govore o domu u koji se ulagalo mnogo znanja i novca. Kotorske palate nijesu bile samo znak bogatstva. U njima se živjelo, primali su se gosti, vodili poslovi i poštovali običaji svoga vremena. Palata Grgurina sačuvala je raspored prostorija oblikovan pod mletačkim uticajem, sa salonom i sobama oko njega. Danas čuva pomorske zbirke i ima novu, javnu ulogu. Zamislite razgovore koji su se nekada vodili iza tih prozora, pa uporedite tadašnje stanare s današnjim posjetiocima.",
    "sources": [
      "municipality",
      "museum"
    ],
    "targetSeconds": 50,
    "estimatedEnglishSeconds": 53,
    "estimatedMontenegrinSeconds": 45
  },
  {
    "number": 14,
    "title_en": "From the Bay to the Wider World",
    "title_me": "Iz Boke prema velikom svijetu",
    "zone": "Pomorski muzej",
    "en": "Kotor sits at the end of a sheltered bay, yet its history never stopped at the shoreline. Ships connected the communities of Boka with other Adriatic ports, carrying goods, letters, news and new ideas. Navigation required more than courage. Captains needed knowledge of weather, coastlines and people; crews needed discipline and practical skill. Back home, maritime earnings helped shape the houses, churches and civic life you see around you. The bay provided protection, but it was also a doorway to the unknown. Think of a sailor leaving this calm water, then heading into the open Adriatic without modern navigation. For the families waiting ashore, every return must have carried its own mixture of relief, joy and stories.",
    "me": "Kotor se nalazi na kraju zaštićenog zaliva, ali njegova istorija nikada se nije završavala na obali. Brodovi su povezivali bokeljska mjesta s drugim jadranskim lukama, prenoseći robu, pisma, vijesti i nove ideje. Za plovidbu nije bila dovoljna samo hrabrost. Kapetani su morali poznavati vrijeme, obale i ljude, a posada je morala imati disciplinu i praktično znanje. Prihodi od pomorstva uticali su na kuće, crkve i gradski život koji vidite oko sebe. Zaliv je pružao zaklon, ali je bio i izlaz u nepoznato. Zamislite pomorca koji napušta mirnu Boku i ulazi u otvoreni Jadran bez današnje navigacije. Za porodice koje su čekale na kopnu, svaki povratak nosio je olakšanje, radost i nove priče.",
    "sources": [
      "unesco",
      "museum"
    ],
    "targetSeconds": 54,
    "estimatedEnglishSeconds": 52,
    "estimatedMontenegrinSeconds": 50
  },
  {
    "number": 15,
    "title_en": "The Boka Navy: A Living Tradition",
    "title_me": "Bokeljska mornarica: živa tradicija",
    "zone": "Pomorski muzej",
    "en": "One of Kotor's most distinctive traditions is the Boka Navy. Don't be misled by the name: today it is known above all for preserving maritime memory and ceremonial customs. Its beginnings are traditionally linked with the arrival of Saint Tryphon's relics in 809. During special celebrations, members wear historic uniforms and perform the traditional kolo dance. These customs are not simply a performance staged for visitors. They connect today's community with inherited knowledge and the shared history of the bay. In 2021, UNESCO inscribed the cultural heritage of the Boka Navy on its list of intangible heritage. Buildings can be restored stone by stone; traditions survive only when people continue to practise and pass them on.",
    "me": "Jedna od najposebnijih kotorskih tradicija jeste Bokeljska mornarica. Neka vas ime ne zavara: danas je poznata prije svega po očuvanju pomorskog pamćenja i svečanih običaja. Njeni počeci, prema tradiciji, povezuju se s dolaskom moštiju Svetog Tripuna 809. godine. Tokom posebnih proslava članovi nose istorijske uniforme i izvode tradicionalno kolo. Ti običaji nijesu samo predstava za posjetioce. Povezuju današnju zajednicu s naslijeđenim znanjem i zajedničkom prošlošću Boke. UNESCO je 2021. godine uvrstio kulturno nasljeđe Bokeljske mornarice na listu nematerijalne baštine. Građevine se mogu obnavljati kamen po kamen, ali tradicije opstaju samo kada ih ljudi nastave njegovati i prenositi dalje.",
    "sources": [
      "navy"
    ],
    "targetSeconds": 57,
    "estimatedEnglishSeconds": 52,
    "estimatedMontenegrinSeconds": 44
  },
  {
    "number": 16,
    "title_en": "The Church of Saint Luke",
    "title_me": "Crkva Svetog Luke",
    "zone": "Trg Sv. Luke",
    "en": "You've arrived at the Church of Saint Luke, a small building with a remarkable story. The inscription associated with its foundation dates the church to 1195. Its architecture brings together Romanesque and Byzantine influences, a reminder of the artistic crossroads that shaped Kotor. Compared with Saint Tryphon's Cathedral, this church may appear modest. Yet its walls preserve centuries of worship, repairs and changing customs. Look at the scale of the doorway and the proportions of the stone. This is a place that rewards close attention rather than a quick photograph. When standing here, remember that the old town is not merely an outdoor museum. Some of its historic places are still living religious spaces, and they deserve quiet and respect.",
    "me": "Stigli ste do Crkve Svetog Luke, male građevine s izuzetnom pričom. Natpis povezan s njenim nastankom datira crkvu u 1195. godinu. U arhitekturi se prepliću romanički i vizantijski uticaji, kao podsjetnik na kulturne tokove koji su oblikovali Kotor. U poređenju s Katedralom Svetog Tripuna, ova crkva djeluje skromno. Ipak, njeni zidovi čuvaju vjekove molitve, popravki i promjene običaja. Obratite pažnju na veličinu ulaza i sklad kamenih oblika. Ovo mjesto zaslužuje pažljivo posmatranje, a ne samo brzu fotografiju. Dok stojite ovdje, sjetite se da Stari grad nije samo muzej na otvorenom. Neka njegova istorijska mjesta i danas su živi vjerski prostori i zaslužuju mir i poštovanje.",
    "sources": [
      "municipality",
      "luke"
    ],
    "targetSeconds": 60,
    "estimatedEnglishSeconds": 53,
    "estimatedMontenegrinSeconds": 47
  },
  {
    "number": 17,
    "title_en": "Two Traditions Under One Roof",
    "title_me": "Dvije tradicije pod jednim krovom",
    "zone": "Trg Sv. Luke",
    "en": "The Church of Saint Luke has another extraordinary chapter. For part of its history, it served the Catholic community. In the seventeenth century it passed into Orthodox use, while a Catholic altar was retained for a period. As a result, worship associated with both traditions took place in this small church. Its story should not be simplified into a claim that everyone always lived without disagreements. History was more complicated than that. Yet the shared use of a sacred building reminds us that religious life in Kotor developed through contact, adaptation and negotiation. The church also preserves the legacy of local icon painters. A single modest building can tell us more about a city than a list of rulers ever could.",
    "me": "Crkva Svetog Luke ima još jedno izuzetno poglavlje. Tokom jednog dijela istorije služila je katoličkoj zajednici. U sedamnaestom vijeku prešla je u pravoslavnu upotrebu, dok je katolički oltar neko vrijeme ostao u crkvi. Tako su se u ovom malom prostoru odvijala bogosluženja povezana s obje tradicije. Ne treba pojednostavljivati tu priču tvrdnjom da je uvijek vladala potpuna sloga: istorija je bila složenija. Ipak, zajedničko korišćenje jednog svetog mjesta podsjeća na dodire, prilagođavanja i dogovore koji su oblikovali vjerski život Kotora. Crkva čuva i nasljeđe domaćih ikonopisaca. Jedna skromna građevina ponekad može ispričati o gradu više nego spisak njegovih vladara.",
    "sources": [
      "municipality",
      "luke"
    ],
    "targetSeconds": 53,
    "estimatedEnglishSeconds": 54,
    "estimatedMontenegrinSeconds": 44
  },
  {
    "number": 18,
    "title_en": "A Square Measured in Footsteps",
    "title_me": "Trg koji se mjeri koracima",
    "zone": "Trg Sv. Luke",
    "en": "Stop for a moment and look around Saint Luke's Square. Part of Kotor's charm lies in the way a narrow lane suddenly opens into a space like this one. The city's plan is not a perfect modern grid. Streets bend around buildings, and squares seem to appear just when you need room to breathe. Medieval Kotor was a place of churches, workshops, homes and small businesses gathered close together inside its walls. Imagine neighbours recognising one another across the square, children running between doors, and deliveries carried by hand. In a city like this, architecture creates social life as well as shelter. Try listening without speaking for a few seconds. The sounds of modern Kotor still fill spaces shaped centuries ago.",
    "me": "Zastanite i pogledajte Trg Svetog Luke. Dio kotorske ljepote krije se u načinu na koji se uska ulica odjednom otvori u prostor poput ovog. Grad nije napravljen kao savršena savremena mreža pravih ulica. Prolazi se savijaju oko zgrada, a trgovi se pojave baš kada vam zatreba malo prostora. Srednjovjekovni Kotor okupljao je crkve, radionice, kuće i male poslove na vrlo maloj površini unutar bedema. Zamislite komšije koje se pozdravljaju preko trga, djecu između vrata i robu koja se prenosi rukama. Ovdje arhitektura nije stvarala samo zaklon nego i društveni život. Poslušajte nekoliko trenutaka bez razgovora. Zvuci današnjeg Kotora još ispunjavaju prostore oblikovane prije više vjekova.",
    "sources": [
      "municipality",
      "unesco"
    ],
    "targetSeconds": 47,
    "estimatedEnglishSeconds": 54,
    "estimatedMontenegrinSeconds": 47
  },
  {
    "number": 19,
    "title_en": "Saint Nicholas: A Different Century",
    "title_me": "Sveti Nikola: drugačije stoljeće",
    "zone": "Trg Sv. Luke",
    "en": "Turn your attention to the Church of Saint Nicholas. Although it stands in a town famous for medieval churches, this building belongs to a much later period. It was completed in 1909 and has architectural features associated with the Serbian-Byzantine style. That date matters. It reminds us that historic Kotor did not stop building when the Middle Ages ended. New communities and generations continued to shape its skyline. The church is an Orthodox place of worship, and its iconostasis is part of its artistic heritage. Compare its larger forms with the smaller Church of Saint Luke nearby. Within a short walk, you can see how different centuries gave visible form to religious life. Please be respectful if services are taking place.",
    "me": "Usmjerite pogled prema Crkvi Svetog Nikole. Iako stoji u gradu poznatom po srednjovjekovnim crkvama, ova građevina pripada znatno kasnijem dobu. Završena je 1909. godine, a nosi obilježja srpsko-vizantijskog stila. Taj datum je važan: podsjeća nas da se istorijski Kotor nije prestao graditi kada je završen srednji vijek. Nove zajednice i generacije nastavile su da oblikuju izgled grada. Crkva je pravoslavna bogomolja, a ikonostas je važan dio njenog umjetničkog nasljeđa. Uporedite njene veće oblike s malom Crkvom Svetog Luke u blizini. Na svega nekoliko koraka vide se različiti vjekovi i različiti izrazi vjerskog života. Poštujte mir prostora ako je bogosluženje u toku.",
    "sources": [
      "municipality"
    ],
    "targetSeconds": 50,
    "estimatedEnglishSeconds": 54,
    "estimatedMontenegrinSeconds": 45
  },
  {
    "number": 20,
    "title_en": "The Northern Gate",
    "title_me": "Sjeverna vrata",
    "zone": "Sjeverna vrata i Škurda",
    "en": "We are approaching the northern edge of the Old Town. Unlike the main Sea Gate, this entrance reminds you that Kotor had to protect more than its waterfront. Three principal gates connect the walled town with the outside, each leading toward a different part of its surroundings. Stop where you can safely see the stonework of the Northern Gate. Imagine the practical questions that mattered to those passing through: who was arriving, what were they carrying, and could the entrance be secured quickly if danger appeared? A city gate was a point of movement, but also a place of control. Beyond it, the landscape opens up again. Before you continue, look for the water of the Škurda river beside the walls.",
    "me": "Približavamo se sjevernom rubu Starog grada. Za razliku od glavnih Morskih vrata, ovaj ulaz podsjeća da Kotor nije morao štititi samo svoju obalu. Tri glavne kapije povezuju utvrđeni grad sa spoljnim prostorom, a svaka vodi prema drugom dijelu okoline. Zastanite odakle možete bezbjedno pogledati kamen Sjevernih vrata. Zamislite praktična pitanja koja su bila važna ljudima na ulazu: ko dolazi, šta nosi i može li se prolaz brzo zatvoriti u opasnosti? Gradska vrata bila su mjesto prolaska, ali i kontrole. Iza njih se pejzaž ponovo otvara. Prije nego što nastavite, potražite vodu rijeke Škurde uz bedeme.",
    "sources": [
      "municipality"
    ],
    "targetSeconds": 45,
    "estimatedEnglishSeconds": 54,
    "estimatedMontenegrinSeconds": 42
  },
  {
    "number": 21,
    "title_en": "The Škurda River",
    "title_me": "Rijeka Škurda",
    "zone": "Sjeverna vrata i Škurda",
    "en": "Look toward the Škurda River, where flowing water meets the edge of the old fortifications. Kotor's defence was never only a matter of stone walls. The natural setting helped: mountain slopes above, the protected bay in front, and watercourses shaping the approaches to the town. This close relationship between geography and architecture is one of Kotor's defining features. Imagine standing guard here in a period when news travelled at the speed of a horse or a ship. A sudden change near the gate could mean a visitor, a delivery, or a danger that had to be checked. Today the water offers a calmer scene. Listen to it for a moment, and notice how the city turns natural features into part of its boundaries.",
    "me": "Pogledajte prema rijeci Škurdi, gdje se tekuća voda susrijeće s rubom starih utvrđenja. Odbrana Kotora nikada nije zavisila samo od kamenih zidova. Pomagao je i sam pejzaž: planinske padine iznad grada, zaštićeni zaliv ispred njega i vodotokovi koji su usmjeravali prilaze. Ta tijesna veza geografije i arhitekture jedno je od glavnih obilježja Kotora. Zamislite stražara ovdje u doba kada su vijesti putovale brzinom konja ili broda. Neočekivan dolazak mogao je značiti gosta, robu ili opasnost koju treba provjeriti. Danas voda pruža mirniju sliku. Poslušajte je na trenutak i primijetite kako je grad prirodne odlike pretvorio u dio svojih granica.",
    "sources": [
      "municipality",
      "unesco"
    ],
    "targetSeconds": 49,
    "estimatedEnglishSeconds": 55,
    "estimatedMontenegrinSeconds": 44
  },
  {
    "number": 22,
    "title_en": "The Walls That Climb the Mountain",
    "title_me": "Bedemi koji se penju uz planinu",
    "zone": "Kotorske zidine",
    "en": "Raise your eyes from the streets toward the great stone line climbing the mountain. Kotor's fortifications developed in stages from roughly the ninth to the eighteenth century. The system stretches for about four and a half kilometres, connecting the town walls with the heights above. Think of the challenge of bringing stone, tools and workers onto such steep ground. The fortress of Saint John, or San Giovanni, stands high above the old town. It is tempting to climb, but that is a separate and demanding excursion, not part of this gentle one-hour walk. For now, admire the engineering from below. These walls are not just a backdrop for photographs; they help explain how a small port could defend itself in a difficult landscape.",
    "me": "Podignite pogled sa ulica prema velikoj kamenoj liniji koja se penje uz planinu. Kotorska utvrđenja nastajala su u etapama, približno od devetog do osamnaestog vijeka. Sistem je dug oko četiri i po kilometra i povezuje gradske bedeme s visinama iznad njih. Zamislite koliko je bilo teško dopremiti kamen, alat i radnike na tako strm teren. Tvrđava Sveti Ivan, poznata i kao San Giovanni, nalazi se visoko iznad Starog grada. Uspon može biti primamljiv, ali to je poseban i zahtjevan izlet, a ne dio ove lagane jednosatne šetnje. Za sada uživajte u pogledu odozdo. Ovi zidovi nijesu samo pozadina za fotografije; objašnjavaju kako je mali lučki grad mogao da se brani u zahtjevnom pejzažu.",
    "sources": [
      "municipality",
      "unesco"
    ],
    "targetSeconds": 55,
    "estimatedEnglishSeconds": 55,
    "estimatedMontenegrinSeconds": 50
  },
  {
    "number": 23,
    "title_en": "Karampana: Where Neighbours Met",
    "title_me": "Karampana: mjesto susreta komšija",
    "zone": "Kotorske zidine",
    "en": "If you're standing by the Karampana fountain, take a moment to imagine the importance of fresh water before taps in every home. A public fountain was more than useful infrastructure. People came carrying containers, waited their turn, exchanged news and learned who had arrived in town. In a compact place like Kotor, such everyday encounters helped build a community. The sound of running water would have belonged to the music of ordinary life, alongside footsteps, church bells and market voices. Today it's easy to hurry toward the next famous façade. This little stop asks you to notice something different: history is also made of small routines repeated over generations. Look at the fountain and picture a square full of neighbours rather than visitors.",
    "me": "Ako stojite kod česme Karampane, zamislite koliko je čista voda bila važna prije slavina u svakoj kući. Javna česma nije bila samo korisna gradska oprema. Ljudi su dolazili s posudama, čekali red, razmjenjivali vijesti i saznali ko je stigao u grad. U malom prostoru poput Kotora takvi susreti održavali su zajednicu. Zvuk vode bio je dio svakodnevne gradske muzike, zajedno s koracima, zvonima i glasovima s pijace. Danas lako požurimo prema narednoj poznatoj fasadi. Ovo malo stajalište poziva nas da primijetimo nešto drugo: istoriju čine i sitne navike koje se ponavljaju generacijama. Pogledajte česmu i zamislite trg pun komšija, a ne posjetilaca.",
    "sources": [
      "karampana"
    ],
    "targetSeconds": 56,
    "estimatedEnglishSeconds": 55,
    "estimatedMontenegrinSeconds": 45
  },
  {
    "number": 24,
    "title_en": "Palaces and Family Names",
    "title_me": "Palate i porodična imena",
    "zone": "Južni dio Starog grada",
    "en": "As you head back through the older streets, notice the entrances to Kotor's historic palaces. Some display coats of arms; others reveal their age in the shape of a window or doorway. The Drago Palace, near Saint Tryphon's Square, includes Gothic elements dating from the fourteenth and fifteenth centuries. The Beskuća Palace is famous for its finely worked Gothic portal, while other residences show Renaissance and Baroque changes. Each building belonged to a family with its own ambitions, alliances and memories. The city has changed hands many times, but local surnames remain woven into the map of its architecture. Rather than see these houses as identical stone façades, imagine them as competing family portraits made with balconies, gates and carved detail.",
    "me": "Dok se vraćate kroz stare ulice, obratite pažnju na ulaze kotorskih palata. Neke nose grbove, a druge otkrivaju svoje godine oblikom prozora ili vrata. Palata Drago, blizu Trga Svetog Tripuna, čuva gotičke elemente iz četrnaestog i petnaestog vijeka. Palata Beskuća poznata je po pažljivo isklesanom gotičkom portalu, dok druge kuće pokazuju renesansne i barokne promjene. Svaka zgrada pripadala je porodici sa svojim težnjama, vezama i uspomenama. Vlasti su se u gradu mijenjale, ali su porodična imena ostala upisana u arhitekturu. Umjesto da sve ove kuće vidite kao slične kamene fasade, zamislite ih kao porodične portrete napravljene balkonima, kapijama i klesanim detaljima.",
    "sources": [
      "municipality"
    ],
    "targetSeconds": 52,
    "estimatedEnglishSeconds": 54,
    "estimatedMontenegrinSeconds": 45
  },
  {
    "number": 25,
    "title_en": "Flour Square and the Pima Palace",
    "title_me": "Pjaca od brašna i palata Pima",
    "zone": "Južni dio Starog grada",
    "en": "You are now at Flour Square, or Pjaca od brašna. The name invites you to imagine a practical town of goods, food and exchange, not only grand monuments. Look for the Pima Palace, a striking seventeenth-century residence with a graceful balcony supported by stone consoles. Its façade and the family's coat of arms made social position visible to everyone in the square. Across from it stands the Buća Palace, linked to another important Kotor family. The buildings you see have survived alterations, especially after earthquakes. Stand back far enough to compare their façades without blocking the narrow passage. This small square is a lesson in how commerce, family prestige and architecture occupied the same few metres of medieval and early modern Kotor.",
    "me": "Nalazite se na Trgu od brašna, odnosno Pjaci od brašna. Sam naziv podsjeća na praktičan grad robe, hrane i razmjene, a ne samo na velike spomenike. Pronađite palatu Pima, upečatljivu rezidenciju iz sedamnaestog vijeka, s elegantnim balkonom koji nose kamene konzole. Njena fasada i porodični grb jasno su pokazivali ugled vlasnika. Naspram nje nalazi se palata Buća, vezana za još jednu važnu kotorsku porodicu. Zgrade koje gledate mijenjale su se tokom vremena, naročito poslije zemljotresa. Odmaknite se dovoljno da možete uporediti fasade, ali ne zaklanjajte uski prolaz. Ovaj mali trg pokazuje kako su trgovina, porodični ugled i arhitektura dijelili nekoliko istih metara starog Kotora.",
    "sources": [
      "municipality"
    ],
    "targetSeconds": 52,
    "estimatedEnglishSeconds": 54,
    "estimatedMontenegrinSeconds": 46
  },
  {
    "number": 26,
    "title_en": "Craftspeople Who Shaped the City",
    "title_me": "Zanatlije koje su oblikovale grad",
    "zone": "Južni dio Starog grada",
    "en": "Not everyone who left a mark on Kotor belonged to a noble family. Think of the stonemasons who carved doorframes, the smiths who worked iron balconies, the goldsmiths who made objects for churches, and the painters whose work filled sacred spaces. Medieval Kotor developed respected traditions of masonry and art. Many of these makers remain anonymous to visitors, yet their hands are all around you. Look at a single carefully shaped stone or a metal railing. Someone planned it, measured it and spent hours perfecting it. A city is not built only by rulers who order construction. It is built by skilled people whose everyday work becomes another generation's cultural heritage. Give these less visible authors of Kotor a moment of your attention.",
    "me": "Nijesu samo plemićke porodice ostavile trag u Kotoru. Pomislite na klesare koji su oblikovali portale, kovače koji su izrađivali balkonske ograde, zlatare koji su stvarali predmete za crkve i slikare čija su djela ukrašavala svete prostore. Srednjovjekovni Kotor razvio je ugledne tradicije graditeljstva i umjetnosti. Imena mnogih majstora današnjim posjetiocima nijesu poznata, ali su njihovi tragovi svuda oko vas. Pogledajte jedan pažljivo obrađen kamen ili metalnu ogradu. Neko ih je osmislio, izmjerio i satima usavršavao. Grad ne grade samo vladari koji izdaju naređenja. Grade ga i vješti ljudi čiji svakodnevni rad postaje kulturno nasljeđe narednih generacija. Posvetite trenutak i tim manje vidljivim autorima Kotora.",
    "sources": [
      "municipality",
      "unesco"
    ],
    "targetSeconds": 40,
    "estimatedEnglishSeconds": 55,
    "estimatedMontenegrinSeconds": 46
  },
  {
    "number": 27,
    "title_en": "Kotor's Cats and Everyday Life",
    "title_me": "Kotorske mačke i svakodnevni život",
    "zone": "Južni dio Starog grada",
    "en": "There is one group of Kotor residents you may have noticed everywhere: the cats. They rest on warm stone, watch people from doorways and stroll through squares as though the whole town belongs to them. Over time they have become unofficial mascots of Kotor. A popular story says that sailors brought cats on ships to help control rodents. It is a charming explanation, but its exact origins are difficult to prove, so treat it as local lore rather than a certain fact. Today's cats depend partly on the care of local people and animal-welfare volunteers. Enjoy watching them, let them choose whether to approach, and avoid giving them unsuitable food. The city's character is made not only of monuments, but of the lives sharing its streets.",
    "me": "Postoji jedna grupa kotorskih stanovnika koju ste vjerovatno već primijetili: mačke. Odmaraju se na toplom kamenu, posmatraju prolaznike s pragova i šetaju trgovima kao da je cijeli grad njihov. Vremenom su postale nezvanični simbol Kotora. Prema popularnoj priči, pomorci su ih dovodili na brodovima kako bi lovile glodare. To je lijepo objašnjenje, ali se njegovo tačno porijeklo teško može dokazati, pa ga treba shvatiti kao lokalno predanje. Današnje mačke dijelom zavise od brige mještana i volontera koji se bave zaštitom životinja. Posmatrajte ih, pustite ih da same odluče hoće li vam prići i nemojte im davati neprimjerenu hranu. Karakter grada ne čine samo spomenici, nego i životi koji dijele njegove ulice.",
    "sources": [
      "cats"
    ],
    "targetSeconds": 48,
    "estimatedEnglishSeconds": 56,
    "estimatedMontenegrinSeconds": 49
  },
  {
    "number": 28,
    "title_en": "The Earthquake of 1979 and Recovery",
    "title_me": "Zemljotres 1979. i obnova",
    "zone": "Završetak ture",
    "en": "Before our walk ends, return in your imagination to 15 April 1979. A powerful earthquake struck the Montenegrin coast, badly damaging buildings, monuments and sections of Kotor's historic fabric. The Maritime Museum was among the buildings affected. That same year, the Natural and Culturo-Historical Region of Kotor was added to the UNESCO World Heritage List. The restoration that followed required years of patient work, expertise and international support. What you have been walking through is therefore not merely ancient stone: it is also the result of modern care. In some places, the most important historical story is the decision not to give up on a damaged building. The survival of the old town is something people actively worked to achieve.",
    "me": "Prije kraja šetnje vratimo se u mislima na 15. april 1979. godine. Snažan zemljotres pogodio je crnogorsko primorje i teško oštetio zgrade, spomenike i djelove istorijskog Kotora. Među pogođenim građevinama bio je i Pomorski muzej. Te iste godine prirodno i kulturno-istorijsko područje Kotora upisano je na UNESCO Listu svjetske baštine. Obnova koja je uslijedila zahtijevala je godine strpljivog rada, stručnosti i međunarodne podrške. Zato ono kroz šta ste danas prolazili nije samo stari kamen: to je i rezultat savremene brige. Ponekad je najvažnija istorijska priča odluka da se od oštećene građevine ne odustane. Opstanak Starog grada nešto je na čemu su ljudi svjesno i uporno radili.",
    "sources": [
      "unesco",
      "museum"
    ],
    "targetSeconds": 60,
    "estimatedEnglishSeconds": 53,
    "estimatedMontenegrinSeconds": 47
  },
  {
    "number": 29,
    "title_en": "Kotor Today: The Story Continues",
    "title_me": "Kotor danas: priča se nastavlja",
    "zone": "Završetak ture",
    "en": "Our walk is coming to an end, but Kotor's story is still being written. Today the old town welcomes people from around the world. Behind the cafés, photographs and famous squares, however, it is also a place of neighbours, work, ceremonies and ordinary daily routines. The walls, churches and palaces tell stories of centuries past. The Boka Navy's living traditions remind us that heritage is something people do, not only something they preserve behind glass. Think back to the Sea Gate where we began. You have crossed squares shaped by trade, faith, craftsmanship, disaster and recovery. Before you leave, take one quiet look around. The best way to thank a historic city is to experience it with curiosity and treat it with care. Thank you for walking with Kotor Stories.",
    "me": "Naša šetnja privodi se kraju, ali se priča o Kotoru i dalje piše. Danas Stari grad dočekuje ljude iz cijelog svijeta. Iza kafića, fotografija i poznatih trgova, on je ipak i mjesto komšija, rada, svečanosti i sasvim obične svakodnevice. Bedemi, crkve i palate pričaju o prošlim vjekovima. Žive tradicije Bokeljske mornarice podsjećaju da nasljeđe nije samo nešto što čuvamo iza stakla, već i nešto što ljudi nastavljaju da rade. Prisjetite se Morskih vrata na kojima smo počeli. Prošli ste trgovima koje su oblikovali trgovina, vjera, zanatstvo, razaranja i obnova. Prije odlaska još jednom mirno pogledajte oko sebe. Najljepši način da zahvalite istorijskom gradu jeste da ga upoznate radoznalo i da se prema njemu odnosite pažljivo. Hvala što ste šetali uz Kotor Stories.",
    "sources": [
      "unesco",
      "navy"
    ],
    "targetSeconds": 70,
    "estimatedEnglishSeconds": 58,
    "estimatedMontenegrinSeconds": 54
  }
];
