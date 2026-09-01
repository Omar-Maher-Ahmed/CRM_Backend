# 🤝 نظام العملاء (Customer Module)

## 📌 الفكرة والية العمل
نظام بسيط يتيح لموظفي المبيعات إضافة عملاء جدد، تتبع حالتهم، وربطهم بالموظف المسؤول عنهم. العملاء ليس لديهم حسابات دخول (لا يحتاجون Login) بل يتم إدارتهم داخلياً.

## 🗂️ شكل البيانات المدخلة (Inputs)

### 📥 إضافة عميل (CreateCustomerInput)
```graphql
input CreateCustomerInput {
  name: String!
  companyName: String
  email: String
  phone: String
  status: String      # مثل: Lead, Active, Inactive
  managerId: ID       # المعرف الخاص بالموظف المسؤول
}
```

### 📥 تحديث بيانات عميل (UpdateCustomerInput)
نفس الحقول السابقة ولكنها اختيارية، بالإضافة إلى الـ ID الإلزامي.
```graphql
input UpdateCustomerInput {
  id: ID!
  name: String
  # ... باقي الحقول اختيارية
}
```

## 📤 شكل البيانات المخرجة (Outputs)

### 📄 بيانات العميل (Customer Object)
```graphql
type Customer {
  id: ID!
  name: String!
  companyName: String
  email: String
  phone: String
  status: String
  manager: User      # كائن المستخدم (الموظف المسؤول)
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

## ⚙️ كيف تم التنفيذ؟
- تم إنشاء `CustomerEntity` مع حقول لتخزين البيانات الأساسية.
- تم بناء علاقة `@ManyToOne` بين الـ `Customer` والـ `User` لتمثيل `manager_id`.
- تم تفعيل خيار `eager: true` في TypeORM عند جلب العميل لجلب بيانات الموظف المسؤول عنه تلقائياً في نفس الاستعلام لتقليل عدد الـ Queries (يُفضل لاحقاً تعديلها لتعمل بالطلب لتقليل الحمل).
