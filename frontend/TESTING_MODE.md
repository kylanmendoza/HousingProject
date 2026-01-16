# 🧪 Testing Mode - Authentication Disabled

## ✅ TESTING MODE IS NOW ACTIVE!

You can now access the full application without needing to register or login.

---

## 🎭 Current Setup

### Mock User Details
You're automatically logged in as:
- **Name:** Test Admin
- **Email:** test@bozemanhealth.org
- **Role:** Admin (full access to all features)
- **Employee ID:** TEST001
- **Department:** Testing Department
- **Verified:** Yes

### What This Gives You Access To:
- ✅ Browse all properties
- ✅ View property details
- ✅ Add/remove favorites
- ✅ Submit new properties
- ✅ Access admin dashboard
- ✅ Approve/reject properties
- ✅ View profile
- ✅ All navigation menu items

---

## 🚀 Start Testing Now!

1. **Open your browser:** http://localhost:5173/

2. **You should automatically see:**
   - Header with "Test Admin" name in top right
   - Full navigation menu (Properties, Favorites, Submit Property, Admin)
   - Property listing page (may be empty if no properties in database)

3. **Check the browser console (F12):**
   - You should see: `🧪 TESTING MODE ENABLED - Auto-logged in as Admin`

---

## 📊 Add Sample Properties to Test

Since you might have an empty database, here's how to quickly add sample properties:

### Option 1: Use MongoDB Compass/Shell

Open your MongoDB connection and run:

