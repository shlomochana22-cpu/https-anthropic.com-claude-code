# פקודה לכרום: ניש מרצדס + אאודי, סבב 3 (סגירה): רכזות, מחשבון + מספר רכב, sitemap, llms.txt

```
🔒 כללים
1. שלי בלבד בסבב הזה: מונחי היצרן מרצדס (term 141) ואאודי (term 142), עמוד המחשבון 3229 (ווידג'טים 5c0b4e23 ו-9620d08 + תוספת טקסט אחת), מסך ההגדרות של llms.txt, Search Console. לא 1193, לא service-areas, לא Custom Code, לא תבנית 531, לא 20 הרכזות האחרות, לא 128 עמודי הדגם, לא b2279cb (המחשבון עצמו).
2. לא מתנתק, לא פרופיל אישי, לא סיסמה. wp-login → עוצר ומדווח "נדרשת התחברות".
3. אסור: Regenerate CSS, Experiments, Element Manager, Site Settings, עדכונים, תוספים.
4. Purge All פעם אחת בסוף + הודעה "PURGE HH:MM".
5. localStorage: מפתחות g3_ בלבד (g3_bk_141, g3_bk_142, g3_bk_3229, g3_bk_llms), גיבוי + SHA-256 לפני כל שמירה.
6. לפני כל שינוי: קיים כבר? דלג ודווח.
7. חסימת הרשאה → אישור הבעלים בשורה נפרדת (הוא כותב אותה בעצמו בצ'אט).
8. דיווח: [כרום HH:MM] + hash לפני/אחרי לכל משאב.
```

## הקשר (אין לך היסטוריה קודמת, קרא בעיון)
אתר: https://matzberimil.co.il (וורדפרס + אלמנטור + JetEngine). העסק: "מצבר הדרך", החלפת מצברים עד הבית. היום פורסמו 8 עמודי דגם חדשים: מרצדס A-Class 5137, B-Class 5138, C-Class 5139, E-Class 5140; אאודי A3 5161, A4 5162, Q3 5163, Q5 5164. הסבב הזה סוגר את הניש: קישורים מהרכזות, תיקון ערכי האמפר ברכזות מול המחשבון, אינדוקס, llms.txt, מפת הקישורים במחשבון, וגרסה 1.3 של ווידג'ט "בדיקת מצבר לפי מספר רכב" עם טקסט הסבר מורחב. **הכל מאחורי אישור בעלים אחד** (Production Deploy): הבעלים כותב שורת אישור משלו בצ'אט; אם אין, לעצור אחרי ההכנה.

עמודי היצרן הם מונחים (taxonomy `manufacturer`) עם תוכן בשדה JetEngine `term_content`. כללי עריכה: **Text mode בלבד** (לא Visual; ב-Visual, TinyMCE דורס את הערך); ה-id של ה-textarea מתחלף בכל טעינה, לאתר לפי `name`; גיבוי + SHA-256 לפני שמירה; אחרי שמירה קריאה חוזרת ו-diff = בדיוק השינויים; אם "עדכון" לא שולח, `form.submit()`; wpautop מוסיף `<br>` לשבירות שורה, לכן כל בלוק מודבק **בשורה אחת**. אם kses מסיר `;` מ-`line-height:2.2;` זה תקין. **כלל תוכן קבוע:** לא כותבים בשום מקום על קידוד או רישום מצבר במחשב הרכב (BEM/BMS).

---

## חלק 1: רכזת מרצדס (term 141, `/manufacturer/מרצדס-mercedes/`)

**1א. תיקון ערכי האמפר בטקסט מול המחשבון.** בעמוד יש רשימה של דגמים עם אמפר (למשל C-Class 65-70, E-Class 70-75, GLC, GLE). לדווח את ה-HTML המדויק של הרשימה, ואז החלפות **של הערכים בלבד**, בלי לשנות תגיות או מבנה:
| דגם | לכתוב |
|---|---|
| A-Class | `72 אמפר (מ-2013: 70 סטארט סטופ)` |
| B-Class | `72 אמפר (מ-2013: 80 סטארט סטופ AGM)` |
| C-Class | `80 אמפר (מ-2013: 80 סטארט סטופ AGM)` |
| E-Class | `100 אמפר (מ-2013: 95 סטארט סטופ AGM)` |
| GLC, GLE, GLA, S-Class, ML, V-Class, ספרינטר ואחרים | **לא לשנות** (לדווח מה כתוב) |
אם מבנה הרשימה לא מאפשר החלפה נקייה של ערך בודד: לא לשנות, לדווח ולהמשיך.

**1ב. בלוק hub בסוף ה-term_content** (אחרי כל התוכן הקיים; אם יש `<!-- GEO+LINKS END -->`, אחריו), **שורה אחת בדיוק**:

