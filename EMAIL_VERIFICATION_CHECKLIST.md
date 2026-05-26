# ✅ Email System Verification Checklist

## Status: READY TO USE 🚀

The automatic email system for token verification and password reset is **fully implemented** and configured in the Kafumbu Smart City platform.

---

## 📋 What's Already Done

### Backend Implementation

- ✅ Nodemailer installed and configured
- ✅ SMTP multi-protocol fallback system implemented
- ✅ Registration verification email system built
- ✅ Password reset email system built
- ✅ Email verification tokens table created (auto-creates on first use)
- ✅ Token hashing with SHA256 implemented
- ✅ 6-character alphanumeric code generation
- ✅ 90-second expiration timer
- ✅ 5-attempt rate limiting
- ✅ Password hashing with bcryptjs (10 rounds)
- ✅ Database transaction safety
- ✅ Error handling and logging

### API Endpoints

- ✅ `POST /api/admin/register/request` - Send registration code
- ✅ `POST /api/admin/register/verify` - Verify code and create account
- ✅ `POST /api/admin/password/reset-request` - Send password reset code
- ✅ `POST /api/admin/password/reset-verify` - Verify code and change password

### Configuration

- ✅ `.env` file has SMTP configuration template
- ✅ Fallback SMTP configurations for reliability
- ✅ Development mode (console logging when SMTP not configured)
- ✅ Production-ready error handling

---

## 🔧 Quick Setup (5 minutes)

### Step 1: Get Email Password

Contact your hosting admin or check cPanel for `info@betterlife-ong.org` password.

### Step 2: Update `.env`

Edit `server/.env` line 24:

```diff
- SMTP_PASS=your-email-account-password
+ SMTP_PASS=ActualPasswordHere
```

### Step 3: Test

```bash
# Terminal 1
cd server
npm start

# Terminal 2 - Test registration email
curl -X POST http://localhost:4000/api/admin/register/request \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Test@123","tier":"none"}'
```

Expected: Status 202 + "Verification code sent"

---

## 📊 System Architecture

```
User Registration Flow:
┌─────────────┐
│  User Form  │
└──────┬──────┘
       │ POST /register/request
       ├─→ Generate 6-char code
       ├─→ Hash code with SHA256
       ├─→ Store in email_verification_tokens
       ├─→ Send email with code
       └─→ Return 202 status

       │ User checks email, gets code
       │
       └─→ POST /register/verify
          ├─→ Hash submitted code
          ├─→ Compare with stored hash
          ├─→ If match: Create user account
          ├─→ Hash password with bcrypt
          ├─→ Delete verification token
          └─→ Return JWT token + user data

Password Reset Flow:
┌─────────────────┐
│ Forgot Password │
└────────┬────────┘
         │ POST /password/reset-request
         ├─→ Find user by email
         ├─→ Generate 6-char code
         ├─→ Hash and store in table
         ├─→ Send password reset email
         └─→ Return 202 status

         │ User checks email, gets code
         │
         └─→ POST /password/reset-verify
            ├─→ Verify code
            ├─→ Hash new password
            ├─→ Update user.password
            ├─→ Delete verification token
            └─→ Return success message
```

---

## 🔐 Security Features Implemented

| Feature            | Implementation                         |
| ------------------ | -------------------------------------- |
| Code Hashing       | SHA256 hash before storage             |
| Code Format        | 6 uppercase alphanumeric (A-Z, 2-9)    |
| Code TTL           | 90 seconds                             |
| Attempt Limiting   | Max 5 attempts then rejection          |
| Password Hashing   | bcryptjs with 10 rounds                |
| HTTPS/TLS          | Supported via SMTP_SECURE              |
| Email Verification | Required before account creation       |
| Transaction Safety | Database transactions for critical ops |
| Error Messages     | User-friendly, no sensitive data leaks |
| Fallback Systems   | 5 different SMTP configurations        |

---

## 📝 API Reference

### Registration Request

```http
POST /api/admin/register/request HTTP/1.1
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "tier": "none",
  "company": "My Company",
  "phone": "+243..."
}
```

Response (202):

```json
{
  "message": "Verification code sent",
  "expiresInSeconds": 90
}
```

### Registration Verify

```http
POST /api/admin/register/verify HTTP/1.1
Content-Type: application/json

{
  "email": "john@example.com",
  "code": "ABC123"
}
```

Response (201):

```json
{
  "token": "eyJhbGc...",
  "username": "john@kafumbu-smartcity.cd",
  "user": {
    "id": 1,
    "email": "john@kafumbu-smartcity.cd",
    "name": "John Doe",
    "role": "visitor",
    "tier": "none"
  }
}
```

### Password Reset Request

```http
POST /api/admin/password/reset-request HTTP/1.1
Content-Type: application/json

{
  "email": "john@example.com"
}
```

Response (202):

```json
{
  "message": "Code de reinitialisation envoye",
  "expiresInSeconds": 90
}
```

### Password Reset Verify

```http
POST /api/admin/password/reset-verify HTTP/1.1
Content-Type: application/json

{
  "email": "john@example.com",
  "code": "ABC123",
  "newPassword": "NewSecurePass456"
}
```

Response (200):

```json
{
  "message": "Mot de passe réinitialisé avec succès."
}
```

---

## 🧪 Manual Testing Scenarios

### Scenario 1: Successful Registration

