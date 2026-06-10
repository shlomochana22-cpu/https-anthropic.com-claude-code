# גיליון ביצוע ל-Cloudways, ניקוי סופי, מצבר הדרך

להרצה כשיש גישת Cloudways (SSH או File Manager + phpMyAdmin). בסיס הנתיב של האפליקציה:
`/home/1557880.cloudwaysapps.com/sppjjpgqeu/public_html/`

עקרון: לפני כל מחיקה, להריץ קודם את פקודת ה-list/grep, להראות לי את התוצאה, ורק אז למחוק. גיבוי לפני הכל.

מצב נוכחי שכבר טופל מ-wp-admin: הסקימר לא מוגש (תחזוקה+Canvas), WPCode מושבת, תיבת Footer נוקתה. נשאר: mu-plugin, backdoor plugin, css.js, קבצי תבנית, וניקוי DB.

---

## שלב 0: גיבוי
ב-Cloudways: Application -> Backup -> "Take Backup Now". המתן לסיום לפני שממשיכים.

## שלב 1: סיבוב סיסמאות (לפני המחיקות, מונע הזרקה חוזרת)
ב-Cloudways: Master Credentials (סיסמת שרת SSH/SFTP), Application Credentials (SFTP של האפליקציה), ו-Database password. בדוק Server -> SSH/SFTP ו-Team Members והסר גישות לא מזוהות.
ב-wp-cli (אם DB password השתנה, Cloudways מעדכן את wp-config אוטומטית; אם לא, עדכן ידנית).
החלף Salts:
```
wp config shuffle-salts
```

## שלב 2: זיהוי כל ההזרקות (read-only, לפני מחיקה)
דרך SSH, מתוך public_html:
```
# כל הקבצים שמכילים את הלואדר או דומייני התוקף
grep -rIl --include=*.php --include=*.js -e "performance_optimizer_v6" -e "ntdnewtds" -e "dnsnewtds" -e "tji-" wp-content/
# קבצי PHP שעודכנו ב-120 הימים האחרונים (מועמדים להזרקה)
find wp-content -name "*.php" -mtime -120 -printf "%TY-%Tm-%Td  %p\n" | sort
# תוכן תיקיית mu-plugins
ls -la wp-content/mu-plugins/
```
הראה לי את הפלט לפני מחיקה.

## שלב 3: מחיקת הקבצים הזדוניים הוודאיים
```
# ה-backdoor (תיקייה שלמה)
rm -rf wp-content/plugins/wp-default-deployer-modified/
# הסקימר
rm wp-content/themes/hello-elementor/css.js
```
ה-mu-plugin: לפי מה ששלב 2 מצא ב-wp-content/mu-plugins/ (הקובץ שמכיל tji / performance_optimizer_v6). הצג אותו, ואז:
```
rm wp-content/mu-plugins/<FILENAME>.php
```
(אם mu-plugins מכילה רק את הקובץ הזדוני, אפשר גם להסיר את כולה. drop-ins לגיטימיים כמו advanced-cache.php יושבים ב-wp-content עצמו, לא ב-mu-plugins.)

## שלב 4: ניקוי קבצי התבנית
תבנית האם (הדרך הנקייה, דורסת header.php/footer.php/functions.php מודבקים):
```
wp theme install hello-elementor --force
```
תבנית הבת, בדיקה ידנית (יש בה התאמות לגיטימיות):
```
grep -n -e "performance_optimizer_v6" -e "atob" -e "tji-" -e "css.js" wp-content/themes/hello-elementor-child/functions.php
```
אם נמצא, ערוך את הקובץ והסר רק את הקוד הזדוני (כולל שורת טעינת css.js אם קיימת). בדוק גם את style.css ל-CSS/קוד זר.

## שלב 5: ניקוי DB
מחיקת המנהלים הזדוניים:
```
wp user delete seobackup --reassign=<ID_של_matzberimil>
wp user delete dev_ijeiawo7 --reassign=<ID_של_matzberimil>
wp user delete cloudhdigital --reassign=<ID_של_matzberimil>
```
(מצא ID של matzberimil עם: `wp user list --role=administrator`)
מנהלים נסתרים:
```
wp user list --field=user_login --role=administrator
```
הסניפט הזדוני של WPCode (post_type=wpcode):
```
wp post list --post_type=wpcode --fields=ID,post_title,post_status
```
הצג לי, ואז מחק את הזדוני: `wp post delete <ID> --force`
בדיקת cron זדוני:
```
wp cron event list
```
הצג לי hooks חשודים לפני הסרה.

## שלב 6: עדכונים והקשחה
```
wp plugin update --all
wp core update
wp theme update --all
```
(במיוחד: JetSmartFilters, JetEngine, JetTabs, Elementor Pro, Breeze, Classic Editor, Hello Elementor.)
הוסף ל-wp-config.php:
```
define('DISALLOW_FILE_EDIT', true);
```

## שלב 7: אימות
```
# צריך לחזור ריק לגמרי:
grep -rIl --include=*.php --include=*.js -e "performance_optimizer_v6" -e "ntdnewtds" -e "dnsnewtds" -e "tji-" wp-content/
```
ואז: הרץ Wordfence Scan מלא -> 0 ממצאים. בדוק view-source אנונימי של דף הבית -> אין performance_optimizer_v6 / atob / tji / css.js.

## שלב 8: החזרת האתר לאוויר
1. הפעל מחדש את WPCode רק אחרי שווידאנו שהסניפט הזדוני נמחק מה-DB (או התקן מחדש נקי). לחלופין, השאר מושבת והתקן את הסכמה בדרך אחרת.
2. כבה את מצב התחזוקה ב-Elementor (Tools -> Maintenance Mode -> Disabled).
3. נקה cache של WP Rocket.
4. התקן את הסכמה הנקייה לדף הבית (homepage-schema.html).
5. ניטור 48-72 שעות: ודא ש-performance_optimizer_v6 והמנהלים הזדוניים לא חוזרים.

---

## גרסת File Manager (אם אין SSH)
אותם צעדים דרך Cloudways File Manager: נווט ל-public_html, מחק ידנית את התיקייה wp-content/plugins/wp-default-deployer-modified/, את wp-content/themes/hello-elementor/css.js, ואת הקובץ הזדוני ב-wp-content/mu-plugins/. את ניקוי ה-DB והמנהלים עשה דרך phpMyAdmin או דרך wp-admin (Users). עדכונים דרך wp-admin (Plugins/Updates).