\`\`\`javascript
// Make sure you're using the correct database
use housingproject

// Insert 3 sample properties
db.properties.insertMany([
  {
    title: "Modern 2BR Near Hospital",
    description: "Beautiful apartment just 5 minutes walk from Bozeman Deaconess Hospital.",
    address: "123 Main Street, Bozeman, MT 59715",
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 1.5,
    squareFootage: 950,
    rent: 1500,
    images: [],
    amenities: ["Washer/Dryer in Unit", "Dishwasher", "Parking Included"],
    available: true,
    dateAvailable: new Date(),
    status: "approved",
    landlord: {
      name: "Sarah Johnson",
      phone: "(406) 555-1234",
      email: "sarah@rentals.com"
    },
    lat: 45.6793,
    lng: -111.0373,
    petPolicy: "Cats allowed with deposit",
    parkingSpaces: 1,
    leaseTerms: "12-month lease preferred",
    viewCount: 0,
    favoriteCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Cozy Studio Downtown",
    description: "Perfect for single professionals. Walking distance to everything!",
    address: "456 Oak Avenue, Bozeman, MT 59715",
    propertyType: "apartment",
    bedrooms: 0,
    bathrooms: 1,
    squareFootage: 500,
    rent: 950,
    images: [],
    amenities: ["All Utilities Included", "High-speed Internet"],
    available: true,
    dateAvailable: new Date(),
    status: "approved",
    landlord: {
      name: "Mike Anderson",
      phone: "(406) 555-5678",
      email: "mike@properties.com"
    },
    lat: 45.6800,
    lng: -111.0400,
    petPolicy: "No pets",
    parkingSpaces: 0,
    leaseTerms: "Month-to-month available",
    viewCount: 0,
    favoriteCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Spacious 3BR House with Yard",
    description: "Family-friendly house with large backyard, perfect for kids and pets.",
    address: "789 Pine Street, Bozeman, MT 59715",
    propertyType: "house",
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1800,
    rent: 2200,
    images: [],
    amenities: ["Washer/Dryer", "Dishwasher", "Garage", "Fenced Yard"],
    available: true,
    dateAvailable: new Date(),
    status: "approved",
    landlord: {
      name: "Lisa Brown",
      phone: "(406) 555-9999",
      email: "lisa@homerentals.com"
    },
    lat: 45.6750,
    lng: -111.0450,
    petPolicy: "Pets welcome with deposit",
    parkingSpaces: 2,
    leaseTerms: "12-month lease required",
    viewCount: 0,
    favoriteCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
\`\`\`

### Option 2: Submit Properties Through the App

1. Go to http://localhost:5173/
2. Click "Submit Property" in the header
3. Fill out the form with any test data
4. Submit
5. Go to "Admin" to approve it
6. Now it will show in the property list!

---

## 🧭 Testing Workflow

### 1. Property Browsing
- Visit http://localhost:5173/
- Toggle between Grid and Map views
- Try searching (if properties exist)
- Test filters (type, price, sort)

### 2. Property Details
- Click any property card
- View all information
- Check Google Maps location
- Try favoriting (heart icon)

### 3. Favorites
- Favorite 2-3 properties
- Click "Favorites" in header
- See your saved properties
- Remove a favorite

### 4. Submit Property
- Click "Submit Property"
- Fill out the complete form
- Submit successfully
- Check it appears in Admin panel

### 5. Admin Panel
- Click "Admin" in header
- View pending properties
- Click "Approve" on a property
- See it move to "Approved" tab
- Property now visible to all users

### 6. Profile
- Click "Test Admin" (your name)
- View profile information
- See admin permissions listed

---

## 🔧 How Testing Mode Works

When `VITE_TESTING_MODE=true` in `.env`:

1. **AuthContext automatically logs you in** with mock admin user
2. **No registration/login required**
3. **API auth errors are bypassed** (returns empty data instead of blocking)
4. **All routes are accessible**
5. **Full admin privileges granted**

---

## 🔒 How to Restore Normal Security

When you're done testing and want to restore authentication:

### Step 1: Update `.env`
\`\`\`env
# Change this line:
VITE_TESTING_MODE=true

# To this:
VITE_TESTING_MODE=false

# Or simply remove the line entirely
\`\`\`

### Step 2: Restart the Frontend Server
\`\`\`bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
\`\`\`

### Step 3: Clear Browser Storage (Optional)
- Open DevTools (F12)
- Go to Application tab → Local Storage
- Clear all data for localhost:5173

### Step 4: Test Authentication
- Visit http://localhost:5173/
- You should be redirected to `/login`
- Register a new account
- Login works normally again

---

## ⚠️ Important Notes

### Testing Mode is NOT for Production!
- **NEVER** deploy with `VITE_TESTING_MODE=true`
- This completely bypasses security
- Only use for local development/testing

### Backend Still Requires Auth
- Backend API still requires authentication
- In testing mode, we just ignore auth errors
- Properties from the backend still need proper tokens
- For full testing, you may want to:
  - Manually add properties to MongoDB (recommended)
  - Create a real user and get a token
  - Or temporarily disable backend auth (not recommended)

### What Works in Testing Mode:
- ✅ All UI components and navigation
- ✅ Google Maps integration
- ✅ Form validation
- ✅ Client-side routing
- ✅ Profile display
- ✅ Admin interface

### What May Not Work:
- ❌ Backend API calls (will return empty data unless you have properties in DB)
- ❌ Actual property creation (backend requires auth)
- ❌ Favorites sync with backend
- ❌ Admin approval actions on backend

### Best Testing Approach:
1. **Use testing mode for UI/UX testing**
2. **Manually add sample properties to MongoDB**
3. **Test all frontend features**
4. **For full end-to-end testing, create a real user account**

---

## 🎯 What to Test

### UI/UX Testing
- [ ] Is the navigation intuitive?
- [ ] Do buttons and links work?
- [ ] Is the layout responsive?
- [ ] Do modals/popups look good?
- [ ] Are colors and fonts consistent?
- [ ] Is text readable?

### Functionality Testing
- [ ] Property grid view
- [ ] Property map view
- [ ] Search functionality
- [ ] Filtering options
- [ ] Property detail pages
- [ ] Favorites toggle
- [ ] Property submission form
- [ ] Admin dashboard
- [ ] Profile page

### Visual Testing
- [ ] Resize browser window (responsive)
- [ ] Check on different browsers
- [ ] Look for visual bugs
- [ ] Check alignment and spacing
- [ ] Test dark/light themes (if implemented)

---

## 📝 Feedback Checklist

As you test, note:
1. **What looks good?**
2. **What's confusing?**
3. **What's missing?**
4. **What would you change?**
5. **Any bugs or errors?**
6. **Performance issues?**
7. **Mobile-friendliness?**

---

## 🚀 You're All Set!

Open http://localhost:5173/ and start exploring!

You should see:
- ✅ No login page (bypassed)
- ✅ "Test Admin" in the header
- ✅ All menu items visible
- ✅ Full access to everything

Happy testing! Let me know what you think! 🎉
