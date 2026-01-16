# Testing Guide - Bozeman Health Housing Portal

## 🚀 Setup Complete!

Your application is now running:
- **Frontend:** http://localhost:5173/
- **Backend:** http://localhost:5001/
- **Database:** MongoDB connected

---

## 📋 Step-by-Step Testing Workflow

### 1. **Registration & Login** ✅

#### Test User Registration
1. Open http://localhost:5173/
2. You should be redirected to `/login` (not logged in)
3. Click "Register here" link
4. Fill out the registration form:
   ```
   Full Name: John Doe
   Email: john.doe@bozemanhealth.org
   Employee ID: EMP12345
   Department: Nursing (optional)
   Phone: (406) 555-0123 (optional)
   Password: password123
   Confirm Password: password123
   ```
5. Click "Create Account"
6. You should see a success message: "Registration successful! Please check your email..."
7. After 3 seconds, you'll be redirected to `/login`

#### Test Login
1. On the login page, enter:
   ```
   Email: john.doe@bozemanhealth.org
   Password: password123
   ```
2. Click "Sign In"
3. You should be redirected to the home page (Property List)
4. Check the header - you should see:
   - Your name "John Doe"
   - Navigation links: Properties, Favorites
   - Logout button

---

### 2. **Property Browsing** ✅

#### Grid View
1. On the home page, you should see the property listing
2. If no properties exist yet, you'll see "No properties found"
3. Toggle between "Grid" and "Map" views using the buttons

#### Search & Filter
1. Try the search bar (searches by title, address)
2. Click "Filters" button to open filter panel
3. Test filters:
   - Property Type dropdown
   - Min/Max Price
   - Sort By options

#### Map View
1. Click "Map" view button
2. Google Maps should load showing Bozeman area
3. Property markers should appear (if properties exist)
4. Click a marker to see property info window

---

### 3. **Submit a Property** ✅

Since you're registered as an employee by default, let me help you test the submission flow. First, you'll need to create a provider or admin account:

#### Create Provider Account (to submit properties)
1. Logout (top right)
2. Register another account:
   ```
   Full Name: Jane Provider
   Email: jane.provider@bozemanhealth.org
   Employee ID: EMP67890
   Password: password123
   ```
3. Login with the new account

**Note:** By default, new users are "employee" role. To test property submission, you'll need admin access to the database to change the role to "provider" or "admin".

#### Manual Role Update (Temporary for Testing)
Run this in your backend MongoDB:
```javascript
// Connect to your MongoDB and run:
db.users.updateOne(
  { email: "jane.provider@bozemanhealth.org" },
  { $set: { role: "provider" } }
)
```

Or use MongoDB Compass/Atlas to manually update the role field.

#### Test Property Submission
1. After setting role to "provider", refresh the page
2. You should now see "Submit Property" in the header
3. Click "Submit Property"
4. Fill out the property form:
   ```
   Property Title: Cozy 2BR Near Hospital
   Description: Beautiful apartment just 5 minutes from Bozeman Deaconess Hospital
   Property Type: Apartment
   Monthly Rent: 1500
   Address: 123 Main St, Bozeman, MT 59715
   Unit Number: Apt 205
   Bedrooms: 2
   Bathrooms: 1.5
   Square Footage: 950
   Available Date: (select today or future date)
   Pet Policy: Cats allowed, no dogs
   Parking Spaces: 1
   Lease Terms: 12-month lease, first and last month required

   Landlord Information:
   Full Name: Bob Landlord
   Phone Number: (406) 555-9876
   Email Address: bob@landlord.com
   ```
5. Click "Submit Property for Approval"
6. You should see success message
7. Property will be in "pending" status

---

### 4. **Admin Approval** ✅

#### Create Admin Account
1. Logout
2. Register admin account:
   ```
   Full Name: Admin User
   Email: admin@bozemanhealth.org
   Employee ID: ADMIN001
   Password: password123
   ```
3. Update role in database:
   ```javascript
   db.users.updateOne(
     { email: "admin@bozemanhealth.org" },
     { $set: { role: "admin" } }
   )
   ```

#### Test Admin Dashboard
1. Login as admin
2. Click "Admin" in header navigation
3. You should see the Admin Dashboard
4. Three tabs: Pending, Approved, Rejected
5. "Pending" tab should show the property you submitted
6. Click "View Details" to see full property info
7. Click "Approve" button
8. Property should move to "Approved" tab
9. Property will now be visible to all users

#### Test Rejection
1. Submit another property as provider
2. As admin, go to Admin dashboard
3. Click "Reject" on a pending property
4. Property moves to "Rejected" tab

---

### 5. **Property Details** ✅

1. Go back to Property List (click "Properties" in header)
2. Click on any approved property card
3. You should see:
   - Full property information
   - Image gallery (if images exist - currently none)
   - Location on Google Maps
   - Landlord contact information
   - Heart icon to favorite
   - All amenities and details

---

### 6. **Favorites** ✅

#### Add to Favorites
1. On Property Detail page, click the heart icon
2. Heart should turn red (favorited)
3. Click "Favorites" in header
4. You should see your saved property

#### Remove from Favorites
1. On Favorites page, click on a property
2. Click heart icon to unfavorite
3. Return to Favorites page - property should be gone

---

### 7. **Profile Page** ✅

1. Click your name in header (top right)
2. Click "Profile"
3. You should see:
   - Your name and role
   - Account verification status
   - Email, Employee ID, Department
   - Role permissions list

