# פקודה לכרום: עיצוב v2 בצבעי הלוגו (19/11)

```
🔒 כללים
1. שלי בלבד: פריט Custom Code חדש אחד באלמנטור ("mb-design-v2"), ווידג'ט 9620d08 בעמוד 3229 (רק בלוק ה-<style> הראשון), GA4 בקריאה בלבד. לא Custom Code קיימים (4721, 5181), לא Site Settings, לא תבניות, לא post_content של עמודים, לא b2279cb/5c0b4e23/56251b3.
2. לא מתנתק, לא פרופיל אישי, לא סיסמה. wp-login → עוצר ומדווח "נדרשת התחברות".
3. אסור: Regenerate CSS, Experiments, Element Manager, עדכונים, תוספים.
4. Purge All פעם אחת בסוף + "PURGE HH:MM".
5. localStorage: מפתחות g7_ בלבד (g7_bk_3229), גיבוי + SHA-256 לפני כל שמירה.
6. אישור: הבעלים כתב "מאשר" לעיצוב בשיחה עם הסוכן. אם צריך, הוא יכתוב שורה בצ'אט שלך.
7. דיווח: [כרום HH:MM] + hash לפני/אחרי.
8. כלל קבוע לעמוד אלמנטור: לפני שמירה לרשום הגדרות עמוד; אחרי שמירה H1 יחיד, הגדרות ותבנית ללא שינוי.
```

## הקשר
אתר https://matzberimil.co.il ("מצבר הדרך"). שינוי עיצוב בלבד, בלי שינוי טקסט או HTML בעמודים:
- **עמודי הערים:** בלוק החיוג (`.mb-cta`) והפס הדביק במובייל (`.mb-sticky`) מקבלים עיצוב חדש דרך CSS אחד בפריט Custom Code נפרד. כדי לחזור אחורה: לכבות את הפריט.
- **מחשבון 3229:** מחליפים רק את ה-CSS בראש ווידג'ט "בדיקה לפי מספר רכב" (9620d08). ה-JS וה-HTML לא משתנים.
- צבעי הלוגו: כחול #253470, ענבר #F8A91F. וואטסאפ ירוק #168f47.

---

## חלק 0: בסיס מדידה ב-GA4 (קריאה בלבד, לפני כל שינוי)
GA4 (property 471722629), 28 הימים האחרונים: לדווח את מספר האירועים של לחיצות טלפון ולחיצות וואטסאפ (בשמות האירועים כפי שהם קיימים בחשבון), מפולח לפי עמוד: כל העמודים שמתחילים ב-`/service-areas/` (סך הכל + 5 המובילים), ו-`/battery-compatibility/`. וגם את `plate_lookup` (28 יום). אם קיים פרמטר שמבחין בין הכפתורים (data-mb / link_text / link_url), לפלח לפיו. לרשום את התאריכים המדויקים של הטווח.

