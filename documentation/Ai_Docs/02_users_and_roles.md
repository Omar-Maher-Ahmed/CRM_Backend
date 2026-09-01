# 👥 نظام المستخدمين والأدوار (Users & Roles Module)

## 📌 الفكرة والية العمل
هذا النظام مسؤول عن إدارة الموظفين داخل النظام وتحديد أدوارهم الإدارية. يعتمد على:
1. **هيكل هرمي (Self-Referencing):** كل مستخدم `User` يمكن أن يكون له مدير `Manager` وهو في الأساس مستخدم آخر من نفس الجدول.
2. **الأدوار (Roles):** يمتلك كل مستخدم دوراً يحدد صلاحياته.

## 🗂️ شكل البيانات المدخلة (Inputs)

### 📥 إنشاء مستخدم (CreateUserInput)
```graphql
input CreateUserInput {
  fullName: String!
  email: String!
  phone: String!
  password: String!
  salary: Float!
  roleId: ID
  managerId: ID
}
```

### 📥 إنشاء دور (CreateRoleInput)
```graphql
input CreateRoleInput {
  name: String!
}
```

## 📤 شكل البيانات المخرجة (Outputs)

### 📄 بيانات المستخدم (User Object)
```graphql
type User {
  id: ID!
  fullName: String!
  email: String!
  phone: String!
  salary: Float!
  isActive: Boolean!
  role: Role
  manager: User
  employees: [User!]
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

### 📄 بيانات الدور (Role Object)
```graphql
type Role {
  id: ID!
  name: String!
  users: [User!]
}
```

## ⚙️ كيف تم التنفيذ؟
- تم بناء `UserEntity` و `RoleEntity`.
- تم استخدام العلاقة `@ManyToOne` بين المستخدم والدور الخاص به.
- تم استخدام علاقة التابع والمتبوع `@ManyToOne` و `@OneToMany` في نفس جدول المستخدمين لتنفيذ فكرة "المدير" و"الموظفين".
- تم تشفير كلمة المرور قبل الحفظ في قاعدة البيانات باستخدام مكتبة `bcrypt` في `UserService`.
