# 📧 Email System Setup Guide

## Quick Start: Activate Email Verification & Password Reset

The email system is **already coded and configured** in the Kafumbu Smart City platform. To activate it, you just need to add the SMTP password!

---

## Step 1: Get SMTP Credentials

You need the email account password for `info@betterlife-ong.org`.

**Contact:** Your email administrator or check your hosting control panel (cPanel)

The credentials should be:

```
Email: info@betterlife-ong.org
Server: mail.betterlife-ong.org
Port: 465 (SSL)
```

---

## Step 2: Update `.env` File

Edit `server/.env` and replace this line:

```
SMTP_PASS=your-email-account-password
```

With the actual password:

```
SMTP_PASS=YourActualEmailPassword123
```

**File location:** `d:\BetterLIfe\kafumbu-smart-city-platform\server\.env`

---

## Step 3: Test the Email System

### Method 1: Test via API (Recommended)

**Start the server:**

```bash
cd d:\BetterLIfe\kafumbu-smart-city-platform\server
npm start
```

**Test registration email (in another terminal):**

```bash
curl -X POST http://localhost:4000/api/admin/register/request \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@123",
    "tier": "none"
  }'
```

Expected response:

```json
{
  "message": "Verification code sent",
  "expiresInSeconds": 90
}
```

**Test password reset email:**

```bash
curl -X POST http://localhost:4000/api/admin/password/reset-request \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

Expected response:

```json
{
  "message": "Code de reinitialisation envoye",
  "expiresInSeconds": 90
}
```

### Method 2: Check Logs

When testing in development, check the server console for messages like:

```
[SMTP] Mail envoyé avec succès via config #1 (host: mail.betterlife-ong.org:465)
```

Or in dev mode without SMTP configured:

```
==================================================
[DEV MODE] SMTP non configuré.
Code de validation pour Test User (test@example.com) : ABC123
==================================================
```

---

## ✨ What Works Now

### 1. **User Registration with Email Verification**

- User signs up → Gets 6-character code → Enters code → Account activated
- ✅ Emails automatically sent to user's inbox
- ✅ Codes expire after 90 seconds
- ✅ Maximum 5 attempts before rejection

### 2. **Password Reset**

- User requests password reset → Gets code → Enters code + new password → Password updated
- ✅ Emails automatically sent to registered email
- ✅ Same security features as registration

---

## 📱 API Endpoints Reference

### Registration Flow

1. **Request verification:**

   ```
   POST /api/admin/register/request
   {
     "name": "User Name",
     "email": "user@example.com",
     "password": "SecurePassword123",
     "tier": "none",
     "company": "Company Name (optional)",
     "phone": "+243... (optional)"
   }
   ```

2. **Verify and create account:**
   ```
   POST /api/admin/register/verify
   {
     "email": "user@example.com",
     "code": "ABC123"  // From email
   }
   ```

### Password Reset Flow

1. **Request reset:**

   ```
   POST /api/admin/password/reset-request
   {
     "email": "user@example.com"
   }
   ```

2. **Reset password:**
   ```
   POST /api/admin/password/reset-verify
   {
     "email": "user@example.com",
     "code": "ABC123",
     "newPassword": "NewSecurePassword123"
   }
   ```

---

## 🔧 Configuration Options

### Email Server Fallback

If the primary email server is down, it automatically tries:

1. mail.betterlife-ong.org (port 465, SSL)
2. 127.0.0.1 (port 25) - localhost cPanel
3. localhost (port 587, unsecured)
4. mail.betterlife-ong.org (port 587, unsecured)

### Customize Token Settings

Edit `server/src/routes/admin.js` line 11 to change token TTL:

```javascript
const TOKEN_TTL_SECONDS = 90; // Change this value (in seconds)
```

### Customize Email Templates

Edit email functions in `server/src/routes/admin.js`:

- Line 133: `sendVerificationEmail()` - Registration email template
- Line 152: `sendPasswordResetEmail()` - Password reset email template

---

## 🐛 Troubleshooting

### Problem: "Emails not sending"

**Solution:**

1. Verify SMTP_PASS is not the placeholder "your-email-account-password"
2. Confirm email account password is correct
3. Check server console for error messages
4. Ensure network/firewall allows port 465 outgoing

### Problem: "Getting dev mode messages instead of emails"

**Solution:**

1. Make sure SMTP_PASS is set in `.env`
2. Make sure server was restarted after editing `.env`
3. Check that SMTP_USER (`info@betterlife-ong.org`) is correct

### Problem: "Code expired immediately"

**Solution:**

- Normal! Codes only last 90 seconds. Re-request immediately when testing.

### Problem: "Invalid verification code after correct code"

**Solution:**

1. Codes are case-insensitive but stored uppercase
2. Maximum 5 attempts then rejection
3. Don't include spaces or special characters

---

## 📊 Production Deployment

Before going live, update these in `.env`:

```env
# Change from demo to production secret
JWT_SECRET=your-strong-random-secret-key-here

# Update email settings (same as now)
SMTP_PASS=ActualEmailPassword

# Update node environment
NODE_ENV=production

# Add production domain to CORS
CORS_ORIGIN=https://kafumbu.betterlife-ong.org,https://www.betterlife-ong.org
```

---

## 📚 Files Modified/Created

- **Updated:** `EMAIL_CONFIGURATION.md` - Complete documentation
- **Reference:** `server/src/routes/admin.js` - Email implementation
- **Config:** `server/.env` - SMTP credentials

---

## 🎯 Next Steps

1. ✅ Get SMTP password for `info@betterlife-ong.org`
2. ✅ Update `SMTP_PASS` in `server/.env`
3. ✅ Restart server: `npm start`
4. ✅ Test with curl commands above
5. ✅ Verify emails arrive in inbox
6. ✅ Deploy to production

**That's it! Your email system is ready.** 🚀
