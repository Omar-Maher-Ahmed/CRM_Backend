# 💰 نظام إدارة المبيعات والصفقات (Sales & Deals)

## 📌 الفكرة والية العمل
هذا الجزء هو القلب النابض لأي نظام CRM. ينقسم إلى:
1. **المنتجات (Products):** الأشياء التي تقوم الشركة ببيعها.
2. **مراحل الصفقة (Deal Stages):** تقسيم مسار المبيعات إلى مراحل واضحة (جديد، مفاوضة، تم الإغلاق).
3. **الصفقات (Deals):** تمثل فرصة بيعية لعميل معين يتولاها موظف معين.
4. **عناصر الصفقة (Deal Products):** جدول وسيط يربط الصفقة بالمنتجات المطلوبة، ويحتسب تفاصيل الأسعار والكميات.

## 🗂️ شكل البيانات المدخلة (Inputs)

### 📥 إنشاء صفقة شاملة المنتجات (CreateDealInput)
```graphql
input CreateDealProductInput {
  productId: ID!
  quantity: Int!
  unitPrice: Float!
  totalPrice: Float!
}

input CreateDealInput {
  title: String!
  value: Float
  customerId: ID
  ownerId: ID
  stageId: ID
  products: [CreateDealProductInput!]
}
```

## 📤 شكل البيانات المخرجة (Outputs)

### 📄 بيانات الصفقة المعروضة (Deal Object)
```graphql
type DealProduct {
  dealId: ID!
  productId: ID!
  product: Product!
  quantity: Int!
  unitPrice: Float!
  totalPrice: Float!
}

type Deal {
  id: ID!
  title: String!
  value: Float
  customer: Customer
  owner: User
  stage: DealStage
  dealProducts: [DealProduct!]
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

## ⚙️ كيف تم التنفيذ؟
- بدلاً من استخدام `@ManyToMany` التلقائية من TypeORM، قمنا بإنشاء **Custom Entity** يدعى `DealProduct`.
- هذا الجدول يحتوي على `dealId` و `productId` كمفاتيح أساسية مركبة (Composite Primary Keys).
- يسمح هذا الجدول بإضافة أعمدة إضافية خاصة بالمنتج داخل هذه الصفقة المحددة (مثل الكمية، سعر الوحدة، والسعر الإجمالي).
- في `DealService`، قمنا باستخدام Transactions ضمنياً أو من خلال حفظ العناصر في خطوتين لضمان تسجيل الصفقة أولاً، ثم تسجيل المنتجات التابعة لها.