```html
<h2>מדריכי מצבר לפי דגם מרצדס</h2><p style="line-height:2.2;"><a href="https://matzberimil.co.il/מצבר-למרצדס-a-class/">מצבר למרצדס A-Class</a> | <a href="https://matzberimil.co.il/מצבר-למרצדס-b-class/">מצבר למרצדס B-Class</a> | <a href="https://matzberimil.co.il/מצבר-למרצדס-c-class/">מצבר למרצדס C-Class</a> | <a href="https://matzberimil.co.il/מצבר-למרצדס-e-class/">מצבר למרצדס E-Class</a> | <a href="https://matzberimil.co.il/">מצבר עד הבית</a> | <a href="https://matzberimil.co.il/מצבר-עד-הבית-במרכז/">מצבר עד הבית במרכז</a> | <a href="https://matzberimil.co.il/מצבר-עד-הבית-בשרון/">מצבר עד הבית בשרון</a></p><p>מצבר הדרך מספקת מצברים עד הבית לכל דגמי מרצדס בכל הארץ, 24 שעות ביממה, כולל שבת: מצבר רגיל מ-559 שקל, סטארט סטופ מ-749 שקל ו-AGM מ-999 שקל, כולל הגעה, התקנה, בדיקת אלטרנטור ואחריות בכתב. לא בטוחים איזה מצבר יש ברכב? בדקו לפי מספר רכב ב<a href="https://matzberimil.co.il/battery-compatibility/">מחשבון</a>, שלחו צילום של המצבר ב<a href="https://wa.me/972555033336">וואטסאפ 055-5033336</a> או חייגו <a href="tel:055-5033335">055-5033335</a>.</p>
```

**1ג. TSF של המונח:** לפי הרקון, שדה ה-Title **ריק** (מוצג רק placeholder "יצרן רכב: מרצדס - Mercedes - מצבר הדרך…") וה-Meta מוזן ידנית. אם ה-Title אכן ריק: למלא `מצבר למרצדס - מחירון לפי דגם, AGM והחלפה עד הבית 24/7 | מצבר הדרך` ולסמן "Remove the site title". אם יש בו ערך ידני: לא לשנות, לדווח. Meta: לא נוגעים.

**1ד. אימות:** קריאה חוזרת, diff = ההחלפות מ-1א + הבלוק מ-1ב בלבד. דף חי 200 (?nocache=1), H1 ללא שינוי, בלוק "מדריכי מצבר לפי דגם מרצדס": 0 `<br>`, 8 קישורים (4 דגמים, בית, מרכז, שרון, מחשבון) כולם 200, פסקת הסיום מוצגת.

## חלק 2: רכזת אאודי (term 142, `/manufacturer/אאודי-audi/`)

**2א. תיקון ערכי האמפר** (אותו כלל: ערכים בלבד, לדווח HTML לפני):
| דגם | לכתוב |
|---|---|
| A3 | `72 אמפר (מ-2013: 70 סטארט סטופ)` |
| A4 | `72 אמפר (מ-2013: 70 סטארט סטופ)` |
| Q3 | `72 אמפר (מ-2013: 70 סטארט סטופ)` |
| Q5 | `72 אמפר (מ-2013: 70 סטארט סטופ)` |
| A6 | `95 סטארט סטופ AGM` |
| Q7 | `100 אמפר (מ-2016: 95 סטארט סטופ AGM)` |
| אחרים | לא לשנות |

**2ב. בלוק hub בסוף ה-term_content**, שורה אחת בדיוק:

```html
<h2>מדריכי מצבר לפי דגם אאודי</h2><p style="line-height:2.2;"><a href="https://matzberimil.co.il/מצבר-לאאודי-a3/">מצבר לאאודי A3</a> | <a href="https://matzberimil.co.il/מצבר-לאאודי-a4/">מצבר לאאודי A4</a> | <a href="https://matzberimil.co.il/מצבר-לאאודי-q3/">מצבר לאאודי Q3</a> | <a href="https://matzberimil.co.il/מצבר-לאאודי-q5/">מצבר לאאודי Q5</a> | <a href="https://matzberimil.co.il/">מצבר עד הבית</a> | <a href="https://matzberimil.co.il/מצבר-עד-הבית-במרכז/">מצבר עד הבית במרכז</a> | <a href="https://matzberimil.co.il/מצבר-עד-הבית-בשרון/">מצבר עד הבית בשרון</a></p><p>מצבר הדרך מספקת מצברים עד הבית לכל דגמי אאודי בכל הארץ, 24 שעות ביממה, כולל שבת: מצבר רגיל מ-559 שקל, סטארט סטופ מ-749 שקל ו-AGM מ-999 שקל, כולל הגעה, התקנה, בדיקת אלטרנטור ואחריות בכתב. לא בטוחים איזה מצבר יש ברכב? בדקו לפי מספר רכב ב<a href="https://matzberimil.co.il/battery-compatibility/">מחשבון</a>, שלחו צילום של המצבר ב<a href="https://wa.me/972555033336">וואטסאפ 055-5033336</a> או חייגו <a href="tel:055-5033335">055-5033335</a>.</p>
```

**2ג. TSF:** Title ידני "מצבר לרכב אאודי - Audi" ו-Meta ידני. **לא לשנות**, רק לדווח אם "Remove the site title" מסומן.

**2ד. אימות:** diff = החלפות + בלוק. דף חי 200, H1 ללא שינוי, hub 0 `<br>`, 8 קישורים 200, פסקת הסיום.

**בקרה:** רכזת פורד (term 127): hash ה-term_content לפני ואחרי כל הסבב זהה.

## חלק 3: עמוד המחשבון 3229

