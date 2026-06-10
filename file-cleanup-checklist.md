# רשימת ניקוי ברמת קבצים, מצבר הדרך (דרך Cloudways File Manager / SFTP)

להרצה כש-Claude כרום מקבל גישה ל-File Manager של Cloudways. לפני הכל: גיבוי מלא, ואחרי הניקוי: סיבוב כל הסיסמאות. מצב התחזוקה כבר פעיל, אז אפשר לעבוד בלי שמבקרים נחשפים.

חוק קבוע: לפני מחיקה/שינוי של כל פריט, הראה לי אותו ותן לי לאשר.

## א. למחוק לחלוטין (קבצים זדוניים ודאיים)

1. התיקייה כולה: `wp-content/plugins/wp-default-deployer-modified/`
   (מכילה את wp-phpunit.php, ה-backdoor עם exec. זה מנוע השחזור.)
2. הקובץ: `wp-content/themes/hello-elementor/css.js`
   (סקימר כרטיסי אשראי. אינו חלק מהתבנית הרשמית.)

## ב. לסרוק את תיקיית התוספים לעוד backdoors מתחבאים

ב-File Manager, פתח את `wp-content/plugins/` ורשום את כל התיקיות. השווה ל-23 התוספים הרשומים בדשבורד. כל תיקייה שאינה תואמת לתוסף רשום (כמו wp-default-deployer-modified) חשודה, פתח אותה, הראה לי, ונחליט. בדוק גם את `wp-content/mu-plugins/` אם קיימת (נטענת אוטומטית, מקום אהוב על backdoors).

## ג. לנקות את קבצי התבנית המודבקים

תבנית האם (hello-elementor), הדרך הבטוחה: התקנה מחדש נקייה.
- Appearance -> Themes, ודא שהתבנית הפעילה היא הבת (hello-elementor-child).
- מחק את תבנית האם hello-elementor והתקן אותה מחדש מ-WordPress.org (Add New -> חפש Hello Elementor -> Install). זה דורס את header.php, footer.php, functions.php המודבקים בקבצים נקיים מקוריים.
- שים לב: התקנה מחדש לא מוחקת קבצים זרים כמו css.js, לכן סעיף א'2 (מחיקת css.js) חייב להתבצע בנפרד.

תבנית הבת (hello-elementor-child), בדיקה ידנית (כי יש בה התאמות לגיטימיות):
- `functions.php`: פתח, חפש קוד מוזרק, במיוחד שורה שטוענת/מכניסה את css.js (wp_enqueue_script / wp_enqueue_style עם css.js), או קוד base64/eval/<script>. הסר רק את הזדוני, השאר את הקוד הלגיטימי. הראה לי לפני.
- `style.css`: סקימרים לפעמים מתחבאים בתחתית/ראש הקובץ. סקור, הסר כל קוד שאינו CSS לגיטימי. השאר את העיצוב.
- `screenshot.png`: זו רק תמונת תצוגה של התבנית, לא פונקציונלי. אם Wordfence סימן אותה כמשונה, אפשר להחליף בתמונה רגילה או למחוק, בלי השפעה על האתר.

## ד. WPCode (דרך wp-admin, לא צריך קבצים)

WPCode -> Header & Footer: בקטע Header ובקטע Footer, מחק את הקוד הזדוני (__performance_optimizer_v6 / atob / הדומיינים). הסכמה הלגיטימית ארוזה איתו, אל תשמור אותה, נתקין סכמה נקייה בנפרד.

## ה. בסיס נתונים (phpMyAdmin דרך Cloudways)

בקריאה בלבד תחילה, ואז ניקוי לפי הצורך:
- מחיקת המנהלים: seobackup, dev_ijeiawo7, cloudhdigital. (אפשר גם דרך Users ב-wp-admin.)
- בדיקת cron זדוני: SELECT option_value FROM wp_options WHERE option_name='cron'; הסר hooks חשודים.
- בדיקת מנהלים נסתרים: SELECT user_id FROM wp_usermeta WHERE meta_key='wp_capabilities' AND meta_value LIKE '%administrator%';

## ו. סיבוב סיסמאות (חובה, אחרי הניקוי)

Cloudways Master, SFTP/SSH של השרת והאפליקציה, סיסמת DB (+ עדכון wp-config.php), סיסמאות כל המנהלים, ו-Salts ב-wp-config.php. בדוק ב-Cloudways רשימת SSH/SFTP ו-Team Members והסר גישות לא מזוהות.

## ז. עדכונים והקשחה

עדכן את התוספים הפגיעים: JetSmartFilters (קריטי), Classic Editor, JetEngine, JetTabs, Elementor Pro, Breeze, ותבנית Hello Elementor. הוסף ב-wp-config.php: define('DISALLOW_FILE_EDIT', true);

## ח. אימות וסיום

1. הרץ Wordfence Scan מלא, ודא שהוא נקי (0 ממצאים זדוניים).
2. בדוק קוד מקור של דף הבית + חולון/ראשון לציון/בת ים, ודא ש-__performance_optimizer_v6, atob ו-css.js נעלמו.
3. כבה את מצב התחזוקה ב-Elementor.
4. נקה cache של WP Rocket.
5. התקן את ה-Schema הנקי לדף הבית (homepage-schema.html).
6. ניטור 48-72 שעות: ודא שהקבצים והמנהלים לא חוזרים.

## סדר ביצוע

גיבוי -> סיבוב סיסמאות (ו') -> מחיקות (א', ב') -> ניקוי תבנית (ג') -> WPCode (ד') -> DB ומנהלים (ה') -> עדכונים (ז') -> אימות (ח').
הערה: סיבוב הסיסמאות לפני המחיקות מבטיח שהתוקף לא יזריק מחדש תוך כדי שאנחנו מנקים.
