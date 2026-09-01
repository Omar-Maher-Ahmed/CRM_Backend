# CRM Mobile App — AI Design Prompt

Copy everything below the dashed line and paste it into your AI model (Claude, ChatGPT, Gemini, etc.)

---

Act as an Expert Mobile UI/UX Designer and React Native Architect with deep experience in B2B SaaS mobile applications. I need you to design and build the complete, production-ready mobile application for my CRM (Customer Relationship Management) system.

Read every section carefully before writing a single line of output. Do NOT skip any section.

---

## SECTION 1 — PROJECT CONTEXT

This is a B2B SaaS CRM system. The backend is already fully built. My job now is to build the mobile app that connects to it. The mobile app is the PRIMARY interface that Sales Reps, Support Agents, and Managers will use on the go — it is NOT a secondary feature, it is the main product.

**Backend Technical Details (already running):**
- Framework: NestJS (Node.js)
- API Type: GraphQL (Apollo Server) for all data operations
- GraphQL Endpoint: `http://YOUR_SERVER_IP:5000/graphql`
- Authentication: REST endpoint — `POST http://YOUR_SERVER_IP:5000/auth/login`
- Database: PostgreSQL
- Token Type: JWT (Bearer Token), expires in 1 hour
- Security: Rate-limited login (7 attempts/minute), bcrypt hashed passwords, input validation with regex

**How the mobile app communicates with the backend:**
1. User logs in via `POST /auth/login` with `{ email, password }` — receives `{ access_token, user: { id, fullName, email } }`
2. Store the JWT token securely on the device using `expo-secure-store` or `react-native-keychain`
3. All subsequent API calls go to `/graphql` with the header: `Authorization: Bearer <token>`
4. If the server returns a 401, log the user out and redirect to Login screen

---

## SECTION 2 — WHO WILL USE THIS APP?

The app serves 4 types of users. Each has different priorities:

**Sales Representative (most common user):**
- Uses the app all day while visiting clients or on calls
- Needs to quickly: add a new lead, update a lead status, call/email a customer directly from the app
- Most used screens: Customer List, Add Customer, Customer Profile
- Needs fast one-thumb navigation

**Customer Support Agent:**
- Looks up customers by name or phone number quickly
- Reads notes from previous interactions
- Adds new interaction notes after a call
- Most used screens: Customer Search, Customer Profile, Add Note

**Sales Manager:**
- Reviews team performance and pipeline health
- Reassigns customers from one employee to another
- Most used screens: Dashboard KPIs, Employee List, Customer List (filtered by team member)

**HR / Administrator:**
- Manages employee accounts (add, deactivate, reset passwords)
- Most used screens: Employee List, Add Employee, Employee Profile

---

## SECTION 3 — DATA MODELS (CRITICAL — READ CAREFULLY)

### Model 1: User (Employee) — BACKEND IS FULLY BUILT

```
id: string (UUID)
fullName: string
email: string (unique)
phone: string (unique)
salary: number (float) — ONLY show this to Managers and HR
isActive: boolean
managerId: string | null (UUID of their manager — another User)
createdAt: ISO DateTime string
updatedAt: ISO DateTime string
```

**Available GraphQL Operations:**
```graphql
# Fetch all employees
query getAllUsers {
  getAllUsers {
    id fullName email phone salary isActive managerId createdAt
  }
}

# Fetch one employee
query getUser($id: ID!) {
  getUser(id: $id) {
    id fullName email phone salary isActive managerId createdAt
  }
}

# Create a new employee
mutation createUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id fullName email
  }
}
# CreateUserInput fields: fullName, email, phone, password, salary, managerId (optional)

# Update an employee's info
mutation updateUser($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id fullName email
  }
}
# UpdateUserInput fields (all optional): fullName, email, phone, salary, managerId

# Change password
mutation updatePassword($id: ID!, $input: UpdatePasswordInput!) {
  updatePassword(id: $id, input: $input)
}
# UpdatePasswordInput: currentPassword, newPassword, confirmPassword

# Delete an employee
mutation deleteUser($id: ID!) {
  deleteUser(id: $id)
}
```

---

### Model 2: Customer — BACKEND NOT YET BUILT (design UI based on this expected structure)

```
id: string (UUID)
name: string
email: string
phone: string
company: string | null
status: "LEAD" | "ACTIVE" | "INACTIVE" | "REJECTED" | "CLOSED"
assignedTo: string (UUID — the User/employee responsible for this customer)
notes: string | null (free-text field, will hold interaction notes for now)
createdAt: ISO DateTime string
updatedAt: ISO DateTime string
```

