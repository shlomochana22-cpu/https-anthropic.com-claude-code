# פקודה לכרום, כרטיסייה 2, סבב 4: ווידג'ט "בדיקת מצבר לפי מספר רכב" מעל המחשבון (עמוד 3229)

```
🔒 כללי מקבילות, כרטיסייה 2
1. אני כרטיסייה 2. שלי בלבד בסבב הזה: עמוד 3229 (הוספת ווידג'ט HTML חדש אחד; b2279cb, 5c0b4e23, 56251b3 וכל השאר לקריאה בלבד) ו-TSF של 3229 (Meta בלבד, אם הבעלים מאשר).
2. לא מתנתק, לא פרופיל אישי, לא סיסמה. wp-login → עוצר ומדווח "נדרשת התחברות, כרטיסייה 2".
3. אסור: Regenerate CSS, Experiments, Element Manager, Site Settings, עדכונים, תוספים, שינוי בקוד המחשבון.
4. Purge All פעם אחת בסוף + הודעה "PURGE כרטיסייה 2 HH:MM".
5. localStorage: מפתחות t2_ בלבד (t2_bk_3229_r4), גיבוי + SHA-256 לפני השמירה.
6. לפני השינוי: ווידג'ט עם המחרוזת `mb-plate` כבר קיים ב-3229? דלג ודווח.
7. חסימת הרשאה → אישור הבעלים בשורה נפרדת (הוא כותב אותה בעצמו בצ'אט).
8. דיווח: [כרטיסייה 2 HH:MM] + hash לפני/אחרי.
```

## הקשר (אין לך היסטוריה קודמת, קרא בעיון)
אתר: https://matzberimil.co.il (וורדפרס + אלמנטור). העסק: "מצבר הדרך", החלפת מצברים עד הבית. עמוד המחשבון **3229** (`/battery-compatibility/`) מכיל בקונטיינר `8e82b1a` את הווידג'טים בסדר: df8d20d, 89fd57d, **b2279cb** (המחשבון: jQuery + Select2, שדות `#manufacturer`, `#model`, `#year`, כפתור `#searchBtn`, תוצאה ב-`div#result`), **5c0b4e23** (קישור לעמוד הדגם), 2500a93, b490b4b, 73486e8. הסבב הזה מוסיף ווידג'ט HTML חדש **מיד לפני b2279cb**: שדה "מספר רכב" שמושך יצרן, דגם ושנה ממאגר הרכב הציבורי של משרד התחבורה (data.gov.il, CORS פתוח, אומת ברקון), ממלא את שדות המחשבון הקיימים ולוחץ "חפש". הוא לא נוגע בקוד המחשבון. **אישור בעלים:** הבעלים כותב שורת אישור משלו בצ'אט (Production Deploy); אם אין, לעצור אחרי ההכנה.

## חלק 1: הוספת הווידג'ט
1. `GET /wp-json/wp/v2/pages/3229?context=edit` → `_elementor_data`. גיבוי מלא ב-`t2_bk_3229_r4`. SHA-256 של ה-`html` של b2279cb, 5c0b4e23 ו-56251b3 ("לפני"; צפוי: b2279cb `a7224425…`, 5c0b4e23 `aa97c019…`, 56251b3 `61d33fbd…`).
2. ליצור אלמנט חדש במבנה של 5c0b4e23 (`elType: "widget"`, `widgetType: "html"`, `isInner: false`, `elements: []`), עם `id` חדש ייחודי של 7 תווים hex שלא קיים בעמוד, ו-`settings.html` = התוכן שלמטה **במלואו** (מהשורה `<!-- mb-plate` עד `</script>`). להכניס אותו למערך `elements` של הקונטיינר `8e82b1a` **מיד לפני** b2279cb. שום אלמנט אחר לא משתנה.
3. שמירה דרך Elementor `document/save/publish` (ajax), אימות ב-REST: `status: publish`; הסדר בקונטיינר: df8d20d, 89fd57d, **החדש**, b2279cb, 5c0b4e23, 2500a93, b490b4b, 73486e8; hash של b2279cb, 5c0b4e23 ו-56251b3 זהה ללפני; hash ה-html של החדש = SHA-256 של התוכן שלמטה. נרמול מותר: `elements:[]`, `jedv_conditions` ריק, `isInner:false`, הסרת `content_width:"boxed"`. כל הבדל אחר → לשחזר מהגיבוי ולדווח.

## חלק 2: TSF של 3229 (Meta בלבד)
לדווח את ה-Title וה-Meta הנוכחיים של העמוד. אם ה-Meta לא מכיל "מספר רכב" ואורכו עד 125 תווים: להוסיף בסופו ` בדיקה גם לפי מספר רכב.` (עד 160 תווים סך הכל). Title לא נוגעים. אם ה-Meta ארוך מדי, לא לשנות, לדווח.

