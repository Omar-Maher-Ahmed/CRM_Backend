# 🔄 مسار الصفقات: من الحفظ التقني إلى الإدارة (Deal Lifecycle)

لجعل الرؤية أوضح وأكثر راحة للعين، قمنا بفصل **المسار التقني (الذي يستغرق أجزاء من الثانية)** عن **المسار الإداري (الذي يستغرق أياماً أو شهوراً)**، حيث أن المسار الإداري لا يبدأ إلا بعد نجاح المسار التقني.

---

## ⚙️ 1. الجانب التقني: عملية حفظ الصفقة (Database Transaction)
هذا المخطط التسلسلي (Sequence Diagram) يوضح ما يحدث في "الخلفية" بمجرد ضغط موظف المبيعات على زر **حفظ**.

```mermaid
sequenceDiagram
    autonumber
    actor User as 👨‍💼 موظف المبيعات
    participant API as 🌐 السيرفر (DealService)
    participant DB as 🗄️ قاعدة البيانات (Transaction)

    User->>API: 1. إرسال بيانات الصفقة + المنتجات
    
    rect rgb(240, 248, 255)
        note right of API: ⚡ بدء الـ Transaction
        API->>DB: 2. إنشاء الصفقة (Deals Table)
        
        alt ❌ فشل الاتصال
            DB-->>API: خطأ (Error)
            API-->>DB: التراجع عن كل شيء (ROLLBACK)
        else ✅ نجاح حفظ الصفقة
            DB-->>API: تم إنشاء الصفقة (Deal ID)
            API->>DB: 3. إدخال المنتجات (Deal_Products)
            
            alt ❌ فشل في إدخال المنتجات
                DB-->>API: خطأ (Error)
                API-->>DB: التراجع وحذف الصفقة (ROLLBACK)
            else ✅ نجاح حفظ المنتجات
                API-->>DB: تثبيت البيانات نهائياً (COMMIT)
                DB-->>API: حفظ ناجح 100%
                API-->>User: 🎉 تم إنشاء الصفقة بنجاح!
            end
        end
    end
```

---

## 💼 2. الجانب الإداري: دورة حياة الصفقة (Deal Stages)
بمجرد نجاح العملية التقنية بالأعلى، تظهر الصفقة في النظام وتبدأ دورتها الإدارية التي يتفاعل معها فريق المبيعات. استخدمنا هنا (Flowchart) بتسلسل من اليسار لليمين مريح للعين، مع ألوان تعبر عن حالة الصفقة.

```mermaid
flowchart LR
    %% ستايلات مخصصة لشكل أجمل
    classDef newDeal fill:#e3f2fd,stroke:#1e88e5,stroke-width:2px,color:#0d47a1
    classDef processing fill:#fff3e0,stroke:#fb8c00,stroke-width:2px,color:#e65100
    classDef won fill:#e8f5e9,stroke:#43a047,stroke-width:2px,color:#1b5e20
    classDef lost fill:#ffebee,stroke:#e53935,stroke-width:2px,color:#b71c1c
    classDef activity fill:#f3e5f5,stroke:#8e24aa,stroke-width:1px,stroke-dasharray: 5 5

    %% العقد والمراحل
    Start((بدء)) --> Stage1
    
    Stage1["🆕 مرحلة: New\n(صفقة جديدة)"]:::newDeal
    Stage2["📞 مرحلة: Discovery\n(فهم الاحتياج)"]:::processing
    Stage3["🤝 مرحلة: Negotiation\n(مفاوضات وعروض)"]:::processing
    
    Won{"🏆 تم البيع\n(Closed Won)"}:::won
    Lost{"❌ خسرنا الصفقة\n(Closed Lost)"}:::lost

    %% المسار
    Stage1 --> Stage2
    Stage2 --> Stage3
    Stage3 -->|وافق العميل| Won
    Stage3 -->|رفض العميل| Lost

    %% الأنشطة الجانبية
    Act1["📝 تسجيل مكالمة"]:::activity
    Act2["📧 إرسال إيميل"]:::activity
    Act3["📅 عقد اجتماع"]:::activity

    Stage2 -.-> Act1
    Stage2 -.-> Act2
    Stage3 -.-> Act3
```

### 💡 الخلاصة:
- **المخطط الأول (التسلسلي):** يحمي النظام من تخزين بيانات مشوهة (مثل صفقة بدون منتجاتها).
- **المخطط الثاني (دورة الحياة):** يحكم سير العمل والمتابعة مع العملاء بشكل يومي.
