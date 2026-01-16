# 🚀 Quick Start - Testing the Application

## Current Status: ✅ READY TO TEST!

Both servers are running:
- **Frontend:** http://localhost:5173/
- **Backend:** http://localhost:5001/ (API)

---

## 🎯 Quick Testing Steps

### Option 1: Fresh Start (Recommended)

1. **Open the app:** http://localhost:5173/

2. **Register your first user:**
   - Click "Register here"
   - Fill in the form (use any @bozemanhealth.org email)
   - Click "Create Account"

3. **Login with your new account**

4. **You'll see an empty property list** (expected - no properties yet!)

5. **To test property submission, you need to upgrade your role:**

   Open MongoDB (Compass or shell) and run:
   ```javascript
   // Change your-email to the email you registered with
   db.users.updateOne(
     { email: "your-email@bozemanhealth.org" },
     { $set: { role: "provider" } }
   )
   ```

6. **Refresh the browser** - you should now see "Submit Property" in the header

7. **Submit a property:**
   - Click "Submit Property"
   - Fill out the form
   - Submit

8. **To approve properties, make yourself admin:**
   ```javascript
   db.users.updateOne(
     { email: "your-email@bozemanhealth.org" },
     { $set: { role: "admin" } }
   )
   ```

9. **Refresh and click "Admin"** - approve your property

10. **Browse properties** - your approved property should now show!

---

### Option 2: Test with Sample Data

If you want to skip manual setup, here's a script to add test data:

#### 1. Add Sample Properties

Open MongoDB and paste this:

```javascript
use housingproject // or your database name

db.properties.insertMany([
  {
    title: "Modern 2BR Near Hospital",
    description: "Beautiful apartment just 5 minutes walk from Bozeman Deaconess Hospital. Featuring modern amenities, hardwood floors, and mountain views.",
    address: "123 Main Street, Bozeman, MT 59715",
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 1.5,
    squareFootage: 950,
    rent: 1500,
    images: [],
    amenities: ["Washer/Dryer in Unit", "Dishwasher", "Central Air", "Parking Included", "Pet Friendly"],
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
    petPolicy: "Cats and small dogs allowed with $300 deposit",
    parkingSpaces: 1,
    leaseTerms: "12-month lease preferred, 6-month available",
    viewCount: 0,
    favoriteCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Cozy Studio Downtown",
    description: "Perfect for single professionals. Walking distance to restaurants, shops, and nightlife. Utilities included!",
    address: "456 Oak Avenue, Bozeman, MT 59715",
    propertyType: "apartment",
    bedrooms: 0,
    bathrooms: 1,
    squareFootage: 500,
    rent: 950,
    images: [],
    amenities: ["High-speed Internet", "All Utilities Included", "Laundry On-site"],
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
    leaseTerms: "Month-to-month or 6-month lease",
    viewCount: 0,
    favoriteCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Spacious 3BR House with Yard",
    description: "Family-friendly house with large backyard, perfect for kids and pets. Quiet neighborhood, great schools nearby.",
    address: "789 Pine Street, Bozeman, MT 59715",
    propertyType: "house",
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1800,
    rent: 2200,
    images: [],
    amenities: ["Washer/Dryer", "Dishwasher", "Garage", "Fenced Yard", "Fireplace"],
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
  },
  {
    title: "Luxury 2BR Condo - Mountain Views",
    description: "Upscale condo with stunning mountain views. High-end finishes, granite countertops, stainless appliances. Gym and pool access.",
    address: "321 Summit Drive, Bozeman, MT 59715",
    propertyType: "condo",
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 1200,
    rent: 1900,
    images: [],
    amenities: ["In-unit Washer/Dryer", "Stainless Appliances", "Granite Counters", "Fitness Center", "Pool", "Covered Parking"],
    available: true,
    dateAvailable: new Date(),
    status: "approved",
    landlord: {
      name: "Tom Wilson",
      phone: "(406) 555-7777",
      email: "tom@luxuryrentals.com"
    },
    lat: 45.6820,
    lng: -111.0320,
    petPolicy: "No pets",
    parkingSpaces: 1,
    leaseTerms: "12-month lease, first and last month required",
    viewCount: 0,
    favoriteCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Affordable 1BR - Great for Students",
    description: "Budget-friendly apartment perfect for students or young professionals. Close to MSU campus and bus routes.",
    address: "555 University Drive, Bozeman, MT 59715",
    propertyType: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    squareFootage: 650,
    rent: 850,
    images: [],
    amenities: ["Heat Included", "On-site Laundry", "Bus Line"],
    available: true,
    dateAvailable: new Date(),
    status: "approved",
    landlord: {
      name: "Campus Housing LLC",
      phone: "(406) 555-3333",
      email: "info@campushousing.com"
    },
    lat: 45.6770,
    lng: -111.0500,
    petPolicy: "No pets",
    parkingSpaces: 1,
    leaseTerms: "9-month or 12-month lease available",
    viewCount: 0,
    favoriteCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
```

#### 2. Refresh the browser and you'll see 5 properties!

---

## 🧪 Test Each Feature

### 1. Browse Properties
- Switch between Grid and Map views
- Search for "downtown" or "hospital"
- Filter by type (apartment, house, condo)
- Sort by price

### 2. View Property Details
- Click any property card
- Check the map location
- View landlord info
- Click the heart to favorite

### 3. Test Favorites
- Favorite 2-3 properties
- Click "Favorites" in header
- See your saved properties
- Click a property to view details
- Unfavorite one

### 4. Submit Property (if provider role)
- Click "Submit Property"
- Fill out the form
- Submit
- Check it appears in Admin pending

### 5. Admin Dashboard (if admin role)
- Click "Admin"
- See pending properties
- Approve or reject
- Check approved tab

### 6. Profile
- Click your name
- View your profile info
- Check verification status

---

## 🎨 Things to Notice

### ✅ Working Features
- Authentication with JWT tokens
- Protected routes (try accessing /admin when logged out)
- Role-based navigation (Submit Property only shows for providers)
- Real-time search and filtering
- Google Maps integration
- Responsive design (try resizing browser)
- Form validation (try submitting empty forms)

### 🚧 Known Limitations
- **No images** - Image upload not yet implemented (high priority)
- **Email not sent** - Email service needs SMTP config
- **No email verification page** - Can register but can't verify
- **No password reset page** - Can't reset forgotten passwords
- **No amenities in form** - Submission form doesn't capture amenities yet

---

## 🔍 Check the Browser Console

Open DevTools (F12 or Right-click → Inspect) and check:
- **Console tab:** Should have no red errors (warnings OK)
- **Network tab:** API calls to http://localhost:5001/api/v1/*
- **Application tab → Local Storage:** You'll see `accessToken` when logged in

---

## 🎯 What to Test & Report Back

1. **Does registration work?**
2. **Does login work?**
3. **Can you see properties on the map?**
4. **Do favorites work?**
5. **Does filtering work?**
6. **Can you submit a property (as provider)?**
7. **Can you approve properties (as admin)?**
8. **Is the UI intuitive?**
9. **Any bugs or issues?**
10. **Any features you want changed?**

---

## 🛑 Stop Servers When Done

When you're done testing:
```bash
# In the terminal, press Ctrl+C to stop servers
# Or I can stop them for you
```

---

## 💡 Next Steps After Testing

Once you confirm everything works, we can:
1. **Add image upload** (AWS S3, Cloudinary, or Google Cloud Storage)
2. **Add email verification pages**
3. **Add password reset flow**
4. **Add amenities to submission form**
5. **Any custom features you want**

---

Ready to test! Let me know what you think! 🚀
