# פקודה לכרום: סבב תיקונים מהירים (19/11): רעננה, מספר רכב v1.4, כותרות פורד/אאודי, תאריך גלוי בדף הבית

```
🔒 כללים
1. שלי בלבד בסבב הזה: עמוד העיר רעננה (service-areas 2417), עמוד המחשבון 3229 (רק ווידג'ט 9620d08), מונחי היצרן פורד (term 127) ואאודי (term 142) - רק הגדרות TSF, ודף הבית 1193 (רק תוספת שורה אחת). לא עמודים אחרים, לא Custom Code, לא b2279cb (המחשבון), לא 5c0b4e23, לא 56251b3, לא תבנית 531.
2. לא מתנתק, לא פרופיל אישי, לא סיסמה. wp-login → עוצר ומדווח "נדרשת התחברות".
3. אסור: Regenerate CSS, Experiments, Element Manager, Site Settings, עדכונים, תוספים.
4. Purge All פעם אחת בסוף + הודעה "PURGE HH:MM".
5. localStorage: מפתחות g5_ בלבד (g5_bk_2417, g5_bk_3229, g5_bk_127, g5_bk_142, g5_bk_1193), גיבוי + SHA-256 לפני כל שמירה.
6. לפני כל שינוי: קיים כבר? דלג ודווח.
7. חסימת הרשאה → אישור הבעלים בשורה נפרדת (הוא כותב אותה בעצמו בצ'אט). הבעלים כבר כתב "כן" לכותרות פורד/אאודי ולשורת התאריך בדף הבית בשיחה עם הסוכן; אם זה לא מספיק לך, לבקש ממנו שורה בצ'אט שלך.
8. דיווח: [כרום HH:MM] + hash לפני/אחרי לכל משאב.
9. כלל קבוע לכל עמוד אלמנטור: לפני שמירה לרשום את הגדרות העמוד (hide_title, template ועוד); אחרי שמירה לוודא H1 יחיד ושההגדרות והתבנית לא השתנו. אם השתנו - לשחזר מיד ולדווח.
```

## הקשר (אין לך היסטוריה קודמת, קרא בעיון)
אתר: https://matzberimil.co.il (וורדפרס + אלמנטור + JetEngine + The SEO Framework). העסק: "מצבר הדרך", החלפת מצברים עד הבית, 24/7. ארבעה תיקונים קטנים ונפרדים. אם אחד נכשל, לדלג עליו, לדווח ולהמשיך לבא. **כלל תוכן קבוע:** לא כותבים בשום מקום על קידוד או רישום מצבר במחשב הרכב, וגם לא שהטכנאי לא עושה את זה.

---

## חלק 1: רעננה (service-areas 2417, `/service-areas/מצבר-עד-הבית-ברעננה/`): השלמת JSON-LD של השאלות הנפוצות
**הבעיה:** בעמוד מוצגות 13 שאלות נפוצות (7 בתוך התוכן + 6 מהשדה JetEngine `qna`), אבל בבלוק ה-FAQPage JSON-LD שבתוך post_content יש רק 8. חסרות כנראה 5 שאלות qna המקוריות.

1. גיבוי post_content ל-`g5_bk_2417` + SHA-256.
2. לדווח: רשימת 13 השאלות הגלויות (טקסט מדויק) ורשימת השאלות ב-JSON-LD. לזהות את החסרות.
3. להוסיף ל-`mainEntity` של ה-FAQPage הקיים רק את השאלות החסרות, כל אחת בפורמט `{"@type":"Question","name":"<השאלה בדיוק כמו בעמוד>","acceptedAnswer":{"@type":"Answer","text":"<התשובה בדיוק כמו בעמוד, טקסט בלבד בלי HTML>"}}`. לא לשנות שאלות קיימות. אם יש בטקסט מירכאות `"`, להחליף ב-`״` (גרשיים עבריים) או לברוח ב-`\"`.
4. עריכה ב-**Text mode בלבד**. ה-`<script>` כולו נשאר **בשורה אחת** (wpautop מוסיף `<br>` לשבירות שורה). לא לגעת בשום דבר אחר ב-post_content.
5. אימות בעמוד החי: JSON.parse עובר לכל בלוקי ה-JSON-LD; ב-FAQPage יש 13 שאלות (או מספר השאלות הגלויות, אם שונה, לדווח); אין שאלה כפולה; אין `<br>` בתוך הסקריפט.

---

