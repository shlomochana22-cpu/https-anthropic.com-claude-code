# פלייבוק שדרוג עמוד עיר (מוכח על תל אביב)

השלבים המדויקים לשדרוג כל עמוד עיר, לפי הפיילוט שעבד על תל אביב. לכל עיר חוזרים על אותו רצף. כל השינויים דרך Claude בכרום, עם אימות.

## גוטצ'ות שחובה לזכור
- **Classic Editor: לעבוד רק במצב Text/Code, לא Visual.** מעבר ל-Visual מוחק תגיות `<script>` (TinyMCE מסנן). מטמיעים את ה-Schema במצב Text ושומרים משם.
- **FAQ Schema חייב להתאים מילה במילה ל-FAQ הגלוי בעמוד** (שדה qna של JetEngine, שונה בין ערים). חולצים פר-עמוד ובונים schema תואם. כולל סימני פיסוק (en-dash וכו').
- **לא מוסיפים LocalBusiness/Organization** בעמודי הערים — הם כבר קיימים סייטווייד (כפילות). מוסיפים רק Service + FAQPage. ה-Service מפנה ל-`@id` של ה-LocalBusiness: `https://matzberimil.co.il/#business`.
- מחיר ב-Offer: **379** (entry). GEO Box מציג רבדים: 379 קטן / 480 רגיל 45-50 / 749 סטארט סטופ.
- WPCode Lite ללא Conditional Logic + Snippet Manager חסום -> מטמיעים Schema **ישירות בגוף העמוד** (Text mode), לא ב-WPCode.

## רצף פר-עיר
1. **אבחון:** H1 יחיד? (אם כפול, השני ל-H2). יש כבר Service/FAQPage? (אם כן, לא להכפיל.)
2. **חילוץ FAQ:** קרא את זוגות השאלה+תשובה הגלויים (qna) מהעמוד, מילה במילה.
3. **אימות slugs מול הקטלוג האמיתי (שלב קבוע, חובה לפני הטמעה):** ה-slug של הערים אינו עקבי (חלק עם "ב", חלק בלי; אונו ביו"ד אחת). לפני שמירה, פתח כל אחד מ-5 קישורי הערים הסמוכות + 5 היצרנים + 5 הקיבולות מ-city-blocks.md, וודא שכל אחד מחזיר 200 (לא 404 ולא soft-404/הפניה לדף הבית). כל קישור שבור — תקן את ה-slug לפי הכתובת האמיתית מרשימת service-areas/manufacturer/capacity, או החלף בעיר סמוכה קיימת. אל תמציא slug.
4. **הטמעה (Classic Editor, Text mode):**
   - GEO Box (city-blocks.md, ספציפי לעיר) אחרי פסקת הפתיחה.
   - בלוק קישורים פנימיים בתחתית.
   - בלוק `<script application/ld+json>` (Service + FAQPage שנבנה מה-FAQ שחולץ) בתחתית. להישאר ב-Text mode ולשמור.
5. **cache:** WP Rocket Clear and Preload + Cloudways Purge.
6. **אימות:** רינדור תקין, הקישורים 200, Rich Results Test = FAQPage + Service תקפים, 0 שגיאות חדשות, ה-script לא מוצג כטקסט.

## תבנית ה-Schema (להחליף שם עיר + FAQ אמיתי)
```
<script type="application/ld+json">
{ "@context":"https://schema.org","@graph":[
 {"@type":"Service","serviceType":"החלפת מצבר עד הבית","name":"מצבר עד הבית ב[עיר]","provider":{"@id":"https://matzberimil.co.il/#business"},"areaServed":{"@type":"City","name":"[עיר]"},"offers":{"@type":"Offer","price":"379","priceCurrency":"ILS","description":"החלפת מצבר עד הבית, מחיר החל מ-379 שקל"}},
 {"@type":"FAQPage","mainEntity":[ /* כאן זוגות ה-FAQ האמיתיים מהעמוד, מילה במילה */ ]}
]}
</script>
```

## סדר ביצוע הערים (לפי עדיפות)
1. תל אביב ✅ (בוצע, מאומת)
2. ראשון לציון · 3. פתח תקווה · 4. חולון · 5. בת ים  (ערי הליבה)
ואז: רמת גן, נתניה, רחובות, אשדוד, מודיעין, ושאר ה-38.

## חומרים בענף
city-blocks.md (GEO Box + קישורים ל-10 ערים), cities-schema.md (תבניות Service/FAQ), schema-tel-aviv-full.html.
