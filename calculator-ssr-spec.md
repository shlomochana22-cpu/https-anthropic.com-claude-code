# מפרט SSR למחשבון המצברים — להעברה למתכנת

מטרה: שהמחשבון ב-/battery-compatibility/ ימשיך לעבוד כרגיל למשתמש, ובמקביל **נתוני הקטלוג יופיעו כ-HTML גולמי בקוד המקור** (Server-Side Rendering), כך שגוגל ו-AI (ChatGPT/Perplexity) יקראו ויצטטו אותם. כיום הנתונים נטענים רק דרך AJAX (api.php) ולכן בלתי-נראים לבוטים.

## רקע טכני (מצב קיים)
- עמוד WordPress (post 3229), Elementor, מטמיע מחשבון JS.
- נתונים ב-MySQL (DB `sppjjpgqeu`), 4 טבלאות: `manufacturers` (51), `models` (547), `vehicles` (762), `batteries` (757).
- שירות הנתונים: `/dev/api.php` ב-AJAX. הזרימה: יצרן -> דגם -> שנה -> כרטיס תוצאה (אמפר, קוטב, סוג מנוע).
- הבעיה: בקוד המקור (raw HTML) הבוררים ריקים; כל הקטלוג מוזרק ב-JS אחרי טעינה -> בוטים רואים מעטפת ריקה.

## העיקרון
PHP שולף מה-DB בזמן טעינת העמוד ומדפיס את הקטלוג כ-HTML. ה-JS הקיים נשאר לאינטראקטיביות; הנתונים כבר בקוד. מקור אחד (ה-DB), בלי טבלה ידנית מקבילה, מתעדכן אוטומטית.

## מה לרנדר server-side (3 רבדים, לפי עדיפות)
1. **אפשרויות בורר היצרנים** — להדפיס את 51 היצרנים כ-`<option>` בתוך ה-`<select>` של היצרן כבר ב-HTML (במקום placeholder ריק). זה הזול והבטוח ביותר ומיד נותן לגוגל את רשימת היצרנים.
2. **בלוק קטלוג זוחל** מתחת/ליד המחשבון — לולאה על הרכבים המפיקה HTML קריא ומקושר, מקובץ לפי יצרן ודגם. זה ה-GEO gold (מה ש-AI מצטט). דוגמה לפריט:
   `<h3>מצבר לטויוטה קורולה</h3><p>טויוטה קורולה (2013-2018): מצבר בקיבולת 62 אמפר, קוטב ימין, מנוע בנזין. מחיר החל מ-379 ש"ח, אחריות 12-24 חודשים, התקנה עד הבית 24/7. טלפון 055-5033335.</p>`
3. **Schema (JSON-LD)** — מאחר שזה PHP, אפשר להדפיס `<script type="application/ld+json">` בחופשיות (בניגוד ל-term_content/Elementor שמסרסים scripts): ItemList של רכב->מצבר, ו/או Service. זה הערוץ הנכון לסכמה שחיפשנו.

## דרך מימוש מומלצת (WordPress shortcode)
- ליצור shortcode (למשל `[battery_catalog]`) ב-functions.php של תבנית-הבת (hello-elementor-child) — עריכת functions.php היא קוד לגיטימי, **לא** התקנת תוסף.
- ה-shortcode שולף מה-DB (אותו DB של api.php), מקבץ לפי יצרן->דגם, ומחזיר את ה-HTML של רבדים 2+3.
- להציב את ה-shortcode בעמוד (ווידג'ט shortcode ב-Elementor) מתחת למחשבון.
- את רובד 1 (אפשרויות הבורר) — או דרך אותו shortcode שמרנדר את ה-select מראש, או תיקון קטן בתבנית המחשבון.

## דוגמת קוד עקרונית (המתכנת יתאים לשמות העמודות/הקשרים האמיתיים)
```php
add_shortcode('battery_catalog', function () {
    // cache: הקטלוג כמעט לא משתנה -> לשמור transient ולא לשאול 762 שורות בכל טעינה
    if (false !== ($html = get_transient('battery_catalog_html'))) return $html;

    global $wpdb; // או mysqli לאותו DB sppjjpgqeu (כמו api.php)
    // התאם את שמות הטבלאות/העמודות לסכמה האמיתית:
    $rows = $wpdb->get_results("
        SELECT m.name AS manufacturer, mo.name AS model,
               v.year_from, v.year_to, v.ampere, v.polarity, v.engine
        FROM vehicles v
        JOIN models mo ON v.model_id = mo.id
        JOIN manufacturers m ON mo.manufacturer_id = m.id
        ORDER BY m.name, mo.name, v.year_from
    ");

    $out = '<section class="battery-catalog" dir="rtl"><h2>טבלת התאמת מצבר לכל דגמי הרכב</h2>';
    $items = [];
    foreach ($rows as $i => $r) {
        $title = "מצבר ל{$r->manufacturer} {$r->model}";
        $years = $r->year_from . ($r->year_to ? "-{$r->year_to}" : '');
        $out .= "<div><h3>{$title} {$years}</h3>"
              . "<p>{$r->manufacturer} {$r->model} ({$years}): מצבר בקיבולת {$r->ampere} אמפר, קוטב {$r->polarity}, מנוע {$r->engine}. "
              . "מחיר החל מ-379 ש\"ח, אחריות 12-24 חודשים, התקנה עד הבית 24/7. טלפון 055-5033335.</p></div>";
        $items[] = '{"@type":"ListItem","position":'.($i+1).',"name":"'.esc_js($title).' '.$years.' - '.$r->ampere.' אמפר"}';
    }
    $out .= '</section>';
    $out .= '<script type="application/ld+json">{"@context":"https://schema.org","@type":"ItemList","name":"התאמת מצבר לדגמי רכב","itemListElement":['.implode(',', $items).']}</script>';

    set_transient('battery_catalog_html', $out, DAY_IN_SECONDS);
    return $out;
});
```

## שיקולי ביצועים (קריטי — העמוד כבר איטי)
- **חובה cache** (transient/אובייקט) — לא לשאול 762 שורות בכל טעינה.
- אפשר להגביל את הבלוק הזוחל ל-Top-N דגמים פופולריים + קישור "כל הדגמים", אם 762 כבדים מדי לעמוד אחד.
- לבדוק LCP/PSI אחרי (העמוד היה איטי גם קודם).

## בטיחות ביצוע
1. גיבוי functions.php (.bak) לפני עריכה.
2. לבדוק בסביבת staging/clone אם אפשר, או בזהירות בשעה שקטה.
3. אחרי הטמעה לאמת: (א) המחשבון האינטראקטיבי עדיין עובד; (ב) view-source גולמי מציג את הקטלוג והסכמה; (ג) אין שגיאות PHP/קונסול; (ד) PSI לא צנח.
4. הכל הפיך: הסרת ה-shortcode מהעמוד + מחיקת הפונקציה מ-functions.php.

## הרחבה עתידית (long-tail מלא)
לאחר ש-SSR עובד: לשקול עמוד אינדקסבילי לכל דגם פופולרי ("מצבר לטויוטה קורולה") עם rewrite rules — מקסימום ערך long-tail, אבל פרויקט נפרד.