בקונטיינר `8e82b1a`: df8d20d, 89fd57d, **9620d08** (מספר רכב), **b2279cb** (המחשבון, לא נוגעים), **5c0b4e23** (קישור לעמוד הדגם), 2500a93, b490b4b, 73486e8.
1. `GET /wp-json/wp/v2/pages/3229?context=edit` → `_elementor_data`. גיבוי מלא ב-`g3_bk_3229`. SHA-256 של ה-`html` של b2279cb, 5c0b4e23, 9620d08 ו-56251b3 ("לפני"; צפוי: b2279cb `a7224425…`, 5c0b4e23 `aa97c019…`, 9620d08 `bf32207d…`, 56251b3 `61d33fbd…`).
2. **5c0b4e23:** להחליף רק את `settings.html` בתוכן "מפת הקישורים" שלמטה (130 דגמים, 22 יצרנים).
3. **9620d08:** להחליף רק את `settings.html` בתוכן "ווידג'ט מספר רכב גרסה 1.3" שלמטה.
4. **טקסט בעמוד (בקשת הבעלים):** לדווח מה הסוג והתוכן של df8d20d ו-89fd57d (heading / text-editor). אם אחד מהם הוא `text-editor` עם פסקת פתיחה על המחשבון: להוסיף **בסוף** שדה ה-`editor` שלו (append-only) את הפסקה: `<p>חדש: אפשר לברר איזה סוג מצבר מתאים לרכב גם לפי מספר הרכב בלבד. הקלידו את מספר הרכב בתיבה "בדיקת מצבר לפי מספר רכב" שלמטה, והמחשבון יתמלא לבד עם היצרן, הדגם והשנה מרישיון הרכב.</p>`. אם שניהם heading בלבד: לא להוסיף, לדווח (הטקסט המורחב קיים בתוך הווידג'ט).
5. שמירה דרך Elementor `document/save` עם `settings:{post_status:'publish'}`, אימות ב-REST: `status: publish`; הסדר בקונטיינר ללא שינוי; hash של b2279cb ו-56251b3 **זהה ללפני**; hash של 5c0b4e23 ו-9620d08 = SHA-256 של התכנים שלמטה; מחוץ לשינויים האלה (ו-4 אם בוצע) אין הבדל ב-`_elementor_data`, מלבד נרמול מותר (`elements:[]`, `jedv_conditions` ריק, `isInner:false`, הסרת `content_width:"boxed"`).
6. **בדיקה חיה** (אחרי Purge, כאורח, ?nocache=1): (א) מרצדס → C-CLASS → 2018 → "חפש" → קישור "מדריך מלא: מצבר למרצדס C-Class" אל `/מצבר-למרצדס-c-class/` (200); (ב) אאודי → Q5 → קישור ל-`/מצבר-לאאודי-q5/`; (ג) מרצדס → ספרינטר → קישור "כל הדגמים של היצרן" אל רכזת מרצדס (fallback); (ד) פורד → פוקוס → עדיין קישור לעמוד הדגם (רגרסיה); (ה) מספר רכב: המספר של המרצדס/אאודי מהרקון אם יש, אחרת לחפש במאגר `datastore_search?...&q=מרצדס C200D&limit=1` ולהכניס את מספרו → צפוי: המחשבון מולא מרצדס / C-CLASS / השנה (או הקרובה), תוצאה + קישור ל-C-Class, `success`; (ו) מספר הפורד פוקוס מהרקון → עדיין `success`; (ז) הטקסט החדש בווידג'ט ("לא בטוחים מה הדגם או השנה?…" ו"איך זה עובד:") מוצג; (ח) 0 שגיאות ב-Console, מובייל 390px בלי גלילה אופקית.

**מפת הקישורים, התוכן החדש של 5c0b4e23 (settings.html):**

```html
<!-- mb-model-link: קישור מתוצאת המחשבון לעמוד הדגם. ווידג'ט נפרד, לא נוגע בקוד המחשבון. להסרה: למחוק את הווידג'ט. -->
<style>
#result .mb-model-link{margin:14px 0 0;padding:12px 14px;border:1px solid #e0e0e0;border-radius:10px;background:#fafafa;direction:rtl;text-align:right;line-height:1.8;font-size:16px}
#result .mb-model-link a{font-weight:bold;text-decoration:underline}
</style>
<script>
(function(){
var MODELS={"בי-ווי-די - BYD|אטו 3":["https://matzberimil.co.il/מצבר-ל-byd-אטו-3/","מצבר ל-BYD אטו 3"],"צ'רי|FX":["https://matzberimil.co.il/מצבר-לצרי-fx/","מצבר לצ'רי FX"],"צ'רי|טיגו 4 פרו":["https://matzberimil.co.il/מצבר-לצרי-טיגו-4-פרו/","מצבר לצ'רי טיגו 4 פרו"],"צ'רי|טיגו 7 פרו":["https://matzberimil.co.il/מצבר-לצרי-טיגו-7-פרו/","מצבר לצ'רי טיגו 7 פרו"],"צ'רי|טיגו 8 פרו":["https://matzberimil.co.il/מצבר-לצרי-טיגו-8-פרו/","מצבר לצ'רי טיגו 8 פרו"],"סיטרואן|ברלינגו":["https://matzberimil.co.il/מצבר-לסיטרואן-ברלינגו/","מצבר לסיטרואן ברלינגו"],"סיטרואן|C1":["https://matzberimil.co.il/מצבר-לסיטרואן-c1/","מצבר לסיטרואן C1"],"סיטרואן|C3 פיקסאו/איירקרוס":["https://matzberimil.co.il/מצבר-לסיטרואן-c3/","מצבר לסיטרואן C3"],"סיטרואן|C4 פיקסאו/קקטוס":["https://matzberimil.co.il/מצבר-לסיטרואן-c4/","מצבר לסיטרואן C4"],"דאצ'יה|דאסטר":["https://matzberimil.co.il/מצבר-לדאציה-דאסטר/","מצבר לדאצ'יה דאסטר"],"דאצ'יה|לוגן":["https://matzberimil.co.il/מצבר-לדאציה-לוגן/","מצבר לדאצ'יה לוגן"],"דאצ'יה|סאנדרו":["https://matzberimil.co.il/מצבר-לדאציה-סנדרו/","מצבר לדאצ'יה סנדרו"],"הונדה|סיוויק":["https://matzberimil.co.il/מצבר-להונדה-סיוויק/","מצבר להונדה סיוויק"],"הונדה|CRV":["https://matzberimil.co.il/מצבר-להונדה-crv/","מצבר להונדה CR-V"],"הונדה|HRV":["https://matzberimil.co.il/מצבר-להונדה-hrv/","מצבר להונדה HR-V"],"הונדה|ג׳אז":["https://matzberimil.co.il/מצבר-להונדה-גאז/","מצבר להונדה ג'אז"],"יונדאי|אקסנט":["https://matzberimil.co.il/מצבר-ליונדאי-אקסנט/","מצבר ליונדאי אקסנט"],"יונדאי|אלנטרה":["https://matzberimil.co.il/מצבר-ליונדאי-אלנטרה/","מצבר ליונדאי אלנטרה"],"יונדאי|גטס":["https://matzberimil.co.il/מצבר-ליונדאי-גטס/","מצבר ליונדאי גטס"],"יונדאי|I10":["https://matzberimil.co.il/מצבר-ליונדאי-i10/","מצבר ליונדאי i10"],"יונדאי|I20":["https://matzberimil.co.il/מצבר-ליונדאי-i20/","מצבר ליונדאי i20"],"יונדאי|I25":["https://matzberimil.co.il/מצבר-ליונדאי-i25/","מצבר ליונדאי i25"],"יונדאי|I30":["https://matzberimil.co.il/מצבר-ליונדאי-i30/","מצבר ליונדאי i30"],"יונדאי|I35":["https://matzberimil.co.il/מצבר-ליונדאי-i35/","מצבר ליונדאי i35"],"יונדאי|איוניק":["https://matzberimil.co.il/מצבר-ליונדאי-איוניק/","מצבר ליונדאי איוניק"],"יונדאי|IX35":["https://matzberimil.co.il/מצבר-ליונדאי-ix35/","מצבר ליונדאי ix35"],"יונדאי|קונה":["https://matzberimil.co.il/מצבר-ליונדאי-קונה/","מצבר ליונדאי קונה"],"יונדאי|סנטה פה":["https://matzberimil.co.il/מצבר-ליונדאי-סנטה-פה/","מצבר ליונדאי סנטה פה"],"יונדאי|טוסון":["https://matzberimil.co.il/מצבר-ליונדאי-טוסון/","מצבר ליונדאי טוסון"],"קיה|קרניבל":["https://matzberimil.co.il/מצבר-לקיה-קרניבל/","מצבר לקיה קרניבל"],"קיה|סיד":["https://matzberimil.co.il/מצבר-לקיה-סיד/","מצבר לקיה סיד"],"קיה|סראטו":["https://matzberimil.co.il/מצבר-לקיה-סראטו/","מצבר לקיה סראטו"],"קיה|פורטה":["https://matzberimil.co.il/מצבר-לקיה-פורטה/","מצבר לקיה פורטה"],"קיה|נירו":["https://matzberimil.co.il/מצבר-לקיה-נירו/","מצבר לקיה נירו (היברידי/חשמלי)"],"קיה|פיקנטו":["https://matzberimil.co.il/מצבר-לקיה-פיקנטו/","מצבר לקיה פיקנטו"],"קיה|ריו":["https://matzberimil.co.il/מצבר-לקיה-ריו/","מצבר לקיה ריו"],"קיה|סלטוס":["https://matzberimil.co.il/מצבר-לקיה-סלטוס/","מצבר לקיה סלטוס"],"קיה|סורנטו":["https://matzberimil.co.il/מצבר-לקיה-סורנטו/","מצבר לקיה סורנטו"],"קיה|סול":["https://matzberimil.co.il/מצבר-לקיה-סול/","מצבר לקיה סול"],"קיה|ספורטג'":["https://matzberimil.co.il/מצבר-לקיה-ספורטג/","מצבר לקיה ספורטג'"],"קיה|סטוניק":["https://matzberimil.co.il/מצבר-לקיה-סטוניק/","מצבר לקיה סטוניק"],"מאזדה|2":["https://matzberimil.co.il/מצבר-למאזדה-2/","מצבר למאזדה 2"],"מאזדה|3":["https://matzberimil.co.il/מצבר-למאזדה-3/","מצבר למאזדה 3"],"מאזדה|5":["https://matzberimil.co.il/מצבר-למאזדה-5/","מצבר למאזדה 5"],"מאזדה|6":["https://matzberimil.co.il/מצבר-למאזדה-6/","מצבר למאזדה 6"],"מאזדה|CX3":["https://matzberimil.co.il/מצבר-למאזדה-cx3/","מצבר למאזדה CX-3"],"מאזדה|CX30":["https://matzberimil.co.il/מצבר-למאזדה-cx30/","מצבר למאזדה CX-30"],"מאזדה|CX5":["https://matzberimil.co.il/מצבר-למאזדה-cx5/","מצבר למאזדה CX-5"],"אם ג׳י - MG|ZS":["https://matzberimil.co.il/מצבר-ל-mg-zs/","מצבר ל-MG ZS"],"אם ג׳י - MG|3":["https://matzberimil.co.il/מצבר-ל-mg3/","מצבר ל-MG3"],"אם ג׳י - MG|4":["https://matzberimil.co.il/מצבר-ל-mg4/","מצבר ל-MG4"],"אם ג׳י - MG|5":["https://matzberimil.co.il/מצבר-ל-mg5/","מצבר ל-MG5"],"מיציבושי|ASX":["https://matzberimil.co.il/מצבר-למיצובישי-asx/","מצבר למיצובישי ASX"],"מיציבושי|אטראז'":["https://matzberimil.co.il/מצבר-למיצובישי-אטראז/","מצבר למיצובישי אטראז'"],"מיציבושי|אקליפס קרוס":["https://matzberimil.co.il/מצבר-למיצובישי-אקליפס-קרוס/","מצבר למיצובישי אקליפס קרוס"],"מיציבושי|לנסר/ סופר לנסר":["https://matzberimil.co.il/מצבר-למיצובישי-לנסר/","מצבר למיצובישי לנסר"],"מיציבושי|אאוטלנדר":["https://matzberimil.co.il/מצבר-למיצובישי-אאוטלנדר/","מצבר למיצובישי אאוטלנדר"],"מיציבושי|פג'ארו":["https://matzberimil.co.il/מצבר-למיצובישי-פגארו/","מצבר למיצובישי פג'ארו"],"מיציבושי|ספייס סטאר":["https://matzberimil.co.il/מצבר-למיצובישי-ספייס-סטאר/","מצבר למיצובישי ספייס סטאר"],"ניסן|אלטימה":["https://matzberimil.co.il/מצבר-לניסאן-אלטימה/","מצבר לניסאן אלטימה"],"ניסן|ג'וק":["https://matzberimil.co.il/מצבר-לניסאן-גוק/","מצבר לניסאן ג'וק"],"ניסן|מיקרה":["https://matzberimil.co.il/מצבר-לניסאן-מיקרה/","מצבר לניסאן מיקרה"],"ניסן|נוט":["https://matzberimil.co.il/מצבר-לניסאן-נוט/","מצבר לניסאן נוט"],"ניסן|קשקאי":["https://matzberimil.co.il/מצבר-לניסאן-קשקאי/","מצבר לניסאן קשקאי"],"ניסן|סנטרה":["https://matzberimil.co.il/מצבר-לניסאן-סנטרה/","מצבר לניסאן סנטרה"],"ניסן|אקסטרייל":["https://matzberimil.co.il/מצבר-לניסאן-אקסטרייל/","מצבר לניסאן אקסטרייל"],"פיג'ו|2008":["https://matzberimil.co.il/מצבר-לפיגו-2008/","מצבר לפיג'ו 2008"],"פיג'ו|208":["https://matzberimil.co.il/מצבר-לפיגו-208/","מצבר לפיג'ו 208"],"פיג'ו|3008":["https://matzberimil.co.il/מצבר-לפיגו-3008/","מצבר לפיג'ו 3008"],"פיג'ו|308":["https://matzberimil.co.il/מצבר-לפיגו-308/","מצבר לפיג'ו 308"],"פיג'ו|5008":["https://matzberimil.co.il/מצבר-לפיגו-5008/","מצבר לפיג'ו 5008"],"פיג'ו|508":["https://matzberimil.co.il/מצבר-לפיגו-508/","מצבר לפיג'ו 508"],"פיג'ו|פרטנר":["https://matzberimil.co.il/מצבר-לפיגו-פרטנר/","מצבר לפיג'ו פרטנר"],"רנו|קפצ'ור":["https://matzberimil.co.il/מצבר-לרנו-קפצור/","מצבר לרנו קפצ'ור"],"רנו|קליאו":["https://matzberimil.co.il/מצבר-לרנו-קליאו/","מצבר לרנו קליאו"],"רנו|פלואנס":["https://matzberimil.co.il/מצבר-לרנו-פלואנס/","מצבר לרנו פלואנס"],"רנו|קדג'אר":["https://matzberimil.co.il/מצבר-לרנו-קדגאר/","מצבר לרנו קדג'אר"],"רנו|קנגו":["https://matzberimil.co.il/מצבר-לרנו-קנגו/","מצבר לרנו קנגו"],"רנו|מגאן":["https://matzberimil.co.il/מצבר-לרנו-מגאן/","מצבר לרנו מגאן"],"סיאט|ארונה":["https://matzberimil.co.il/מצבר-לסיאט-ארונה/","מצבר לסיאט ארונה"],"סיאט|אטקה":["https://matzberimil.co.il/מצבר-לסיאט-אטקה/","מצבר לסיאט אטקה"],"סיאט|איביזה":["https://matzberimil.co.il/מצבר-לסיאט-איביזה/","מצבר לסיאט איביזה"],"סיאט|לאון":["https://matzberimil.co.il/מצבר-לסיאט-לאון/","מצבר לסיאט לאון"],"סיאט|טולדו":["https://matzberimil.co.il/מצבר-לסיאט-טולדו/","מצבר לסיאט טולדו"],"סקודה|פאביה":["https://matzberimil.co.il/מצבר-לסקודה-פאביה/","מצבר לסקודה פאביה"],"סקודה|קאמיק":["https://matzberimil.co.il/מצבר-לסקודה-קאמיק/","מצבר לסקודה קאמיק"],"סקודה|קארוק":["https://matzberimil.co.il/מצבר-לסקודה-קארוק/","מצבר לסקודה קארוק"],"סקודה|קודיאק":["https://matzberimil.co.il/מצבר-לסקודה-קודיאק/","מצבר לסקודה קודיאק"],"סקודה|אוקטביה":["https://matzberimil.co.il/מצבר-לסקודה-אוקטביה/","מצבר לסקודה אוקטביה"],"סקודה|ראפיד":["https://matzberimil.co.il/מצבר-לסקודה-ראפיד/","מצבר לסקודה ראפיד"],"סקודה|סקאלה":["https://matzberimil.co.il/מצבר-לסקודה-סקאלה/","מצבר לסקודה סקאלה"],"סקודה|סופרב":["https://matzberimil.co.il/מצבר-לסקודה-סופרב/","מצבר לסקודה סופרב"],"סקודה|ייטי":["https://matzberimil.co.il/מצבר-לסקודה-ייטי/","מצבר לסקודה ייטי"],"סובארו|B4":["https://matzberimil.co.il/מצבר-לסובארו-b4/","מצבר לסובארו B4"],"סובארו|קרוסטר":["https://matzberimil.co.il/מצבר-לסובארו-קרוסטרק/","מצבר לסובארו קרוסטרק"],"סובארו|פורסטר":["https://matzberimil.co.il/מצבר-לסובארו-פורסטר/","מצבר לסובארו פורסטר"],"סובארו|אימפרזה":["https://matzberimil.co.il/מצבר-לסובארו-אימפרזה/","מצבר לסובארו אימפרזה"],"סובארו|אאוטבק":["https://matzberimil.co.il/מצבר-לסובארו-אאוטבק/","מצבר לסובארו אאוטבק"],"סובארו|XV":["https://matzberimil.co.il/מצבר-לסובארו-xv/","מצבר לסובארו XV"],"סוזוקי|אלטו":["https://matzberimil.co.il/מצבר-לסוזוקי-אלטו/","מצבר לסוזוקי אלטו"],"סוזוקי|באלנו":["https://matzberimil.co.il/מצבר-לסוזוקי-באלנו/","מצבר לסוזוקי באלנו"],"סוזוקי|איגניס":["https://matzberimil.co.il/מצבר-לסוזוקי-איגניס/","מצבר לסוזוקי איגניס"],"סוזוקי|ג'ימני":["https://matzberimil.co.il/מצבר-לסוזוקי-גימני/","מצבר לסוזוקי ג'ימני"],"סוזוקי|ספלאש":["https://matzberimil.co.il/מצבר-לסוזוקי-ספלאש/","מצבר לסוזוקי ספלאש"],"סוזוקי|סוויפט":["https://matzberimil.co.il/מצבר-לסוזוקי-סוויפט/","מצבר לסוזוקי סוויפט"],"סוזוקי|SX4 קרוסובר":["https://matzberimil.co.il/מצבר-לסוזוקי-sx4/","מצבר לסוזוקי SX4 / קרוסאובר"],"סוזוקי|SX קרוסובר":["https://matzberimil.co.il/מצבר-לסוזוקי-sx4/","מצבר לסוזוקי SX4 / קרוסאובר"],"סוזוקי|ויטרה / גרנד ויטרה":["https://matzberimil.co.il/מצבר-לסוזוקי-ויטרה/","מצבר לסוזוקי ויטרה"],"טויוטה|אייגו":["https://matzberimil.co.il/מצבר-לטויוטה-אייגו/","מצבר לטויוטה אייגו"],"טויוטה|CHR":["https://matzberimil.co.il/מצבר-לטויוטה-chr/","מצבר לטויוטה CHR"],"טויוטה|קורולה":["https://matzberimil.co.il/מצבר-לטויוטה-קורולה/","מצבר לטויוטה קורולה"],"טויוטה|ראב 4 - RAV4":["https://matzberimil.co.il/מצבר-לטויוטה-ראב4/","מצבר לטויוטה ראב4"],"טויוטה|יאריס":["https://matzberimil.co.il/מצבר-לטויוטה-יאריס/","מצבר לטויוטה יאריס ויאריס קרוס"],"טויוטה|יאריס קרוס":["https://matzberimil.co.il/מצבר-לטויוטה-יאריס/","מצבר לטויוטה יאריס ויאריס קרוס"],"פורד|פוקוס":["https://matzberimil.co.il/מצבר-לפורד-פוקוס/","מצבר לפורד פוקוס"],"פורד|פיאסטה":["https://matzberimil.co.il/מצבר-לפורד-פיאסטה/","מצבר לפורד פיאסטה"],"פורד|קוגה":["https://matzberimil.co.il/מצבר-לפורד-קוגה/","מצבר לפורד קוגה"],"פורד|מונדאו":["https://matzberimil.co.il/מצבר-לפורד-מונדאו/","מצבר לפורד מונדאו"],"אופל|אסטרה":["https://matzberimil.co.il/מצבר-לאופל-אסטרה/","מצבר לאופל אסטרה"],"אופל|קורסה":["https://matzberimil.co.il/מצבר-לאופל-קורסה/","מצבר לאופל קורסה"],"אופל|אינסיגניה":["https://matzberimil.co.il/מצבר-לאופל-אינסיגניה/","מצבר לאופל אינסיגניה"],"אופל|מוקה":["https://matzberimil.co.il/מצבר-לאופל-מוקה/","מצבר לאופל מוקה"],"מרצדס|A-CLASS":["https://matzberimil.co.il/מצבר-למרצדס-a-class/","מצבר למרצדס A-Class"],"מרצדס|B-CLASS":["https://matzberimil.co.il/מצבר-למרצדס-b-class/","מצבר למרצדס B-Class"],"מרצדס|C-CLASS":["https://matzberimil.co.il/מצבר-למרצדס-c-class/","מצבר למרצדס C-Class"],"מרצדס|E-CLASS":["https://matzberimil.co.il/מצבר-למרצדס-e-class/","מצבר למרצדס E-Class"],"אאודי|A3":["https://matzberimil.co.il/מצבר-לאאודי-a3/","מצבר לאאודי A3"],"אאודי|A4":["https://matzberimil.co.il/מצבר-לאאודי-a4/","מצבר לאאודי A4"],"אאודי|Q3":["https://matzberimil.co.il/מצבר-לאאודי-q3/","מצבר לאאודי Q3"],"אאודי|Q5":["https://matzberimil.co.il/מצבר-לאאודי-q5/","מצבר לאאודי Q5"]};
var MFRS={"קיה":"https://matzberimil.co.il/manufacturer/קיה-kia/","יונדאי":"https://matzberimil.co.il/manufacturer/יונדאי-hyundai/","טויוטה":"https://matzberimil.co.il/manufacturer/טויוטה-toyota/","מאזדה":"https://matzberimil.co.il/manufacturer/מאזדה-mazda/","סקודה":"https://matzberimil.co.il/manufacturer/סקודה-skoda/","סוזוקי":"https://matzberimil.co.il/manufacturer/סוזוקי-suzuki/","ניסן":"https://matzberimil.co.il/manufacturer/ניסאן-nissan/","מיציבושי":"https://matzberimil.co.il/manufacturer/מיצובישי-mitsubishi/","סיאט":"https://matzberimil.co.il/manufacturer/סיאט-seat/","הונדה":"https://matzberimil.co.il/manufacturer/הונדה-honda/","בי-ווי-די - BYD":"https://matzberimil.co.il/manufacturer/byd/","אם ג׳י - MG":"https://matzberimil.co.il/manufacturer/אמ-גי-mg/","צ'רי":"https://matzberimil.co.il/manufacturer/צ׳רי-chery/","פיג'ו":"https://matzberimil.co.il/manufacturer/פיגו-peugeot/","סיטרואן":"https://matzberimil.co.il/manufacturer/סיטרואן-citroen/","רנו":"https://matzberimil.co.il/manufacturer/רנו-renault/","דאצ'יה":"https://matzberimil.co.il/manufacturer/דאציה-dacia/","סובארו":"https://matzberimil.co.il/manufacturer/סובארו-subaru/","פורד":"https://matzberimil.co.il/manufacturer/פורד-ford/","אופל":"https://matzberimil.co.il/manufacturer/אופל-opel/","מרצדס":"https://matzberimil.co.il/manufacturer/מרצדס-mercedes/","אאודי":"https://matzberimil.co.il/manufacturer/אאודי-audi/"};
function sel(id){var e=document.getElementById(id);if(!e)return"";var o=e.options&&e.options[e.selectedIndex];return((o&&o.text)||e.value||"").trim();}
function render(){
  var r=document.getElementById("result");if(!r)return;
  var old=r.querySelector(".mb-model-link");if(old)old.remove();
  if(!r.querySelector(".battery-card"))return;
  var m=sel("manufacturer"),d=sel("model");if(!m)return;
  var hit=MODELS[m+"|"+d],url,txt;
  if(hit){url=hit[0];txt="מדריך מלא: "+hit[1]+" - מחיר, סימנים והחלפה עד הבית";}
  else if(MFRS[m]){url=MFRS[m];txt="כל הדגמים של היצרן: מחירון, התאמה והחלפה עד הבית";}
  else return;
  var p=document.createElement("p");p.className="mb-model-link";
  var a=document.createElement("a");a.href=url;a.setAttribute("data-mb","model-link");a.textContent=txt;
  p.appendChild(a);
  var info=r.querySelector(".battery-info")||r.querySelector(".battery-card")||r;info.appendChild(p);
}
function start(){
  var r=document.getElementById("result");if(!r){setTimeout(start,500);return;}
  function ours(list){for(var j=0;j<list.length;j++){var n=list[j];if(n.nodeType===1&&n.classList.contains("mb-model-link"))return true;}return false;}
  new MutationObserver(function(ms){var ext=false;for(var i=0;i<ms.length;i++){if(!ours(ms[i].addedNodes)&&!ours(ms[i].removedNodes))ext=true;}if(ext)render();}).observe(r,{childList:true,subtree:true});
  render();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();
</script>
```

**ווידג'ט מספר רכב גרסה 1.3, התוכן החדש של 9620d08 (settings.html):**

```html
<!-- mb-plate: בדיקת מצבר לפי מספר רכב. ווידג'ט HTML נפרד שמוצב מעל המחשבון (b2279cb) בעמוד 3229. לא נוגע בקוד המחשבון: רק ממלא את #manufacturer/#model/#year ולוחץ #searchBtn. מקור: מאגר הרכב של משרד התחבורה (data.gov.il, ציבורי, בלי פרטי בעלים). להסרה: למחוק את הווידג'ט. גרסה 1.3, 8/11/2026 (1.1: הסרת מדינה עם גרשיים, ניקוי תוצאה קודמת, ניסוח; 1.2: השלמת שנה אחרי בחירת דגם ידנית דרך jQuery.one; 1.3: טקסט הסבר מורחב, מיפוי דגמי מרצדס C200D→C-CLASS וכו', אאודי ETRON). -->
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

## חלק 4: Search Console (נכס https://matzberimil.co.il/)
1. Sitemaps → `/sitemap.xml`: מספר הכתובות (צפי 262 = 254 + 8). אם עדיין 254: "שלח" מחדש פעם אחת.
2. URL Inspection ל-8 העמודים החדשים (`/מצבר-למרצדס-a-class/`, `-b-class/`, `-c-class/`, `-e-class/`, `/מצבר-לאאודי-a3/`, `-a4/`, `-q3/`, `-q5/`): אם "לא נמצא ב-Google" → "בקשת הוספה לאינדקס" פעם אחת לכל כתובת. לדווח מצב.

## חלק 5: llms.txt (הגדרות → llms.txt, textarea `mbll_content`)
גיבוי מלא ב-`g3_bk_llms` + SHA-256. 5 החלפות מדויקות (כל מחרוזת פעם אחת; אם לא נמצאת, לדלג ולדווח):
1. `סובארו, פורד, אופל ועוד.` → `סובארו, פורד, אופל, מרצדס, אאודי ועוד.`
2. אחרי השורה `- מצבר לאופל: https://matzberimil.co.il/manufacturer/אופל-opel/` להוסיף 2 שורות:
```
- מצבר למרצדס: https://matzberimil.co.il/manufacturer/מרצדס-mercedes/
- מצבר לאאודי: https://matzberimil.co.il/manufacturer/אאודי-audi/
```
3. `עמודי דגם נבחרים (120 דגמים באתר):` → `עמודי דגם נבחרים (128 דגמים באתר):`
4. `מצבר לאופל אסטרה https://matzberimil.co.il/מצבר-לאופל-אסטרה/ .` → `מצבר לאופל אסטרה https://matzberimil.co.il/מצבר-לאופל-אסטרה/ , מצבר למרצדס C-Class https://matzberimil.co.il/מצבר-למרצדס-c-class/ , מצבר לאאודי A4 https://matzberimil.co.il/מצבר-לאאודי-a4/ .`
5. `כל רכבי פורד ואופל - מצבר אירופאי קוטב ימין.` → `כל רכבי פורד ואופל - מצבר אירופאי קוטב ימין; מרצדס 2013+ (A/B/C/E-Class) - חובה AGM או EFB בסטארט סטופ, C-Class 80 אמפר AGM, E-Class 95 אמפר AGM בתא המטען, B-Class ישנה - מצבר מתחת לרצפת הנהג, ברבים מהדגמים גם מצבר עזר קטן; אאודי 2013+ (A3/A4/Q3/Q5) - 70 אמפר סטארט סטופ, A4/Q5 בחלק מהרכבים בתא המטען, A6/A7/A8/Q7 - 95 אמפר AGM בתא המטען; כל רכבי מרצדס ואאודי - מצבר אירופאי קוטב ימין.`
שמירה, ואז `/llms.txt` כאורח (אחרי Purge): 200, text/plain, מכיל "128 דגמים", "מצבר למרצדס:" ו"אאודי 2013+".

## חלק 6: Purge ובדיקות סיום
Breeze Purge All פעם אחת ("PURGE HH:MM"), ואז: 2 הרכזות כאורח (hub מוצג, 16 קישורים 200), llms.txt, 8 הבדיקות של חלק 3.

## דיווח חזרה
`[כרום HH:MM]`: לכל רכזת: HTML הרשימה לפני, ההחלפות שבוצעו, hash לפני/אחרי, 8 קישורים; TSF מרצדס (מה היה, מה הוזן); 3229: 4 hash לפני/אחרי, סוג df8d20d/89fd57d ומה נוסף, 8 בדיקות חיות עם הסטטוסים ב-dataLayer; GSC: sitemap + 8 כתובות; llms.txt: 5 החלפות + אימות חי; שעת Purge; כל חריגה עם פירוט.
