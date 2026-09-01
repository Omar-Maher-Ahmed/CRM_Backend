# 📝 سجل الأنشطة والمهام (Activities Module)

## 📌 الفكرة والية العمل
هذا النظام يُستخدم لتسجيل الأنشطة التي تمت (مثلاً: "تم الاتصال بالعميل"، "تم تعديل السعر"، "تم إرسال بريد"). 
يمكن ربط النشاط بـ:
- صفقة معينة (`dealId`)
- مستخدم معين (`userId`)
- منتج معين (`productId`)

## 🗂️ شكل البيانات المدخلة (Inputs)

### 📥 إنشاء نشاط (CreateActivityInput)
```graphql
input CreateActivityInput {
  description: String
  dealId: ID
  userId: ID
  productId: ID
}
```

## 📤 شكل البيانات المخرجة (Outputs)

### 📄 بيانات النشاط (Activity Object)
```graphql
type Activity {
  id: ID!
  description: String
  deal: Deal
  user: User
  product: Product
  createdAt: DateTime!
}
```

## ⚙️ كيف تم التنفيذ؟
- تم إنشاء `ActivityEntity`.
- تم بناء ثلاث علاقات من نوع `@ManyToOne` مع الجداول الأخرى (Deals, Users, Products).
- جميع هذه العلاقات قابلة للترك فارغة (`nullable: true`)، بحيث يمكن تسجيل نشاط مرتبط بصفقة فقط، أو مستخدم فقط، إلخ.
- تم استخدام `onDelete: CASCADE` لضمان حذف الأنشطة الخاصة بصفقة معينة بمجرد حذف هذه الصفقة لتنظيف قاعدة البيانات تلقائياً.
