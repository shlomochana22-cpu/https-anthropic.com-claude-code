# מצבר הדרך, חבילת SEO + GEO מוכנה

תוצרי עבודה מבוססי-קבצים לפרויקט הקידום של matzberimil.co.il. כל מה שכאן מוכן להעתקה לאתר. הקבצים נכתבו לפי כללי הברזל בהנדאוף (בלי מקפים ארוכים, פרטי עסק מדויקים, 24/7).

הערה: זהו ענף נפרד ועצמאי לחלוטין, ללא קשר לפרויקט NEXUS שנמצא בענף אחר באותו ריפו.

## מבנה

```
README.md                     # הקובץ הזה
llms.txt                      # קובץ GEO לבוטים של AI, להעלות לשורש האתר
claude-chrome-prompt.md       # פרומפטים מוכנים ל-Claude בכרום, לעבודה על האתר החי
blog/                         # 10 מאמרים, נקיים ומוכנים לפרסום
  01-battery-prices-2026.md
  02-agm-vs-efb.md
  03-signs-battery-dying.md
  04-alternator-vs-battery.md
  05-battery-lifespan-israel.md
  06-start-stop-battery.md
  07-varta-bosch-shnaf-comparison.md
  08-car-wont-start.md
  09-winter-vs-summer.md
  10-hybrid-battery.md
schema/
  homepage-schema.html        # Schema לדף הבית (LocalBusiness + Organization + WebSite + BreadcrumbList + FAQ)
  cities-schema.md            # Schema ל-10 הערים המובילות (Service + FAQ לכל עיר)
  schema-tel-aviv-full.html   # Schema מלא ומאומת לעמוד תל אביב
```

## מה נעשה כאן

1. בלוג: 3 המאמרים הקיימים נוקו (הוסרו רווחים מיותרים בתוך מילים ותווים לטיניים שגויים), ו-7 מאמרים חדשים נכתבו במלואם לפי המתווה. כולם בסגנון מנצח ל-AI: תשובה ישירה בפסקה ראשונה, ואז כותרות וטבלאות. בלי מקפים ארוכים.
2. Schema לדף הבית נוצר מאפס (היה חסר). שאר ה-Schema של הערים הועתק מההנדאוף (כבר היה נקי).
3. llms.txt נוצר לכל האתר.

## מה דורש גישה לאתר (בקובץ claude-chrome-prompt.md)

אבטחה, הטמעת Schema ב-WPCode, עריכת עמודי Elementor, העלאת llms.txt, פרסום פוסטים, ביצועים, ותגובה לביקורת. כל אלה דורשים גישה ל-WordPress/אחסון/גוגל, ולכן הוכנו כפרומפטים מוכנים להדבקה ל-Claude שרץ בדפדפן.

## לפני פרסום, חובה

- Schema של דף הבית: החלף את 13 שאלות ה-FAQ בשאלות האמיתיות מהעמוד (מסומן בקובץ).
- Schema של כל עיר: השווה את השאלות לעמוד האמיתי והתאם, ועדכן דירוג אם השתנה.
- אבטחה קודם לכל. אל תפרסם תוכן לפני שהאתר נקי ומאובטח.
```
