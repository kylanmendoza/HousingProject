# 🎭 Testing Different User Roles

## Overview

The application now has proper role-based access control:

- **Employees** - Can browse properties and save favorites (regular end users)
- **Admins** - Can do everything employees can, PLUS manage properties (housing administrator)

---

## 🔄 Current Testing Setup

By default, you're logged in as a **regular employee** to test the end-user experience.

### What Employees Can See:
- ✅ Properties page (Zillow-style layout)
- ✅ Saved Homes (Favorites)
- ✅ Profile page
- ❌ Cannot see "Add Property"
- ❌ Cannot see "Admin Dashboard"

---

## 🔧 Switch to Admin Mode for Testing

To test admin features, you need to switch the mock user:

### Step 1: Edit AuthContext.tsx

Open: `/frontend/src/context/AuthContext.tsx`

### Step 2: Find this line (around line 59):

```typescript
const testUser = MOCK_EMPLOYEE_USER; // Change to MOCK_ADMIN_USER to test admin features
```

### Step 3: Change it to:

```typescript
const testUser = MOCK_ADMIN_USER; // Change to MOCK_EMPLOYEE_USER for regular user testing
```

### Step 4: Save and refresh browser

The header will now show:
- ✅ Properties
- ✅ Saved Homes
- ✅ **Add Property** (admin only)
- ✅ **Admin Dashboard** (admin only)

---

## 📋 Testing Checklist

### As Employee (Default):
- [ ] Can browse all properties
- [ ] Can view property details
- [ ] Can save properties to favorites
- [ ] Can view saved homes page
- [ ] Can view profile
- [ ] CANNOT see "Add Property" in header
- [ ] CANNOT see "Admin Dashboard" in header
- [ ] CANNOT access /submit-property directly
- [ ] CANNOT access /admin directly

### As Admin:
- [ ] Can do everything employees can
- [ ] Can see "Add Property" in header
- [ ] Can see "Admin Dashboard" in header
- [ ] Can access /submit-property
- [ ] Can submit new properties
- [ ] Can access /admin
- [ ] Can approve pending properties
- [ ] Can reject properties
- [ ] Can see all property statuses

---

## 🎯 Real-World Setup (When Going Live)

In production, you'll have:

### 1. One Admin Account
- Created manually by you
- Email: your-admin@bozemanhealth.org
- Role: `admin` or `superadmin`
- This person manages all properties

### 2. Multiple Employee Accounts
- Registered by employees themselves
- Role: `employee` (default)
- Can only browse and save favorites

### How to Create Admin Account:

**Option A: Register normally, then update in database:**
```javascript
// After registering, update in MongoDB:
db.users.updateOne(
  { email: "admin@bozemanhealth.org" },
  { $set: { role: "admin", verified: true } }
)
```

**Option B: Create directly in MongoDB:**
```javascript
// You'll need to hash the password first
// Register normally once to see the hash format
db.users.insertOne({
  name: "Housing Administrator",
  email: "admin@bozemanhealth.org",
  password: "$2a$10$...", // hashed password
  employeeId: "ADMIN001",
  role: "admin",
  verified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## 🔐 Security Note

- Employees can ONLY register themselves through the registration form
- The admin account should be created separately
- Never allow employee self-registration to grant admin privileges
- The admin role should only be assigned manually in the database

---

## 💡 Quick Switch Guide

### For Employee Testing:
```typescript
// In AuthContext.tsx line 59:
const testUser = MOCK_EMPLOYEE_USER;
```

### For Admin Testing:
```typescript
// In AuthContext.tsx line 59:
const testUser = MOCK_ADMIN_USER;
```

**Remember to save and refresh the browser after changing!**

---

## 📸 What You Should See

### Employee View Header:
```
[Logo] Bozeman Health Housing | Properties | Saved Homes | [Test Employee ▼] Logout
```

### Admin View Header:
```
[Logo] Bozeman Health Housing | Properties | Saved Homes | Add Property | Admin Dashboard | [Admin User ▼] Logout
```

---

## 🎨 New Zillow-Style Layout

The Properties page now features:
- **Split screen** - Map on left (50%), Property cards on right (50%)
- **Price markers** on map showing rent prices
- **Horizontal property cards** with image on left, details on right
- **Filter panel** with dropdown options
- **Search bar** at the top
- **Results count** showing number of homes
- **Zillow-style aesthetics** - clean, professional, easy to browse

---

## 🧪 Testing Workflow

1. **Start as Employee** (default)
   - Browse properties
   - Save some favorites
   - Verify you DON'T see admin options

2. **Switch to Admin**
   - Change AuthContext.tsx
   - Refresh browser
   - Verify you SEE admin options
   - Test adding a property
   - Test admin approval flow

3. **Switch back to Employee**
   - Change AuthContext.tsx back
   - Refresh browser
   - Verify admin options are hidden again

---

Happy Testing! 🚀