---

### 8. **Test Role-Based Access** ✅

#### As Employee:
- ✅ Can browse properties
- ✅ Can view details
- ✅ Can save favorites
- ✅ Can view profile
- ❌ Cannot submit properties
- ❌ Cannot access admin dashboard

#### As Provider:
- ✅ All employee features
- ✅ Can submit properties
- ❌ Cannot access admin dashboard

#### As Admin:
- ✅ All provider features
- ✅ Can access admin dashboard
- ✅ Can approve/reject properties

---

## 🔧 Quick Database Setup for Testing

If you want to quickly test with sample data, run these commands in MongoDB:

### Create Test Users
```javascript
// In MongoDB shell or Compass
db.users.insertMany([
  {
    name: "Test Employee",
    email: "employee@test.com",
    password: "$2a$10$..." // You'll need to register normally to get hashed password
    employeeId: "EMP001",
    role: "employee",
    verified: true
  },
  // Register normally and then update role in database
])
```

### Create Test Properties
```javascript
db.properties.insertMany([
  {
    title: "Modern 2BR Apartment",
    description: "Beautiful modern apartment close to hospital",
    address: "456 Oak Street, Bozeman, MT 59715",
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    rent: 1400,
    images: [],
    amenities: ["Washer/Dryer", "Dishwasher", "Parking"],
    available: true,
    dateAvailable: new Date(),
    status: "approved",
    landlord: {
      name: "Test Landlord",
      phone: "(406) 555-1234",
      email: "landlord@test.com"
    },
    lat: 45.6793,
    lng: -111.0373,
    viewCount: 0,
    favoriteCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Cozy Studio Downtown",
    description: "Perfect for single professional",
    address: "789 Main Street, Bozeman, MT 59715",
    propertyType: "apartment",
    bedrooms: 0,
    bathrooms: 1,
    rent: 900,
    images: [],
    amenities: ["High-speed Internet", "Heat Included"],
    available: true,
    dateAvailable: new Date(),
    status: "approved",
    landlord: {
      name: "Another Landlord",
      phone: "(406) 555-5678",
      email: "another@test.com"
    },
    lat: 45.6800,
    lng: -111.0400,
    viewCount: 0,
    favoriteCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to backend"
- **Check:** Backend is running on http://localhost:5001
- **Solution:** Restart backend with `npm run dev` in backend folder

### Issue: "Properties not showing"
- **Check:** Properties must have `status: "approved"` to show to non-admin users
- **Solution:** Login as admin and approve pending properties

### Issue: "Can't submit properties"
- **Check:** User role must be "provider", "admin", or "superadmin"
- **Solution:** Update user role in database

### Issue: "Map not loading"
- **Check:** Google Maps API key is set in `.env`
- **Solution:** Verify `VITE_GOOGLE_MAPS_API_KEY` is correct

### Issue: "Images not showing"
- **Expected:** Image upload is not yet implemented
- **Note:** This is documented as HIGH PRIORITY feature to add

### Issue: "Login doesn't work"
- **Check:** Email and password are correct
- **Check:** User exists in database
- **Solution:** Try registering a new account

---

## 📝 Test Scenarios Checklist

Use this to track your testing:

### Authentication
- [ ] Register new user
- [ ] Login with correct credentials
- [ ] Login with wrong credentials (should show error)
- [ ] Logout
- [ ] Access protected route while logged out (should redirect to login)

### Property Browsing
- [ ] View properties in grid mode
- [ ] View properties in map mode
- [ ] Search for properties
- [ ] Filter by property type
- [ ] Filter by price range
- [ ] Sort properties
- [ ] Click property card to view details

### Property Details
- [ ] View all property information
- [ ] View property on map
- [ ] Contact landlord (click email/phone links)
- [ ] Add to favorites
- [ ] Navigate back to list

### Property Submission (as Provider)
- [ ] Access submit property page
- [ ] Fill out form with all required fields
- [ ] Submit property
- [ ] Verify success message
- [ ] Check property appears in admin pending queue

### Admin Functions (as Admin)
- [ ] Access admin dashboard
- [ ] View pending properties
- [ ] Approve property
- [ ] Reject property
- [ ] Switch between status tabs

### Profile & Favorites
- [ ] View profile information
- [ ] View favorites list
- [ ] Empty favorites state
- [ ] Add/remove favorites

### Role-Based Access
- [ ] Test as employee (limited access)
- [ ] Test as provider (can submit)
- [ ] Test as admin (full access)

---

## 🎯 What to Look For

### UI/UX
- Buttons should have hover effects
- Forms should validate input
- Success/error messages should appear
- Loading states should show
- Navigation should be smooth
- Responsive on different screen sizes

### Functionality
- Authentication flow should be seamless
- Protected routes should work correctly
- Data should persist after refresh
- Favorites should sync with backend
- Admin actions should update immediately
- Search and filters should work

### Performance
- Pages should load quickly
- No console errors in browser DevTools
- Maps should load smoothly
- Transitions should be smooth

---

## 🔄 After Testing

Once you've confirmed everything works:

1. Let me know what you'd like to adjust
2. We can implement the image upload feature
3. We can add email verification pages
4. We can enhance any features you want improved

---

## 📞 Need Help?

If you encounter any issues during testing, let me know:
- What you were trying to do
- What happened vs. what you expected
- Any error messages in the browser console (F12)

Happy Testing! 🎉