1. POST `/register/request` with valid data
2. Check email inbox for code
3. POST `/register/verify` with correct code
4. ✅ Should create account and return JWT token

### Scenario 2: Wrong Verification Code

1. POST `/register/request`
2. POST `/register/verify` with WRONG code
3. ✅ Should return 401 with "Invalid verification code"
4. Attempts counter increases

### Scenario 3: Code Expiration

1. POST `/register/request`
2. Wait 91 seconds
3. POST `/register/verify` with correct code
4. ✅ Should return 410 with "Verification code expired"

### Scenario 4: Too Many Attempts

1. POST `/register/request`
2. POST `/register/verify` with wrong code 5 times
3. 6th attempt (even with correct code)
4. ✅ Should return 401 with "Invalid verification code"

### Scenario 5: Password Reset Success

1. POST `/password/reset-request` with valid email
2. Check email for code
3. POST `/password/reset-verify` with code + new password
4. ✅ Should succeed
5. Can now login with new password

### Scenario 6: Email Already Registered

1. POST `/register/request` with email@example.com
2. Get verification code
3. POST `/register/verify` to create account
4. POST `/register/request` again with same email
5. ✅ Should return 409 with "Cet e-mail est deja utilise."

---

## 📂 File Structure

```
kafumbu-smart-city-platform/
├── server/
│   ├── .env                          # SMTP credentials here
│   ├── src/
│   │   ├── routes/
│   │   │   └── admin.js             # Email endpoints (lines 133-1450)
│   │   ├── auth.js                  # JWT middleware
│   │   ├── database.js              # MySQL connection
│   │   └── index.js                 # Express server
│   └── package.json                 # nodemailer dependency
├── EMAIL_CONFIGURATION.md           # Full documentation
├── SETUP_EMAIL_GUIDE.md             # Setup instructions
├── FRONTEND_EMAIL_INTEGRATION.md    # Frontend code examples
└── EMAIL_VERIFICATION_CHECKLIST.md  # This file
```

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] SMTP_PASS updated with actual password
- [ ] SMTP_USER verified as correct email
- [ ] JWT_SECRET changed to strong random value
- [ ] NODE_ENV set to "production"
- [ ] CORS_ORIGIN updated with production domains
- [ ] Database backups configured
- [ ] Email logs monitored
- [ ] Tested password reset flow with real email
- [ ] Tested registration flow with real email
- [ ] Error messages translated (if needed)

### Production Environment Variables

```env
# Update these for production
NODE_ENV=production
JWT_SECRET=your-super-secret-random-key-min-32-chars
SMTP_PASS=YourActualEmailPassword
CORS_ORIGIN=https://kafumbu.betterlife-ong.org,https://www.betterlife-ong.org
```

### Monitoring

Monitor these logs in production:

```
[SMTP] Mail envoyé avec succès via config #X
[SMTP] Config #X échouée (host:port): error message
[DEV MODE] SMTP non configuré  ← This shouldn't appear in production!
```

---

## 🆘 Troubleshooting

| Problem                  | Cause                          | Solution                            |
| ------------------------ | ------------------------------ | ----------------------------------- |
| Emails not sending       | SMTP_PASS is placeholder       | Update `.env` with real password    |
| Getting dev mode logs    | SMTP_USER or SMTP_PASS missing | Both must be set in `.env`          |
| Code invalid immediately | Wrong case or spaces           | Codes auto-uppercase, trim spaces   |
| Too many attempts error  | Exceeded 5 failures            | Generate new code                   |
| Email not found          | User doesn't exist             | Check email address spelling        |
| CORS error               | Frontend domain not allowed    | Add to CORS_ORIGIN in `.env`        |
| Connection timeout       | Server unreachable             | Check SMTP_HOST and PORT            |
| TLS error                | Certificate issue              | Set SMTP_SECURE=false (less secure) |

---

## 📞 Support

### Common Questions

**Q: Will emails send automatically?**
A: Yes, as soon as you set SMTP_PASS and restart the server.

**Q: Can I customize email templates?**
A: Yes, edit functions in `server/src/routes/admin.js` lines 133 & 152.

**Q: How long are codes valid?**
A: 90 seconds. Change line 11 in `admin.js` if needed.

**Q: Can users bypass the email verification?**
A: No. Account creation requires verified email. This is built into the system.

**Q: What if the email server is down?**
A: System tries 5 different SMTP configurations automatically. One should work.

**Q: Can I use a different email provider?**
A: Yes, update SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in `.env`.

---

## 📊 Database Schema

### email_verification_tokens Table

```sql
CREATE TABLE email_verification_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  token_hash VARCHAR(64) NOT NULL,
  payload JSON NOT NULL,
  expires_at DATETIME NOT NULL,
  attempts INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
```

### users Table (relevant fields)

```sql
id INT PRIMARY KEY
name VARCHAR(255)
email VARCHAR(255) UNIQUE
password VARCHAR(255)  # bcrypted
role ENUM('admin', 'visitor', 'moderator')
tier VARCHAR(50)
company VARCHAR(255)
phone VARCHAR(20)
created_at TIMESTAMP
```

---

## ✨ Summary

Everything is ready! Just:

1. Add the email password to `.env`
2. Restart the server
3. Start using the email features

**The system will automatically:**

- Send registration codes to new users
- Send password reset codes when requested
- Validate codes with security features
- Create accounts after verification
- Hash all passwords securely

**Happy emailing!** 🎉