## חלק 1: פריט Custom Code חדש
1. אלמנטור → Custom Code → Add New. שם: `mb-design-v2 (עיצוב כפתורי ערים)`. Location: `<head>`. Priority: ברירת מחדל.
2. הקוד (להדביק בדיוק, שורה אחת, 3,127 תווים, SHA-256 `ef9d7e4c7aa4ef8d651b794f789d37268f0d716c659d8972e83309b3a0965d4c`):
```
<style id="mb-design-v2">.mb-cta{background:#fff!important;border:1px solid #e8e8e8!important;border-radius:16px!important;padding:20px 16px 16px!important;box-shadow:0 1px 2px rgba(0,0,0,.04),0 6px 20px rgba(0,0,0,.06)!important}.mb-cta>p:first-child{font-size:19px!important;line-height:1.4!important;color:#253470!important;margin:0 0 16px!important;font-weight:700!important}.mb-cta a[data-mb]{display:inline-flex!important;align-items:center;justify-content:center;gap:8px;box-sizing:border-box;min-height:52px;min-width:220px!important;margin:4px!important;padding:12px 20px!important;border-radius:12px!important;font-size:18px!important;font-weight:700!important;line-height:1.2;text-decoration:none!important;-webkit-tap-highlight-color:transparent;transition:transform .1s ease-out,filter .1s ease-out}.mb-cta a[data-mb="city-hero-call"]{background:#F8A91F!important;color:#253470!important}.mb-cta a[data-mb="city-hero-wa"]{background:#168f47!important;color:#fff!important}.mb-cta a[data-mb]::before,.mb-sticky a::before{content:"";width:20px;height:20px;flex:0 0 20px;background:currentColor;-webkit-mask:var(--mb-ic) center/contain no-repeat;mask:var(--mb-ic) center/contain no-repeat}.mb-cta a[data-mb="city-hero-call"],.mb-sticky a.call{--mb-ic:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z'/%3E%3C/svg%3E")}.mb-cta a[data-mb="city-hero-wa"],.mb-sticky a.wa{--mb-ic:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 3C6.5 3 2 6.9 2 11.7c0 2.4 1.1 4.6 3 6.2L4.2 21.5l4-1.9c1.2.4 2.5.6 3.8.6 5.5 0 10-3.9 10-8.6S17.5 3 12 3z'/%3E%3C/svg%3E")}.mb-cta>p:last-child{font-size:14px!important;line-height:1.6!important;color:#555!important;margin:12px 0 0!important}.mb-cta a[data-mb]:active,.mb-sticky a:active{transform:scale(.97);filter:brightness(.92)}@media (max-width:600px){.mb-cta a[data-mb]{display:flex!important;width:100%;min-width:0!important;margin:0 0 8px!important}}@media (max-width:768px){.mb-sticky{gap:8px!important;padding:8px 10px calc(8px + env(safe-area-inset-bottom))!important;background:#fff!important;box-shadow:0 -1px 0 rgba(0,0,0,.08),0 -6px 18px rgba(0,0,0,.08)!important}.mb-sticky a{display:flex!important;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:10px 8px!important;border-radius:12px;font-size:17px!important;font-weight:700!important;-webkit-tap-highlight-color:transparent;transition:transform .1s ease-out,filter .1s ease-out}.mb-sticky a.call{flex:1.35!important;background:#F8A91F!important;color:#253470!important}.mb-sticky a.wa{flex:1!important;background:#168f47!important;color:#fff!important}body:has(.mb-sticky){padding-bottom:calc(72px + env(safe-area-inset-bottom))!important}}@media (prefers-reduced-motion:reduce){.mb-cta a[data-mb],.mb-sticky a{transition:none}.mb-cta a[data-mb]:active,.mb-sticky a:active{transform:none}}</style>
```
3. Conditions: Entire Site. Publish.
4. אימות אחרי Purge (חלק 3).

## חלק 2: ווידג'ט 9620d08 בעמוד 3229 (גרסה 1.5, עיצוב בלבד)
1. `GET /wp-json/wp/v2/pages/3229?context=edit` → `_elementor_data`, גיבוי ל-`g7_bk_3229`. hash של `settings.html` של 9620d08 (צפוי `4bdbe133…c38b`), b2279cb, 5c0b4e23, 56251b3. לרשום הגדרות עמוד (hide_title צפוי `yes`).
2. ב-`settings.html` של 9620d08: להחליף רק את התוכן שבין `<style>\n` הראשון לבין `</style>` הראשון (כלומר את שורות ה-CSS, בלי התגיות עצמן) בתוכן הבא, ואחריו שורה חדשה (`\n`):
```
#mb-plate{direction:rtl;text-align:right;border:1px solid #e8e8e8;border-radius:16px;padding:20px 16px;margin:0 0 18px;background:#fff;line-height:1.65;font-size:16px;box-shadow:0 1px 2px rgba(0,0,0,.04),0 6px 20px rgba(0,0,0,.06)}
#mb-plate h2{margin:0 0 8px;font-size:22px;line-height:1.25;color:#253470}
#mb-plate .mb-plate-sub{margin:0 0 14px;color:#4a4a4a;font-size:15px;line-height:1.65}
#mb-plate .mb-plate-row{display:flex;gap:8px;flex-wrap:wrap;align-items:stretch}
#mb-plate input{flex:1 1 180px;min-width:0;min-height:56px;box-sizing:border-box;font-size:24px;letter-spacing:.08em;padding:8px 12px;border:2px solid #111;border-radius:10px;background:#ffd400;color:#111;text-align:center;direction:ltr;font-weight:bold}
#mb-plate input:focus{outline:3px solid rgba(37,52,112,.35);outline-offset:2px}
#mb-plate button{flex:0 0 auto;min-height:56px;font-size:17px;font-weight:bold;padding:10px 22px;border:0;border-radius:12px;background:#253470;color:#fff;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .1s ease-out,filter .1s ease-out}
#mb-plate button:active{transform:scale(.97);filter:brightness(1.2)}
#mb-plate button:disabled{opacity:.6;cursor:wait}
#mb-plate .mb-plate-out{margin-top:12px;min-height:1em}
#mb-plate .mb-plate-out:not(:empty){background:#f3f5fb;border-radius:12px;padding:12px 14px}
#mb-plate .mb-plate-car{font-weight:bold;font-size:17px;color:#111}
#mb-plate .mb-plate-warn{color:#7a4300}
#mb-plate .mb-plate-err{color:#b00020}
#mb-plate .mb-plate-cta{margin-top:10px;display:flex;gap:8px;flex-wrap:wrap}
#mb-plate .mb-plate-cta a{flex:1 1 160px;display:flex;align-items:center;justify-content:center;min-height:48px;padding:10px 16px;border-radius:12px;font-weight:bold;text-decoration:none;color:#fff;-webkit-tap-highlight-color:transparent;transition:transform .1s ease-out}
#mb-plate .mb-plate-cta a:active{transform:scale(.97)}
#mb-plate .mb-plate-call{background:#F8A91F;color:#253470!important}
#mb-plate .mb-plate-wa{background:#168f47}
#mb-plate .mb-plate-note{font-size:13px;color:#6b6b6b;line-height:1.6;margin:12px 0 0}
#mb-plate .mb-plate-cta a{gap:8px}#mb-plate .mb-plate-cta a::before{content:"";width:20px;height:20px;flex:0 0 20px;background:currentColor;-webkit-mask:var(--mb-ic) center/contain no-repeat;mask:var(--mb-ic) center/contain no-repeat}#mb-plate .mb-plate-call{--mb-ic:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z'/%3E%3C/svg%3E")}#mb-plate .mb-plate-wa{--mb-ic:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 3C6.5 3 2 6.9 2 11.7c0 2.4 1.1 4.6 3 6.2L4.2 21.5l4-1.9c1.2.4 2.5.6 3.8.6 5.5 0 10-3.9 10-8.6S17.5 3 12 3z'/%3E%3C/svg%3E")}
@media (max-width:480px){#mb-plate button{flex:1 1 100%}}
@media (prefers-reduced-motion:reduce){#mb-plate button,#mb-plate .mb-plate-cta a{transition:none}#mb-plate button:active,#mb-plate .mb-plate-cta a:active{transform:none}}
```
3. **בדיקה לפני שמירה:** ה-`settings.html` החדש = 19,404 תווים, SHA-256 `ac6197639b0ee5a9530b4d28146cf43b8d60491b1597d3e8a037c90001128ae8`. אם לא תואם, לא לשמור ולדווח את ההפרש.
4. שמירה דרך Elementor `document/save` עם `settings:{post_status:'publish', hide_title:'yes', ...שאר הגדרות העמוד הקיימות}`. אימות: status publish; hash של b2279cb, 5c0b4e23, 56251b3 ללא שינוי; 9620d08 = `ac619763…`; אין שינוי אחר ב-`_elementor_data` מלבד נרמול מותר; H1 יחיד; hide_title עדיין yes; תבנית ללא שינוי.

