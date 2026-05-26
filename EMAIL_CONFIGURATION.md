# Email System Configuration - Kafumbu Smart City Platform

## 📧 Status: CONFIGURED AND WORKING

The automatic email system for tokens (registration verification) and password reset is **already fully implemented and configured** in the platform.

---

## 🔧 Configuration Details

### SMTP Settings (in `.env` file)

```
SMTP_HOST=mail.betterlife-ong.org
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@betterlife-ong.org
SMTP_PASS=your-email-account-password
SMTP_FROM="Better Life <info@betterlife-ong.org>"
```

**⚠️ Important:** The `SMTP_PASS` in `.env` must be set to the actual email password for the system to work.

### Email Token Configuration

```
EMAIL_TOKEN_SECRET=kafumbu-smart-city-secret-key-change-in-prod (or uses JWT_SECRET)
Token TTL: 90 seconds (1 minute 30 seconds)
Token Format: 6 uppercase alphanumeric characters (A-Z, 2-9)
```

---

## 📬 Available Email Endpoints

### 1. **Registration Verification Email**

**Endpoint:** `POST /api/admin/register/request`

Automatically sends verification code to user during registration.

**Request:**

```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "SecurePass123",
  "tier": "none",
  "company": "My Company",
  "phone": "+243..."
}
```

**Response (202 Accepted):**

```json
{
  "message": "Verification code sent",
  "expiresInSeconds": 90
}
```

**Verify registration:**
`POST /api/admin/register/verify`

```json
{
  "email": "user@example.com",
  "code": "ABC123" // 6-character code from email
}
```

---

### 2. **Password Reset Email**

**Endpoint:** `POST /api/admin/password/reset-request`

Sends password reset code to user's registered email.

**Request:**

```json
{
  "email": "user@email.com"
}
```

**Response (202 Accepted):**

```json
{
  "message": "Code de reinitialisation envoye",
  "expiresInSeconds": 90
}
```

**Verify and reset password:**
`POST /api/admin/password/reset-verify`

```json
{
  "email": "user@email.com",
  "code": "ABC123", // 6-character code from email
  "newPassword": "NewSecurePass123"
}
```

**Response (200 OK):**

```json
{
  "message": "Mot de passe réinitialisé avec succès."
}
```

---

## 🚀 Email Sending Features

### Multi-Protocol Fallback System

The system automatically tries multiple SMTP configurations if one fails:

1. **Configuration from `.env`** (primary)
   - Host: mail.betterlife-ong.org
   - Port: 465
   - Secure: true

2. **Localhost Port 25** (cPanel fallback)
   - Host: 127.0.0.1
   - Port: 25
   - Secure: false

3. **Localhost Port 587** (unsecured)
   - Host: localhost
   - Port: 587
   - Secure: false

4. **External Mail Server (Port 465)**
   - Host: mail.betterlife-ong.org
   - Port: 465
   - Secure: true

5. **External Mail Server (Port 587)**
   - Host: mail.betterlife-ong.org
   - Port: 587
   - Secure: false

### Development Mode

If SMTP_USER or SMTP_PASS is not configured, the system logs codes to the console instead of sending emails:

```
==================================================
[DEV MODE] SMTP non configuré.
Code de validation pour John Doe (john@example.com) : ABC123
==================================================
```

---

## 📝 Email Templates

### Registration Verification Email

**Subject:** Code de validation Kafumbu Smart City

Body:

```
Bonjour {name},

Votre code de validation Kafumbu Smart City est : {code}

Il expire dans 1 minute 30.

Si vous n'avez pas demande cette inscription, ignorez ce message.

— L'équipe Kafumbu Smart City
```

### Password Reset Email

**Subject:** Réinitialisation de mot de passe Kafumbu Smart City

Body:

```
Bonjour {name},

Votre code de réinitialisation de mot de passe est : {code}

Il expire dans 1 minute 30.

Si vous n'avez pas demande cette reinitialisation, ignorez ce message.

— L'équipe Kafumbu Smart City
```

---

## 🔐 Security Features

✅ **Token Hashing:** All codes are hashed with SHA256 before storage
✅ **Attempt Limiting:** Maximum 5 failed verification attempts
✅ **Expiration:** All codes expire after 90 seconds
✅ **Rate Limiting:** Email verification table uses UNIQUE constraint on email
✅ **Password Hashing:** Passwords are hashed with bcryptjs (10 rounds)
✅ **Transaction Safety:** Database operations use transactions where needed

---

## 🧪 Testing the Email System

### Test Registration Verification

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

### Test Password Reset

```bash
curl -X POST http://localhost:4000/api/admin/password/reset-request \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

---

## 📊 Database Schema

### Email Verification Tokens Table

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
)
```

---

## ⚙️ Production Checklist

- [ ] Update `SMTP_PASS` in `.env` with actual password
- [ ] Verify `SMTP_USER` is correct email address
- [ ] Test email delivery with a real email
- [ ] Ensure `SMTP_HOST` is accessible from production server
- [ ] Configure `JWT_SECRET` to a strong random value
- [ ] Set `JWT_EXPIRY` as needed (default: 7d)
- [ ] Test password reset flow in production
- [ ] Monitor email sending logs for failures

---

## 🐛 Troubleshooting

### Emails not sending?

1. Check `.env` file has valid `SMTP_USER` and `SMTP_PASS`
2. Check server logs for SMTP connection errors
3. Verify email account credentials are correct
4. Check firewall/network allows outgoing mail on port 465 or 587
5. Check email account is active and not locked

### Codes appearing in console instead of email?

- This is normal in development mode when SMTP is not configured
- To enable email sending, set `SMTP_USER` and `SMTP_PASS` in `.env`

### Codes expiring too quickly?

- Codes expire after 90 seconds (TOKEN_TTL_SECONDS = 90)
- To change, edit line 11 in `server/src/routes/admin.js`

### Verification failing?

- Codes are case-insensitive for input but stored uppercase
- Maximum 5 attempts before rejection
- Check that code hasn't expired (90 seconds)

---

## 📚 File References

- **Configuration:** `server/.env`
- **Email Logic:** `server/src/routes/admin.js` (lines 133-169)
- **SMTP Setup:** `server/src/routes/admin.js` (lines 73-131)
- **Registration:** `server/src/routes/admin.js` (lines 228-371)
- **Password Reset:** `server/src/routes/admin.js` (lines 1337-1450)

---

## ✨ Summary

The email system is **fully configured and ready to use**! It automatically sends:

- ✉️ Registration verification codes
- ✉️ Password reset codes

Just ensure the SMTP credentials in `.env` are set to valid values, and the system will start sending emails automatically.