## חלק 3: Purge + בדיקות חיות (כאורח, `?nocache=1`, אחרי Purge All)
לדווח לכל תרחיש: מה הוצג בווידג'ט, מה מולא במחשבון, האם התוצאה הופיעה, האם קישור עמוד הדגם (5c0b4e23) הופיע, ומה נשלח ל-dataLayer (בקונסול: `window.dataLayer.filter(x=>x.event==='plate_lookup')`).
1. **רכב אמיתי שממופה:** מספר הרכב של פורד פוקוס מהרקון (זה שחזר `tozeret_nm` "פורד גרמניה", `kinuy_mishari` FOCUS, 2025). צפוי: "הרכב שלכם: פורד FOCUS 2025 (בנזין)", המחשבון מולא פורד / פוקוס / 2024 (השנה הקרובה, כי 2025 מחוץ לטווח) עם הערה על השנה הקרובה, תוצאה + קישור ל-`/מצבר-לפורד-פוקוס/`, סטטוס `success`.
2. **אופל אסטרה מהרקון** (ASTRA, 2025): צפוי אופל / אסטרה / 2024, קישור לאסטרה, `success`.
3. **טויוטה RAV 4 מהרקון** (2026): צפוי טויוטה / "ראב 4 - RAV4" / 2024, `success`.
4. **מספר לא קיים:** `9999999` → הודעת "לא נמצא במאגר", כפתורי חיוג/וואטסאפ, סטטוס `not_found`, המחשבון לא השתנה.
5. **דגם לא ממופה:** למצוא במאגר רכב של יצרן שקיים במחשבון עם דגם שאין לו שורה (למשל `datastore_search?...&q=פורד BRONCO&limit=1` או `q=יונדאי STARIA`) ולהכניס את מספר הרכב שלו. צפוי: היצרן מולא, הודעה "הדגם לא זוהה אוטומטית, בחרו מהרשימה", סטטוס `unmapped_model`. אחרי בחירת דגם ידנית ברשימה: השנה מתמלאת לבד.
6. **קלט לא תקין:** `12345` → הודעת "7 או 8 ספרות", בלי בקשת רשת.
7. **מובייל 390px:** הווידג'ט מעל המחשבון, השדה והכפתור נראים, אין גלילה אופקית.
8. 0 שגיאות ב-Console בכל התרחישים; ב-Network הבקשה ל-data.gov.il מחזירה 200; לחיצה רגילה במחשבון (בלי מספר רכב) עובדת כמו קודם.
9. **אימות בעיני אורח:** הווידג'ט מופיע גם בחלון גלישה בסתר (בלי התחברות).

**התוכן של הווידג'ט החדש (settings.html):**

```html
<!-- mb-plate: בדיקת מצבר לפי מספר רכב. ווידג'ט HTML נפרד שמוצב מעל המחשבון (b2279cb) בעמוד 3229. לא נוגע בקוד המחשבון: רק ממלא את #manufacturer/#model/#year ולוחץ #searchBtn. מקור: מאגר הרכב של משרד התחבורה (data.gov.il, ציבורי, בלי פרטי בעלים). להסרה: למחוק את הווידג'ט. גרסה 1, 6/11/2026. -->
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
  <p class="mb-plate-sub">הקלידו את מספר הרכב, ונמלא עבורכם את המחשבון עם היצרן, הדגם והשנה מרישיון הרכב.</p>
  <form class="mb-plate-row" id="mb-plate-form" autocomplete="off">
    <input type="text" id="mb-plate-num" inputmode="numeric" pattern="[0-9 -]*" maxlength="10" placeholder="12-345-67" aria-label="מספר רכב">
    <button type="submit" id="mb-plate-btn">בדקו איזה מצבר מתאים</button>
  </form>
  <div class="mb-plate-out" id="mb-plate-out" aria-live="polite"></div>
  <p class="mb-plate-note">הנתונים מגיעים ממאגר הרכב הציבורי של משרד התחבורה ואינם כוללים פרטים אישיים. לא שומרים את מספר הרכב.</p>
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
function stripCountry(s){
  s=String(s||"").replace(/\(.*?\)/g,"").trim();
  for(var i=0;i<COUNTRIES.length;i++){
    var c=COUNTRIES[i];
    if(s.slice(-c.length)===c&&s.length>c.length){s=s.slice(0,-c.length).trim();break;}
  }
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
 /* Subaru */ "IMPREZA":"אימפרזה","FORESTER":"פורסטר","OUTBACK":"אאוטבק","XV":"XV","B4":"B4","LEGACY":"B4","CROSSTREK":"קרוסטר","LEVORG":"לבורג","BRZ":"BRZ"
};
/* English maker words to strip from the model name (registry sometimes writes "MAZDA 3", "MG ZS") */
var MAKER_WORDS=["MAZDA","FORD","OPEL","TOYOTA","HYUNDAI","KIA","SKODA","SUZUKI","NISSAN","MITSUBISHI","SEAT","HONDA","PEUGEOT","CITROEN","RENAULT","DACIA","BYD","MG","CHERY","SUBARU","VOLVO","LEXUS","FIAT","CHEVROLET","DAIHATSU","AUDI","MERCEDES","BMW","VW","VOLKSWAGEN"];

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
  setSelect("manufacturer",mo.value);
  show(head+'<div>ממלאים את המחשבון...</div>');
  waitOptions("model",8000,function(models){
    var md=models?matchModel(model):null;
    if(!md){
      show(head+'<div class="mb-plate-warn">היצרן והשנה מולאו במחשבון. הדגם "'+esc(model)+'" לא זוהה אוטומטית, בחרו אותו מהרשימה במחשבון ולחצו "חפש".</div>'+cta(car,plate));
      track("unmapped_model",{maker:mfrName,model:model});
      var me=sel("model");if(me){var once=function(){me.removeEventListener("change",once);waitOptions("year",6000,function(){var yo=matchYear(year);if(yo)setSelect("year",yo.value);});};me.addEventListener("change",once);}
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

## דיווח חזרה
`[כרטיסייה 2 HH:MM]`: id של הווידג'ט החדש, סדר האלמנטים, 4 hash לפני/אחרי, Title/Meta של 3229 (לפני/אחרי), טבלת 9 התרחישים עם הסטטוסים ב-dataLayer, שעת Purge, כל חריגה.