## חלק 3: Purge ובדיקות
Purge All פעם אחת, "PURGE HH:MM". אחר כך, כאורח:
1. **כפר סבא** `/service-areas/מצבר-עד-הבית-בכפר-סבא/` ברוחב 390px:
   - כפתור החיוג בבלוק העליון: רקע `rgb(248, 169, 31)`, טקסט `rgb(37, 52, 112)`, רוחב מלא, גובה ≥52px, אייקון טלפון מוצג.
   - כפתור וואטסאפ: רקע `rgb(22, 143, 71)`.
   - הפס הדביק: מוצג בתחתית, 2 כפתורים מעוגלים, החיוג רחב יותר, צבעים כמו למעלה. הכפתורים הצפים הקיימים לא מוסתרים מתחתיו.
   - אין גלילה אופקית. `body` padding-bottom ≈ 72px.
   - הקישורים לא השתנו: `tel:055-5033335`, wa.me עם `?text=`, ו-`data-mb` כמו לפני.
   - בדסקטופ (1280px): 2 הכפתורים העליונים זה לצד זה, הפס הדביק מוסתר.
2. **עוד 2 עמודי ערים:** קדימה-צורן (5200) ותל אביב: אותן בדיקות בקצרה.
3. **דף הבית** ברוחב 390px: `body` padding-bottom **לא השתנה** (ה-CSS חל רק על עמודים עם `.mb-sticky`). H1 יחיד, אין גלילה אופקית.
4. **מחשבון 3229** ברוחב 390px: כפתור "בדקו" רקע `rgb(37, 52, 112)`, רוחב מלא. בדיקה עם 2622830 → פורד/פוקוס/2016, כרטיס התוצאה עם רקע תכלכל, כפתור חיוג ענבר וכפתור וואטסאפ ירוק, המחשבון מציג 70 אמפר סטארט סטופ. 0 שגיאות בקונסול.
5. צילומי מסך: כפר סבא ב-390px (בלוק עליון + פס תחתון) ומחשבון ב-390px אחרי בדיקה. לצרף לדיווח.

## דיווח מסכם
טבלת בסיס GA4 (חלק 0), ID של פריט ה-Custom Code ו-hash של הקוד, hash לפני/אחרי ל-9620d08 ול-`_elementor_data` של 3229, PURGE, תוצאות כל הבדיקות, צילומי המסך.