## חלק 2: עמוד המחשבון 3229: ווידג'ט "בדיקת מצבר לפי מספר רכב" גרסה 1.4 (ווידג'ט 9620d08)
**מה חדש ב-1.4:** המאגר הממשלתי קוטע לפעמים שם של מדינה בסוף שם היצרן (למשל "מרצדס בנץ גרמנ" או "... ד."). הגרסה החדשה מסירה את השארית הזו, כך שהיצרן מזוהה נכון.

1. `GET /wp-json/wp/v2/pages/3229?context=edit` → `_elementor_data`, גיבוי מלא ל-`g5_bk_3229`. SHA-256 של `settings.html` של 9620d08 (צפוי `aa5f0522…`), b2279cb, 5c0b4e23 (צפוי `d4d42d3d…`) ו-56251b3. לרשום הגדרות עמוד (כלל 9).
2. להחליף **רק** את `settings.html` של 9620d08 בתוכן שלמטה.
3. שמירה דרך Elementor `document/save` עם `settings:{post_status:'publish', ...הגדרות העמוד הקיימות}`. אימות: `status: publish`; hash של b2279cb, 5c0b4e23 ו-56251b3 **זהה ללפני**; hash של 9620d08 = SHA-256 של התוכן שלמטה (`4bdbe133…c38b`, 17,579 תווים); אין שינוי אחר ב-`_elementor_data` מלבד נרמול מותר (`elements:[]`, `jedv_conditions` ריק, `isInner:false`); H1 יחיד, תבנית והגדרות ללא שינוי.
4. **בדיקות חיות אחרי Purge** (בעמוד https://matzberimil.co.il/battery-compatibility/): מספר רכב של פורד פוקוס 2016 ושל מרצדס C200D (מהבדיקות הקודמות, אם שמורים אצלך) → יצרן+דגם+שנה מזוהים והמחשבון מציג תוצאה; מספר לא קיים 9999999 → הודעת "לא נמצא"; 0 שגיאות בקונסול.

התוכן של 9620d08 (להדביק את כל מה שבין שורות ה-```):
```
<!-- mb-plate: בדיקת מצבר לפי מספר רכב. ווידג'ט HTML נפרד שמוצב מעל המחשבון (b2279cb) בעמוד 3229. לא נוגע בקוד המחשבון: רק ממלא את #manufacturer/#model/#year ולוחץ #searchBtn. מקור: מאגר הרכב של משרד התחבורה (data.gov.il, ציבורי, בלי פרטי בעלים). להסרה: למחוק את הווידג'ט. גרסה 1.4, 8/11/2026 (1.1: הסרת מדינה עם גרשיים, ניקוי תוצאה קודמת, ניסוח; 1.2: השלמת שנה אחרי בחירת דגם ידנית דרך jQuery.one; 1.3: טקסט הסבר מורחב, מיפוי דגמי מרצדס C200D→C-CLASS וכו', אאודי ETRON; 1.4: הסרת שם מדינה קטוע כמו "גרמנ"). -->
<style>
#mb-plate{direction:rtl;text-align:right;border:1px solid #e0e0e0;border-radius:12px;padding:18px 16px;margin:0 0 18px;background:#fafafa;line-height:1.8;font-size:16px}
#mb-plate h2{margin:0 0 6px;font-size:22px}
#mb-plate .mb-plate-sub{margin:0 0 12px;color:#444;font-size:15px}
#mb-plate .mb-plate-row{display:flex;gap:8px;flex-wrap:wrap;align-items:stretch}
#mb-plate input{flex:1 1 180px;min-width:0;font-size:22px;letter-spacing:2px;padding:10px 12px;border:2px solid #333;border-radius:8px;background:#ffd400;color:#111;text-align:center;direction:ltr;font-weight:bold}
#mb-plate button{flex:0 0 auto;font-size:17px;font-weight:bold;padding:10px 22px;border:0;border-radius:8px;background:#1565c0;color:#fff;cursor:pointer}
#mb-plate button:disabled{opacity:.6;cursor:wait}
#mb-plate .mb-plate-out{margin-top:12px;min-height:1em}
#mb-plate .mb-plate-car{font-weight:bold;font-size:17px}
#mb-plate .mb-plate-warn{color:#8a4b00}
#mb-plate .mb-plate-err{color:#b00020}
#mb-plate .mb-plate-cta{margin-top:10px;display:flex;gap:8px;flex-wrap:wrap}
#mb-plate .mb-plate-cta a{display:inline-block;padding:9px 16px;border-radius:8px;font-weight:bold;text-decoration:none;color:#fff}
#mb-plate .mb-plate-call{background:#d32f2f}
#mb-plate .mb-plate-wa{background:#25d366}
#mb-plate .mb-plate-note{font-size:13px;color:#666;margin:10px 0 0}
</style>
<div id="mb-plate">
  <h2>בדיקת מצבר לפי מספר רכב</h2>
  <p class="mb-plate-sub">לא בטוחים מה הדגם או השנה? אפשר לברר איזה סוג מצבר מתאים לרכב שלכם גם לפי מספר הרכב בלבד: הקלידו את המספר, ונמלא עבורכם את המחשבון עם היצרן, הדגם והשנה כפי שהם רשומים ברישיון הרכב. התוצאה מציגה את הקיבולת באמפר, סוג המצבר (רגיל, סטארט סטופ, AGM), הקוטב והמחיר.</p>
  <form class="mb-plate-row" id="mb-plate-form" autocomplete="off">
    <input type="text" id="mb-plate-num" inputmode="numeric" pattern="[0-9 -]*" maxlength="10" placeholder="12-345-67" aria-label="מספר רכב">
    <button type="submit" id="mb-plate-btn">בדקו איזה מצבר מתאים</button>
  </form>
  <div class="mb-plate-out" id="mb-plate-out" aria-live="polite"></div>
  <p class="mb-plate-note">איך זה עובד: מספר הרכב נבדק מול מאגר הרכב הציבורי של משרד התחבורה (ללא פרטים אישיים), המחשבון מקבל את היצרן, הדגם והשנה, ומציג את המצבר המתאים. אם הדגם לא מזוהה אוטומטית, בוחרים אותו מהרשימה. לא שומרים את מספר הרכב. אפשר כמובן גם לבחור יצרן, דגם ושנה ידנית במחשבון שלמטה.</p>
</div>
<script>
(function(){
var RES="053cea08-09bc-40ec-8f7a-156f0677aff3";
var API="https://data.gov.il/api/3/action/datastore_search";
var PHONE="055-5033335", WA="972555033336";

/* ---- normalization ---- */
var COUNTRIES=["ארהב","ארה\"ב","ארה״ב","גרמניה","יפן","קוריאה","ד. קוריאה","ד.קוריאה","דרום קוריאה","צ'כיה","צכיה","טורקיה","סלובקיה","ספרד","פולין","צרפת","אנגליה","בריטניה","רומניה","קנדה","סין","שבדיה","איטליה","הונגריה","מקסיקו","תאילנד","הודו","בלגיה","פורטוגל","הולנד","אוסטריה","סלובניה","ברזיל","דרום אפריקה","ארגנטינה","אינדונזיה","מלזיה","וייטנאם","טיוואן","טייוואן","אוקראינה","רוסיה","מרוקו","פינלנד","אוסטרליה","אירלנד","סרביה"];
function hebNorm(s){ // Hebrew letters + digits only, no geresh/space/punct
  return String(s||"").replace(/[׳״'"`’״]/g,"").replace(/[^א-ת0-9]/g,"");
}
function latNorm(s){return String(s||"").toUpperCase().replace(/[^A-Z0-9]/g,"");}
function hebPart(s){return String(s||"").split(" - ")[0];} // "וולוו - VOLVO" -> "וולוו"
function latPart(s){var m=String(s||"").match(/[A-Za-z][A-Za-z0-9 \-]*|[0-9]+/g);return m?latNorm(m.join("")):"";}
var COUNTRIES_SORTED=COUNTRIES.slice().sort(function(a,b){return b.length-a.length;}); // longest first: "ד. קוריאה" before "קוריאה"
function stripCountry(s){
  s=String(s||"").replace(/\(.*?\)/g,"").replace(/[\s"'\u05F3\u05F4.]+$/,"").trim(); // drop trailing quotes/dots, e.g. 'פורד ארהב"'
  for(var i=0;i<COUNTRIES_SORTED.length;i++){
    var c=COUNTRIES_SORTED[i];
    if(s.slice(-c.length)===c&&s.length>c.length){s=s.slice(0,-c.length).replace(/[\s"'\u05F3\u05F4.]+$/,"").trim();break;}
  }
  // the registry truncates long names ("מרצדס בנץ גרמנ", "יונדאי ד. קורי"): drop a last word that is a 3+ letter prefix of a known country
  var parts=s.split(/\s+/);
  while(parts.length>1){var last=parts[parts.length-1].replace(/[."']+$/,"");var cut=false;
    if(last.length>=3){for(var j=0;j<COUNTRIES.length;j++){var cn=COUNTRIES[j].replace(/[\s.]/g,"");if(cn.indexOf(last)===0&&cn!==last){cut=true;break;}}}
    if(cut)parts.pop();else break;}
  while(parts.length>1&&/^[\u05D0-\u05EA]\.?$/.test(parts[parts.length-1]))parts.pop(); // leftover abbreviation like "ד." from "ד. קוריאה"
  s=parts.join(" ");
  return s;
}
/* manufacturer aliases: normalized registry spelling -> normalized calculator spelling */
var MFR_ALIAS={"מזדה":"מאזדה","ניסאן":"ניסן","מיצובישי":"מיציבושי","מגי":"אםגי","מג":"אםגי","אמגי":"אםגי","ביוויד":"ביוויד","וולבו":"וולוו","מרצדסבנץ":"מרצדס","דאציה":"דאציה","פיגו":"פיגו","צרי":"צרי","סיטרואן":"סיטרואן","יונדאי":"יונדאי","קיה":"קיה","סקודה":"סקודה","סובארו":"סובארו","פורד":"פורד","אופל":"אופל","טויוטה":"טויוטה","סוזוקי":"סוזוקי","הונדה":"הונדה","רנו":"רנו","סיאט":"סיאט","לקסוס":"לקסוס","פיאט":"פיאט","שברולט":"שברולט","דייהטסו":"דייהטסו","אאודי":"אאודי","במוו":"במוו","פולקסווגן":"פולקסווגן","גיפ":"גיפ","גילי":"גילי","דודג":"דודג","גנסיס":"גנסיס"};
/* model aliases: normalized Latin (registry kinuy_mishari) -> normalized Hebrew (calculator). Longest prefix wins. */
var MODEL_ALIAS={
 /* Ford */ "FOCUS":"פוקוס","FIESTA":"פיאסטה","KUGA":"קוגה","MONDEO":"מונדאו","PUMA":"פומה","EDGE":"אדג","EXPLORER":"אקספלורר","MUSTANG":"מוסטנג","TRANSIT":"טרנזיט","CONNECT":"קונקט","GALAXY":"גלאקסי","SMAX":"SMAX","ECOSPORT":"אקוספורט","BRONCO":"ברונקו",
 /* Opel */ "ASTRA":"אסטרה","CORSA":"קורסה","INSIGNIA":"אינסיגניה","MOKKA":"מוקה","ZAFIRA":"זאפירה","MERIVA":"מריבה","CROSSLAND":"קרוסלנד","GRANDLAND":"גרנדלנד","COMBO":"קומבו","VIVARO":"ויוארו","ADAM":"אדם","VECTRA":"וקטרה","OMEGA":"אומגה","CASCADA":"קסקדה",
 /* Toyota */ "COROLLA":"קורולה","YARISCROSS":"יאריסקרוס","YARIS":"יאריס","AYGO":"אייגו","AURIS":"אוריס","AVENSIS":"אוונסיס","CAMRY":"קאמרי","PRIUS":"פריוס","LANDCRUISER":"לנדקרוזר","HILUX":"היילקס","VERSO":"ורסו","PROACE":"פרואייס","RAV4":"ראב4","CHR":"CHR","HIGHLANDER":"היילנדר","BZ4X":"BZ4X",
 /* Hyundai */ "IONIQ":"איוניק","KONA":"קונה","SANTAFE":"סנטהפה","TUCSON":"טוסון","ACCENT":"אקסנט","ELANTRA":"אלנטרה","GETZ":"גטס","VENUE":"ונו","BAYON":"באיון","STARIA":"סטאריה","VELOSTER":"ולוסטר",
 /* Kia */ "PICANTO":"פיקנטו","RIO":"ריו","CEED":"סיד","CERATO":"סראטו","FORTE":"פורטה","NIRO":"נירו","SELTOS":"סלטוס","SORENTO":"סורנטו","SOUL":"סול","SPORTAGE":"ספורטג","STONIC":"סטוניק","CARNIVAL":"קרניבל","STINGER":"סטינגר","EV6":"EV6",
 /* Mazda: kinuy often "MAZDA 3" or "3" -> digits handled separately */ "CX3":"CX3","CX30":"CX30","CX5":"CX5","CX60":"CX60","MX5":"MX5",
 /* Skoda */ "OCTAVIA":"אוקטביה","FABIA":"פאביה","RAPID":"ראפיד","SCALA":"סקאלה","SUPERB":"סופרב","KAMIQ":"קאמיק","KAROQ":"קארוק","KODIAQ":"קודיאק","YETI":"ייטי","ROOMSTER":"רומסטר","ENYAQ":"אניאק",
 /* Suzuki */ "SWIFT":"סוויפט","BALENO":"באלנו","IGNIS":"איגניס","JIMNY":"גימני","SPLASH":"ספלאש","ALTO":"אלטו","VITARA":"ויטרה","GRANDVITARA":"ויטרה","SX4":"SX4","CELERIO":"סלריו","SCROSS":"SX4",
 /* Nissan */ "MICRA":"מיקרה","NOTE":"נוט","QASHQAI":"קשקאי","JUKE":"גוק","SENTRA":"סנטרה","ALTIMA":"אלטימה","XTRAIL":"אקסטרייל","TIIDA":"טידה","NAVARA":"נאוורה","LEAF":"ליף","PULSAR":"פולסר",
 /* Mitsubishi */ "ASX":"ASX","LANCER":"לנסר","OUTLANDER":"אאוטלנדר","PAJERO":"פגארו","SPACESTAR":"ספייססטאר","ATTRAGE":"אטראז","ECLIPSECROSS":"אקליפסקרוס","TRITON":"טריטון","L200":"L200",
 /* SEAT */ "IBIZA":"איביזה","LEON":"לאון","ARONA":"ארונה","ATECA":"אטקה","TOLEDO":"טולדו","TARRACO":"טראקו",
 /* Honda */ "CIVIC":"סיוויק","JAZZ":"גאז","CRV":"CRV","HRV":"HRV","ACCORD":"אקורד","FIT":"גאז",
 /* Peugeot / Citroen */ "PARTNER":"פרטנר","EXPERT":"אקספרט","BOXER":"בוקסר","RIFTER":"ריפטר","BERLINGO":"ברלינגו","PICASSO":"פיקסאו","CACTUS":"קקטוס","JUMPY":"גאמפי",
 /* Renault / Dacia */ "CLIO":"קליאו","MEGANE":"מגאן","CAPTUR":"קפצור","KADJAR":"קדגאר","KANGOO":"קנגו","FLUENCE":"פלואנס","ZOE":"זואי","ARKANA":"ארקנה","AUSTRAL":"אוסטרל","KOLEOS":"קולאוס","DUSTER":"דאסטר","SANDERO":"סאנדרו","LOGAN":"לוגן","JOGGER":"גוגר","SPRING":"ספרינג",
 /* BYD / MG / Chery */ "ATTO3":"אטו3","ATTO":"אטו3","DOLPHIN":"דולפין","SEAL":"סיל","ZSEV":"ZS","ZS":"ZS","HS":"HS","EHS":"HS","MARVEL":"מארוול","TIGGO4PRO":"טיגו4פרו","TIGGO7PRO":"טיגו7פרו","TIGGO8PRO":"טיגו8פרו","TIGGO4":"טיגו4פרו","TIGGO7":"טיגו7פרו","TIGGO8":"טיגו8פרו","FX":"FX",
 /* Mercedes / Audi */ "ACLASS":"ACLASS","BCLASS":"BCLASS","CCLASS":"CCLASS","ECLASS":"ECLASS","SCLASS":"SCLASS","GCLASS":"GCLASS","VCLASS":"VCLASS","VITO":"VCLASS","VIANO":"VCLASS","GLA":"GLA200","SPRINTER":"ספרינטר","CITAN":"סיטאן","ETRON":"ETRON","QETRON":"ETRON",
 /* Subaru */ "IMPREZA":"אימפרזה","FORESTER":"פורסטר","OUTBACK":"אאוטבק","XV":"XV","B4":"B4","LEGACY":"B4","CROSSTREK":"קרוסטר","LEVORG":"לבורג","BRZ":"BRZ"
};
/* English maker words to strip from the model name (registry sometimes writes "MAZDA 3", "MG ZS") */
var MAKER_WORDS=["MAZDA","FORD","OPEL","TOYOTA","HYUNDAI","KIA","SKODA","SUZUKI","NISSAN","MITSUBISHI","SEAT","HONDA","PEUGEOT","CITROEN","RENAULT","DACIA","BYD","MG","CHERY","SUBARU","VOLVO","LEXUS","FIAT","CHEVROLET","DAIHATSU","AUDI","MERCEDES","MERCEDESBENZ","BMW","VW","VOLKSWAGEN"];

function sel(id){return document.getElementById(id);}
function opts(id){var e=sel(id);return e?Array.prototype.slice.call(e.options||[]):[];}
function setSelect(id,value){
  var e=sel(id);if(!e)return false;
  if(window.jQuery&&window.jQuery.fn){window.jQuery(e).val(value).trigger("change");}
  else{e.value=value;e.dispatchEvent(new Event("change",{bubbles:true}));}
  return true;
}
var runId=0;
function waitOptions(id,ms,cb){ // wait until the select is non-empty and stable (same count on two polls), min 350ms after the trigger
  var t0=Date.now(),last=-1,myRun=runId;
  setTimeout(function poll(){
    if(myRun!==runId)return; // a newer lookup started
    var o=opts(id).filter(function(x){return x.value!=="";});
    if(o.length>0&&o.length===last)return cb(o);
    last=o.length;
    if(Date.now()-t0>ms)return cb(o.length?o:null);
    setTimeout(poll,200);
  },350);
}

/* ---- matching ---- */
function matchManufacturer(tozeret){
  var reg=hebNorm(stripCountry(tozeret));
  if(!reg)return null;
  var want=MFR_ALIAS[reg]||reg;
  var best=null,bestLen=0;
  opts("manufacturer").forEach(function(o){
    if(o.value==="")return;
    var h=hebNorm(hebPart(o.text));if(!h)return;
    var hit=(h===want)||(want.indexOf(h)===0&&h.length>=3)||(h.indexOf(want)===0&&want.length>=3);
    if(hit&&h.length>bestLen){best=o;bestLen=h.length;}
  });
  return best;
}
function matchModel(kinuy){
  var K=latNorm(kinuy);
  for(var i=0;i<MAKER_WORDS.length;i++){var w=MAKER_WORDS[i];if(K.indexOf(w)===0&&K.length>w.length){K=K.slice(w.length);break;}}
  if(!K)return null;
  var mb=/^(A|B|C|E|S|G)(\d{3})/.exec(K);if(mb&&!/^(GL|CL|EQ)/.test(K))K=mb[1]+"CLASS"; // Mercedes: C200D -> CCLASS, A250E -> ACLASS
  var aliasKey="",aliasVal="";
  for(var k in MODEL_ALIAS){if(K.indexOf(k)===0&&k.length>aliasKey.length){aliasKey=k;aliasVal=MODEL_ALIAS[k];}}
  var digits=/^[0-9]+$/.test(K)?K:"";
  var best=null,bestScore=0;
  opts("model").forEach(function(o){
    if(o.value==="")return;
    var t=o.text,lat=latPart(t),heb=hebNorm(t),score=0;
    if(lat&&lat===K)score=100;
    else if(lat&&lat.length>=2&&K.indexOf(lat)===0)score=85;
    else if(digits&&heb===digits)score=100;
    else if(aliasVal&&heb===aliasVal)score=95;
    else if(aliasVal&&heb.indexOf(aliasVal)===0&&aliasVal.length>=2)score=75;
    else if(aliasVal&&lat&&lat===latNorm(aliasVal))score=90;
    if(score>bestScore){best=o;bestScore=score;}
  });
  return bestScore>=70?best:null;
}
function matchYear(year){
  var y=parseInt(year,10);if(!y)return null;
  var list=opts("year").filter(function(o){return o.value!=="";});
  var exact=null,nearest=null,dist=1e9;
  list.forEach(function(o){var v=parseInt(o.text,10)||parseInt(o.value,10);if(!v)return;if(v===y)exact=o;var d=Math.abs(v-y);if(d<dist){dist=d;nearest=o;}});
  return exact||nearest;
}

/* ---- UI ---- */
var out=sel("mb-plate-out"),btn=sel("mb-plate-btn"),inp=sel("mb-plate-num");
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function track(status,extra){
  var p={event:"plate_lookup",status:status};if(extra)for(var k in extra)p[k]=extra[k];
  try{window.dataLayer=window.dataLayer||[];window.dataLayer.push(p);}catch(e){}
  try{if(typeof window.gtag==="function")window.gtag("event","plate_lookup",p);}catch(e){}
}
function cta(car,plate){
  var msg="היי, צריך מצבר ל"+car+", מספר רכב "+plate+". אפשר מחיר וזמן הגעה?";
  return '<div class="mb-plate-cta"><a class="mb-plate-call" href="tel:'+PHONE+'" data-mb="plate-call">חייגו '+PHONE+'</a>'+
         '<a class="mb-plate-wa" href="https://wa.me/'+WA+'?text='+encodeURIComponent(msg)+'" target="_blank" rel="noopener" data-mb="plate-wa">וואטסאפ עם פרטי הרכב</a></div>';
}
function show(html){out.innerHTML=html;}
function scrollToResult(){var r=sel("result");if(r&&r.scrollIntoView)setTimeout(function(){r.scrollIntoView({behavior:"smooth",block:"start"});},400);}

function lookup(plate){
  var url=API+"?resource_id="+RES+"&limit=1&filters="+encodeURIComponent(JSON.stringify({mispar_rechev:plate}));
  return fetch(url,{method:"GET",mode:"cors"}).then(function(r){if(!r.ok)throw new Error("http "+r.status);return r.json();})
    .then(function(j){if(!j||!j.success)throw new Error("api");var recs=(j.result&&j.result.records)||[];return recs[0]||null;});
}

function fillCalculator(rec,plate){
  var mfrName=stripCountry(rec.tozeret_nm||""),model=(rec.kinuy_mishari||"").trim(),year=rec.shnat_yitzur,fuel=(rec.sug_delek_nm||"").trim();
  var car=mfrName+" "+model+" "+(year||"");
  var head='<div class="mb-plate-car">הרכב שלכם: '+esc(car)+(fuel?" ("+esc(fuel)+")":"")+'</div>';
  var mo=matchManufacturer(rec.tozeret_nm);
  if(!mo){
    show(head+'<div class="mb-plate-warn">היצרן לא נמצא במחשבון. בחרו יצרן, דגם ושנה ידנית במחשבון שמתחת, או שלחו לנו את פרטי הרכב.</div>'+cta(car,plate));
    track("unmapped_manufacturer",{maker:mfrName});return;
  }
  var res=sel("result");if(res)res.innerHTML=""; // clear a previous result (the calculator does not clear it on manufacturer change)
  setSelect("manufacturer",mo.value);
  show(head+'<div>ממלאים את המחשבון...</div>');
  waitOptions("model",8000,function(models){
    var md=models?matchModel(model):null;
    if(!md){
      show(head+'<div class="mb-plate-warn">היצרן מולא במחשבון. הדגם "'+esc(model)+'" לא זוהה אוטומטית: בחרו אותו מרשימת הדגמים במחשבון, השנה תתמלא לבד, ואז לחצו "חפש".</div>'+cta(car,plate));
      track("unmapped_model",{maker:mfrName,model:model});
      var me=sel("model");if(me){var onPick=function(){waitOptions("year",6000,function(){var yo=matchYear(year);if(yo)setSelect("year",yo.value);});};if(window.jQuery&&window.jQuery.fn){window.jQuery(me).one("change",onPick);}else{me.addEventListener("change",onPick,{once:true});}} // Select2/jQuery fire jQuery handlers, not native listeners
      scrollToResult();return;
    }
    setSelect("model",md.value);
    waitOptions("year",8000,function(years){
      var yo=years?matchYear(year):null;
      if(!yo){
        show(head+'<div class="mb-plate-warn">היצרן והדגם מולאו. בחרו את השנה במחשבון ולחצו "חפש".</div>'+cta(car,plate));
        track("unmapped_year",{maker:mfrName,model:model,year:year});scrollToResult();return;
      }
      setSelect("year",yo.value);
      var b=sel("searchBtn");if(b)setTimeout(function(){b.click();},150);
      var note=(String(yo.text).indexOf(String(year))<0)?' (המחשבון מציג את השנה הקרובה ביותר: '+esc(yo.text)+')':"";
      show(head+'<div>המחשבון מולא אוטומטית: '+esc(mo.text)+' / '+esc(md.text)+' / '+esc(yo.text)+note+'. התוצאה מופיעה מתחת.</div>'+cta(car,plate));
      track("success",{maker:mfrName,model:model,year:year});scrollToResult();
    });
  });
}

sel("mb-plate-form").addEventListener("submit",function(ev){
  ev.preventDefault();
  var plate=(inp.value||"").replace(/\D/g,"");
  if(plate.length<7||plate.length>8){show('<div class="mb-plate-err">הקלידו מספר רכב של 7 או 8 ספרות.</div>');return;}
  runId++;btn.disabled=true;show("<div>בודקים במאגר הרכב...</div>");
  lookup(plate).then(function(rec){
    if(!rec&&plate.charAt(0)==="0")return lookup(String(parseInt(plate,10)));
    return rec;
  }).then(function(rec){
    btn.disabled=false;
    if(!rec){show('<div class="mb-plate-warn">המספר '+esc(plate)+' לא נמצא במאגר הרכב (רכב חדש מאוד, מעל 3.5 טון, אופנוע או רכב שהורד מהכביש). אפשר לבחור ידנית במחשבון, או לשלוח לנו הודעה.</div>'+cta("הרכב שלי",plate));track("not_found");return;}
    fillCalculator(rec,plate);
  }).catch(function(e){
    btn.disabled=false;
    show('<div class="mb-plate-err">מאגר הרכב לא זמין כרגע. בחרו יצרן, דגם ושנה במחשבון שמתחת, או חייגו '+PHONE+'.</div>'+cta("הרכב שלי",plate));
    track("error",{message:String(e&&e.message||e)});
  });
});
})();
</script>
```

---

## חלק 3: כותרות רכזות פורד (term 127) ואאודי (term 142)
**הבעיה:** בשתי הרכזות ה-Title ב-TSF הוזן ידנית בלי הסימון "Remove the site title", ולכן בכותרת בגוגל שם האתר מופיע פעמיים (או שהכותרת לא עקבית עם שאר הרכזות). רכזת מרצדס (term 141) תקינה ומשמשת דוגמה.

1. לכל אחת מהשתיים: לדווח את ה-`<title>` החי, את ערך שדה ה-Title ב-TSF ואם "Remove the site title" מסומן. לגבות ל-`g5_bk_127` / `g5_bk_142`. לדווח לשם השוואה את ה-`<title>` החי של מרצדס.
2. **אאודי 142:** אם שדה ה-Title כבר כולל "מצבר הדרך" → רק לסמן "Remove the site title" ולשמור. לא לשנות את הטקסט.
3. **פורד 127:** אם שדה ה-Title הוא "מצבר לפורד Ford" (בלי שם האתר) → להחליף ל-`מצבר לפורד Ford: התאמה לפי דגם ושנה, החלפה עד הבית | מצבר הדרך` ולסמן "Remove the site title". אם השדה כבר כולל "מצבר הדרך" → רק לסמן את התיבה.
4. לא לשנות Meta, תוכן או שדות אחרים. אימות אחרי Purge: ב-`<title>` החי של שתי הרכזות "מצבר הדרך" מופיע **פעם אחת בלבד**.

---

## חלק 4: דף הבית 1193: שורת תאריך גלויה
**למה:** בסימון לגוגל של דף הבית יש `dateModified: 2026-11-18`, וגוגל מבקש שהתאריך יופיע גם בטקסט הגלוי.

1. לאתר בדף הבית את ווידג'ט הטקסט (text-editor) שמציג את המחירים הבסיסיים ("379" / "480" / "749"). לדווח את ה-id שלו ואת ה-HTML הנוכחי. אם יש כמה, לבחור את הראשון שמציג את המחירים כטקסט רגיל (לא ה-FAQ, לא ווידג'ט HTML של סכמה).
2. **דרך עורך אלמנטור הרגיל בלבד** (לא save_builder/ajax): גיבוי הווידג'ט + כל `_elementor_data` ל-`g5_bk_1193` + SHA-256, לרשום הגדרות עמוד (כלל 9). להוסיף **בסוף** הווידג'ט פסקה אחת:
   `<p style="font-size:14px;opacity:.8">המחירים והמידע בעמוד עודכנו: <time datetime="2026-11-18">18 בנובמבר 2026</time></p>`
   ללחוץ "עדכון".
3. אימות אחרי Purge: השורה מוצגת בדסקטופ ובמובייל; H1 יחיד; `hide_title: yes`; תבנית `elementor_header_footer`; השוואת `_elementor_data` מול הגיבוי = רק הווידג'ט הזה השתנה; 4 בלוקי JSON-LD עוברים JSON.parse; Custom Code 4721 לא השתנה.
4. **אם אין ווידג'ט טקסט עם המחירים** - לא להוסיף במקום אחר. לעצור את החלק הזה ולדווח מה נמצא.

---

## סיום
Purge All פעם אחת, "PURGE HH:MM", ודיווח מסכם: hash לפני/אחרי לכל משאב, תוצאות האימות, ומה דולג ולמה.