**Expected GraphQL Operations (design UI assuming these exist):**
```graphql
query getAllCustomers { ... }
query getCustomer(id: ID!) { ... }
mutation createCustomer(input: CreateCustomerInput!) { ... }
mutation updateCustomer(id: ID!, input: UpdateCustomerInput!) { ... }
mutation deleteCustomer(id: ID!) { ... }
```

---

### REST Auth Endpoint (FULLY BUILT):
```
POST /auth/login
Content-Type: application/json
Body: { "email": "string", "password": "string" }

Success (200): { "access_token": "JWT_HERE", "user": { "id": "...", "fullName": "...", "email": "..." } }
Failure (401): { "message": "Invalid credentials", "statusCode": 401 }
```

---

## SECTION 4 — REQUIRED SCREENS (DETAILED)

### Screen 1: Splash Screen
- Show app logo centered on a deep blue background (#1E40AF)
- After 2 seconds, navigate to Login (or Dashboard if token exists in secure storage)

### Screen 2: Login Screen
- Full-screen layout, no split panel (this is mobile)
- Top: App logo + tagline "Manage your team. Close more deals."
- Fields: Email input, Password input (with eye toggle)
- "Login" button — full width, primary blue, shows loading spinner when tapped
- Show a red error message below the button on wrong credentials
- "Forgot Password?" link — shows an alert: "Please contact your administrator to reset your password."
- No "Register" option — accounts are created by admins only
- On success: save token with expo-secure-store, navigate to Dashboard (Tab Navigator)

### Screen 3: Dashboard (Home Tab)
- Top header: "Good Morning, [FirstName] 👋" with a small notification bell icon
- 4 KPI cards in a 2x2 grid:
  - Total Employees (blue card)
  - Active Customers (green card)
  - New Leads This Month (amber card)
  - My Assigned Customers (purple card)
- Below KPIs: a horizontal scrollable row of "Quick Action" chips: "+ Add Customer", "+ Add Employee", "📋 My Leads"
- Below that: "Recent Activity" list — last 5 updates/creates with timestamp and icon
- Pull-to-refresh to reload the dashboard data

### Screen 4: Customers Screen (Customers Tab)
- A search bar at the top (searches by name, company, or phone)
- Filter chips below the search bar: All | Lead | Active | Inactive | Rejected | Closed (scrollable horizontal chips, tap to filter)
- A FlatList of customer cards. Each card shows:
  - Customer name (bold) + company (smaller text below)
  - Status badge (color-coded pill: LEAD=amber, ACTIVE=green, INACTIVE=gray, REJECTED=red, CLOSED=navy)
  - Assigned employee name + their small avatar/initials circle
  - Right arrow icon to navigate to Customer Profile
- Floating Action Button (+) at bottom right to open Add Customer modal
- Swipe left on a card to reveal "Edit" and "Delete" quick actions
- Empty state: centered illustration + "No customers yet. Tap + to add your first one."

### Screen 5: Add / Edit Customer (Modal Bottom Sheet)
- Opens as a sliding bottom sheet (not a new screen) — modal presentation style
- Fields:
  - Full Name (required)
  - Phone (required, numeric keyboard)
  - Email (required, email keyboard)
  - Company (optional)
  - Status (required) — a segmented control or horizontal scrollable chips: LEAD, ACTIVE, INACTIVE, REJECTED, CLOSED
  - Assign To (required) — a searchable dropdown/picker showing employees list
  - Notes (optional) — multi-line text area
- "Save Customer" button — primary blue, full width
- "Cancel" button above it (text button)
- Validate all required fields before submitting, show red helper text under each invalid field

### Screen 6: Customer Profile Screen
- This is a full screen (not a modal)
- Top: Back button + Customer name as title + Edit icon (top right)
- Header card below the nav bar:
  - Large initials avatar circle (colored based on status)
  - Customer name (H1), company name below it
  - Status badge (prominently shown)
  - 3 action icon buttons in a row: Call (phone icon), Email (envelope icon), Edit (pencil icon)
- Tapping Call: opens the device's phone dialer with the customer's number pre-filled
- Tapping Email: opens the device's email app with the customer's email pre-filled
- Info section with rows: Email, Phone, Company, Assigned To (employee name), Created Date
- Notes section: shows the notes text in a light gray card. An "Edit Notes" button opens a text editor overlay.
- Delete button at the very bottom (red, full width) with confirmation alert

### Screen 7: Employees Screen (Employees Tab)
- Search bar at top (filter by name or email)
- Filter: All | Active | Inactive chips
- A FlatList of employee cards. Each card:
  - Initials avatar circle (color based on isActive status — blue if active, gray if not)
  - Full name (bold) + Email below
  - "Active" or "Inactive" badge
  - Right arrow to open Employee Profile
- Swipe left for "Edit" and "Delete" quick actions
- Floating Action Button (+) to add new employee
- Empty state with illustration

### Screen 8: Add / Edit Employee (Modal Bottom Sheet)
- Fields:
  - Full Name (required)
  - Email (required)
  - Phone (required)
  - Password (required only when Adding, hidden when Editing)
  - Salary (required, numeric keyboard) — show only to authorized roles
  - Manager (optional) — searchable picker from employees list
  - Active toggle switch (only show when Editing)
- "Save" button, full width, primary blue
- All fields validated before submit

### Screen 9: Employee Profile Screen
- Back button + name as title + Edit icon
- Header: initials avatar, full name, Active/Inactive badge
- Info rows: Email, Phone, Salary (if allowed by role), Manager name, Member since date
- "Reset Password" button — opens a bottom sheet with: Current Password, New Password, Confirm New Password fields
- "Deactivate Account" toggle (only for HR/Manager) — with confirmation alert
- "Delete Employee" button at bottom (red, confirmation required)

### Screen 10: Profile / Settings Screen (Profile Tab)
- Section 1 — My Info: show avatar (initials), name, email, phone, role
- "Edit Profile" button — opens a bottom sheet to edit fullName, phone
- Section 2 — Security: "Change Password" row with right arrow — opens Change Password screen
- Section 3 — App: "Dark Mode" toggle, "Notifications" toggle (placeholder for now)
- Section 4 — "Logout" button (red text, centered) — clears secure storage and goes to Login

---

## SECTION 5 — NAVIGATION STRUCTURE

Use React Navigation with this structure:

```
Root Navigator (Stack)
│
├── Splash Screen (no header)
├── Login Screen (no header)
│
└── Main App (Bottom Tab Navigator) — only accessible when token exists
    ├── Tab 1: Dashboard (Home icon)
    ├── Tab 2: Customers (Briefcase icon)
    ├── Tab 3: Employees (Users icon)
    └── Tab 4: Profile (Person icon)
        │
        (These screens are pushed on top of tabs as Stack screens)
        ├── Customer Profile Screen
        ├── Employee Profile Screen
        └── Change Password Screen
```

---

## SECTION 6 — MOBILE DESIGN SYSTEM

**Color Palette:**
- Primary Blue: #1E40AF (buttons, active tabs, links)
- Primary Light: #3B82F6 (hover/pressed states, highlights)
- Primary Dark: #1E3A8A (headers, dark backgrounds)
- Background: #F8FAFC (main screen background)
- Surface: #FFFFFF (cards, modals, input backgrounds)
- Border: #E2E8F0 (dividers, input borders)
- Text Primary: #0F172A (headings, important text)
- Text Secondary: #64748B (subtitles, placeholder text, labels)
- Success Green: #10B981 (ACTIVE status, success messages)
- Warning Amber: #F59E0B (LEAD status, warnings)
- Danger Red: #EF4444 (REJECTED, delete buttons, error messages)
- Inactive Gray: #94A3B8 (INACTIVE, CLOSED statuses, disabled states)
- Accent Purple: #7C3AED (KPI card accent, highlights)

**Status Badge Color Mapping:**
- LEAD → background: #FEF3C7, text: #92400E (warm amber)
- ACTIVE → background: #D1FAE5, text: #065F46 (fresh green)
- INACTIVE → background: #F1F5F9, text: #475569 (neutral gray)
- REJECTED → background: #FEE2E2, text: #991B1B (soft red)
- CLOSED → background: #EDE9FE, text: #4C1D95 (muted purple)

**Typography:**
- Font Family: System default ('San Francisco' on iOS, 'Roboto' on Android) — or optionally load 'Inter' via expo-google-fonts
- Screen Title (H1): 24px, fontWeight: '700'
- Section Title (H2): 18px, fontWeight: '600'
- Card Title: 16px, fontWeight: '600'
- Body Text: 14px, fontWeight: '400'
- Caption/Label: 12px, fontWeight: '500'
- Line Height: 1.5x font size

**Spacing Scale (use consistently):**
- xs: 4px, sm: 8px, md: 12px, base: 16px, lg: 20px, xl: 24px, 2xl: 32px, 3xl: 48px

**Component Style Rules:**
- Cards: white background, 8px border radius, shadow: { color: '#000', opacity: 0.06, radius: 8, offset: {width:0, height:2} }
- Inputs: white bg, 1px solid #E2E8F0 border, 8px radius, 14px padding, 48px min height
- Primary Button: #1E40AF bg, white text, 10px radius, 16px height, 52px min height, full width in forms
- Secondary Button: white bg, #1E40AF border (1.5px), #1E40AF text
- Destructive Button: #EF4444 bg, white text
- Bottom Sheet: white bg, 16px top border radius, handle bar at top, always keyboard-aware
- FAB (Floating Action Button): 56px diameter, #1E40AF background, white + icon, shadow: elevation 6
- Tab Bar: white background, active tab icon + label in #1E40AF, inactive in #94A3B8
- All interactive elements must have an activeOpacity of 0.7 (TouchableOpacity) or Pressable ripple effect

---

## SECTION 7 — TECHNICAL STACK (MANDATORY — USE EXACTLY THESE)

- **Runtime**: Expo SDK (latest stable) with Expo Router OR React Navigation v6
- **Language**: TypeScript (strict mode)
- **Styling**: StyleSheet.create (native styles) — do NOT use NativeWind or Tailwind
- **GraphQL**: Apollo Client (`@apollo/client`) with `graphql` package
- **Auth Storage**: `expo-secure-store` for JWT token persistence
- **State Management**: Zustand (`zustand`) for global auth state and user info
- **Form Handling**: React Hook Form (`react-hook-form`) with Zod (`zod`) for validation
- **HTTP (auth only)**: Axios (`axios`) for the REST login call
- **Icons**: `@expo/vector-icons` (Ionicons or MaterialCommunityIcons)
- **Navigation**: `@react-navigation/native` + `@react-navigation/bottom-tabs` + `@react-navigation/native-stack`
- **Lists**: FlatList (built-in) — no external list libraries
- **Bottom Sheets**: `@gorhom/bottom-sheet`
- **Gesture Handler**: `react-native-gesture-handler` (required by bottom-sheet)
- **Reanimated**: `react-native-reanimated` (required by bottom-sheet and animations)
- **Toasts**: `react-native-toast-message`
- **Phone Dialer**: `expo-linking` (`Linking.openURL('tel:...')`)
- **Email**: `expo-linking` (`Linking.openURL('mailto:...')`)
- **Pull to Refresh**: Built-in `RefreshControl` on ScrollView/FlatList

---

## SECTION 8 — APOLLO CLIENT SETUP

Configure Apollo Client to automatically attach the JWT token to every GraphQL request:

```typescript
// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as SecureStore from 'expo-secure-store';

const httpLink = createHttpLink({
  uri: 'http://YOUR_SERVER_IP:5000/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  const token = await SecureStore.getItemAsync('access_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

Wrap the entire app in `<ApolloProvider client={apolloClient}>` in the root layout.

---

## SECTION 9 — ZUSTAND AUTH STORE

```typescript
// store/authStore.ts
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  user: { id: string; fullName: string; email: string } | null;
  login: (token: string, user: AuthState['user']) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  login: async (token, user) => {
    await SecureStore.setItemAsync('access_token', token);
    await SecureStore.setItemAsync('user', JSON.stringify(user));
    set({ token, user });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('user');
    set({ token: null, user: null });
  },
  loadFromStorage: async () => {
    const token = await SecureStore.getItemAsync('access_token');
    const userStr = await SecureStore.getItemAsync('user');
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr) });
    }
  },
}));
```

---

## SECTION 10 — YOUR OUTPUT TASK (STEP BY STEP)

Produce the following in this exact order. Do NOT skip steps. Label each step clearly.

**Step 1**: Acknowledge the full scope. List every screen and key component you will build.

**Step 2**: Provide the complete file/folder structure for the project.

**Step 3**: Provide `package.json` dependencies and the full `npm install` command.

**Step 4**: Provide `lib/apolloClient.ts` and `store/authStore.ts` files.

**Step 5**: Provide the Root Navigator setup and protected route logic (redirect to Login if no token).

**Step 6**: Provide the Splash Screen and Login Screen (complete code).

**Step 7**: Provide the Bottom Tab Navigator with all 4 tabs.

**Step 8**: Provide the Dashboard (Home) screen with KPI cards and recent activity.

**Step 9**: Provide the Customers screen — list, search, filter chips, swipe actions, and FAB.

**Step 10**: Provide the Add/Edit Customer bottom sheet with full form validation.

**Step 11**: Provide the Customer Profile screen with call/email actions and notes section.

**Step 12**: Provide the Employees screen — list, search, filter.

**Step 13**: Provide the Add/Edit Employee bottom sheet.

**Step 14**: Provide the Employee Profile screen with reset password bottom sheet.

**Step 15**: Provide the Profile/Settings screen with logout.

**Step 16**: Provide a reusable component library file containing: StatusBadge, KPICard, EmployeeCard, CustomerCard, SectionHeader, EmptyState, LoadingSpinner, ConfirmationAlert.

After all steps, provide a README section titled "Running the App" with exact commands to install and start the project.
