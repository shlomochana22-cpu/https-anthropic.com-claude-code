# -*- coding: utf-8 -*-
import re, glob, os
BASE="https://matzberimil.co.il/"
OUT="/home/user/https-anthropic.com-claude-code/models"

# file -> (brand, slug, display)
M = {
 # KIA
 "kia-sportage":("kia","מצבר-לקיה-ספורטג","קיה ספורטג'"),
 "kia-picanto":("kia","מצבר-לקיה-פיקנטו","קיה פיקנטו"),
 "kia-niro":("kia","מצבר-לקיה-נירו","קיה נירו"),
 "kia-rio":("kia","מצבר-לקיה-ריו","קיה ריו"),
 "kia-sorento":("kia","מצבר-לקיה-סורנטו","קיה סורנטו"),
 "kia-ceed":("kia","מצבר-לקיה-סיד","קיה סיד"),
 "kia-forte":("kia","מצבר-לקיה-פורטה","קיה פורטה"),
 "kia-stonic":("kia","מצבר-לקיה-סטוניק","קיה סטוניק"),
 "kia-seltos":("kia","מצבר-לקיה-סלטוס","קיה סלטוס"),
 "kia-soul":("kia","מצבר-לקיה-סול","קיה סול"),
 "kia-carnival":("kia","מצבר-לקיה-קרניבל","קיה קרניבל"),
 "kia-cerato":("kia","מצבר-לקיה-סראטו","קיה סראטו"),
 # TOYOTA
 "toyota-corolla":("toyota","מצבר-לטויוטה-קורולה","טויוטה קורולה"),
 "toyota-chr":("toyota","מצבר-לטויוטה-chr","טויוטה CHR"),
 "toyota-aygo":("toyota","מצבר-לטויוטה-אייגו","טויוטה אייגו"),
 "toyota-yaris":("toyota","מצבר-לטויוטה-יאריס","טויוטה יאריס"),
 "toyota-rav4":("toyota","מצבר-לטויוטה-ראב4","טויוטה ראב4"),
 # HYUNDAI
 "hyundai-i10":("hyundai","מצבר-ליונדאי-i10","יונדאי i10"),
 "hyundai-i20":("hyundai","מצבר-ליונדאי-i20","יונדאי i20"),
 "hyundai-i25":("hyundai","מצבר-ליונדאי-i25","יונדאי i25"),
 "hyundai-accent":("hyundai","מצבר-ליונדאי-אקסנט","יונדאי אקסנט"),
 "hyundai-i30":("hyundai","מצבר-ליונדאי-i30","יונדאי i30"),
 "hyundai-i35":("hyundai","מצבר-ליונדאי-i35","יונדאי i35"),
 "hyundai-getz":("hyundai","מצבר-ליונדאי-גטס","יונדאי גטס"),
 "hyundai-tucson":("hyundai","מצבר-ליונדאי-טוסון","יונדאי טוסון"),
 "hyundai-ix35":("hyundai","מצבר-ליונדאי-ix35","יונדאי ix35"),
 "hyundai-kona":("hyundai","מצבר-ליונדאי-קונה","יונדאי קונה"),
 "hyundai-ioniq":("hyundai","מצבר-ליונדאי-איוניק","יונדאי איוניק"),
 "hyundai-santafe":("hyundai","מצבר-ליונדאי-סנטה-פה","יונדאי סנטה פה"),
 "hyundai-elantra":("hyundai","מצבר-ליונדאי-אלנטרה","יונדאי אלנטרה"),
}
BRAND_HE = {"kia":"קיה","toyota":"טויוטה","hyundai":"יונדאי"}
# popular pool per brand (order = priority)
POP = {
 "kia":["kia-sportage","kia-picanto","kia-niro","kia-sorento","kia-rio","kia-ceed"],
 "toyota":["toyota-corolla","toyota-yaris","toyota-rav4","toyota-chr","toyota-aygo"],
 "hyundai":["hyundai-i20","hyundai-tucson","hyundai-santafe","hyundai-i10","hyundai-i30","hyundai-ioniq"],
}

def siblings(key, brand):
    pool=[k for k in POP[brand] if k!=key]
    return pool[:4]

changed=[]
for key,(brand,slug,disp) in M.items():
    p=os.path.join(OUT, key+".html")
    t=open(p,encoding="utf-8").read()
    if "דגמי "+BRAND_HE[brand]+" נוספים" in t:
        continue  # already has crosslinks
    sibs=siblings(key,brand)
    links=" | ".join(f'<a href="{BASE}{M[s][1]}/">{M[s][2]}</a>' for s in sibs)
    newp=f'  <p style="line-height:2;"><strong>דגמי {BRAND_HE[brand]} נוספים:</strong> {links}</p>\n'
    # insert before the </div> that precedes the JSON-LD script
    pat=re.compile(r'(</p>\s*)(</div>\s*<script type="application/ld\+json">)', re.S)
    t2,n = pat.subn(lambda m: m.group(1)+newp+m.group(2), t, count=1)
    if n!=1:
        print("!! pattern not matched:", key); continue
    open(p,"w",encoding="utf-8").write(t2)
    changed.append(key)

print(f"updated {len(changed)} files")
for c in sorted(changed): print(" ",c)
