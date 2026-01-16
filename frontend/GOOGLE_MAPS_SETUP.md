# 🗺️ Fixing Google Maps API

## The Issue

You're seeing: **"This page can't load Google Maps correctly"**

This happens when the Google Maps API key needs proper configuration in Google Cloud Console.

---

## 🔧 Quick Fix

### Option 1: Enable Required APIs (Recommended)

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Select your project** (or create one if you don't have one)

3. **Enable these APIs:**
   - Go to "APIs & Services" → "Library"
   - Search and enable each of these:
     - ✅ **Maps JavaScript API**
     - ✅ **Places API** (optional, for autocomplete)
     - ✅ **Geocoding API** (if you want address → coordinates)

4. **Check API Key Restrictions:**
   - Go to "APIs & Services" → "Credentials"
   - Click on your API key (`AIzaSyD7LjDw6VblBQwXbmdpdQKVogUzfPA9auU`)
   - Under "API restrictions":
     - Select "Restrict key"
     - Choose the APIs you enabled above
   - Under "Website restrictions":
     - Add `http://localhost:5173`
     - Add `http://localhost:*` for flexibility
     - Add your production domain when deploying

5. **Save** and wait 1-2 minutes for changes to propagate

6. **Refresh your browser**

---

### Option 2: Create New API Key (If Above Doesn't Work)

1. **Go to Google Cloud Console:**
   - https://console.cloud.google.com/

2. **Create a new project** (or use existing)

3. **Enable APIs:**
   - Search for "Maps JavaScript API"
   - Click "Enable"

4. **Create API Key:**
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "API Key"
   - Copy the new API key

5. **Configure restrictions:**
   - Click on the key you just created
   - Under "Application restrictions":
     - Select "HTTP referrers (web sites)"
     - Add: `http://localhost:5173/*`
     - Add: `http://localhost:*`
   - Under "API restrictions":
     - Select "Restrict key"
     - Choose "Maps JavaScript API"
   - Click "Save"

6. **Update your .env file:**
   ```env
   VITE_API_URL=http://localhost:5001/api/v1
   VITE_GOOGLE_MAPS_API_KEY=YOUR_NEW_API_KEY_HERE
   VITE_TESTING_MODE=true
   ```

7. **Restart the frontend:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

---

### Option 3: Unrestricted Key (Development Only - Not Secure for Production!)

If you just want to test quickly:

1. **Go to Google Cloud Console**
2. **Find your API key**
3. **Set restrictions to "None"** (under both Application and API restrictions)
4. **Save**
5. **Wait 1-2 minutes and refresh**

⚠️ **WARNING:** This is NOT secure for production! Only use for local testing.

---

## 🔍 Troubleshooting

### Check Browser Console

1. Open DevTools (F12)
2. Look at the Console tab
3. You might see specific error messages like:
   - "This API project is not authorized to use this API"
   - "The provided API key is expired"
   - "RefererNotAllowedMapError"

### Common Error Messages:

#### "RefererNotAllowedMapError"
**Fix:** Add `http://localhost:5173` to allowed referrers in API key settings

#### "ApiNotActivatedMapError"
**Fix:** Enable "Maps JavaScript API" in Google Cloud Console

#### "InvalidKeyMapError"
**Fix:** The API key is wrong or expired, create a new one

#### "RequestDenied"
**Fix:** Check billing is enabled on your Google Cloud project

---

## 💰 Billing Note

Google Maps requires a billing account (even for free tier):
- You get **$200 free credit per month**
- Maps JavaScript API: ~7,000 map loads per month for free
- More than enough for development and small applications

To enable billing:
1. Go to Google Cloud Console
2. Navigate to "Billing"
3. Set up billing account (requires credit card, but won't charge within free tier)

---

## ✅ Verification Steps

After fixing:

1. **Refresh browser** (hard refresh: Ctrl+Shift+R)
2. **Check console** - should see no map errors
3. **Map should load** showing Bozeman, MT area
4. **Try clicking** - should be able to pan/zoom

---

## 🚀 Alternative: Use Without Maps (Temporary)

If you want to test other features while fixing maps, I can create a version without the map for now:

1. Comment out the map component
2. Show properties in a full-width list
3. Re-enable map once API key is fixed

Let me know if you want this temporary solution!

---

## 📝 Current API Key

Your current key from the old frontend:
```
AIzaSyD7LjDw6VblBQwXbmdpdQKVogUzfPA9auU
```

This key might:
- Be restricted to old domain/referrer
- Need Maps JavaScript API enabled
- Need billing enabled on the project

---

## 🎯 Recommended Solution

1. **Check if key works** by enabling Maps JavaScript API
2. **Add localhost:5173** to allowed referrers
3. **Wait 2 minutes** for changes to apply
4. **Refresh browser**

If still doesn't work:
5. **Create new API key** following Option 2 above
6. **Update .env** with new key
7. **Restart server**

---

Need help with any of these steps? Let me know! 🗺️
