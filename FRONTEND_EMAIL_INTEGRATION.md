# Frontend Integration - Email System

## 🎯 How to Integrate Email Features on Frontend

The Kafumbu Smart City platform has full backend support for email verification and password reset. Here's how to implement it on the frontend.

---

## 1. Registration with Email Verification

### Step 1: User Registration Form

Create a registration form with fields:

- Name
- Email
- Password
- Company (optional)
- Phone (optional)

### Step 2: Send Registration Request

```javascript
async function registerUser(name, email, password) {
  try {
    const response = await fetch(
      "http://localhost:4000/api/admin/register/request",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          tier: "none",
          company: "",
          phone: "",
        }),
      },
    );

    if (response.status === 202) {
      const data = await response.json();
      console.log(
        `Check email - code expires in ${data.expiresInSeconds} seconds`,
      );
      return { success: true, expiresIn: data.expiresInSeconds };
    } else {
      const error = await response.json();
      console.error("Registration failed:", error.error);
      return { success: false, error: error.error };
    }
  } catch (err) {
    console.error("Network error:", err);
    return { success: false, error: "Network error" };
  }
}
```

### Step 3: Show Verification Code Form

```javascript
async function verifyRegistration(email, code) {
  try {
    const response = await fetch(
      "http://localhost:4000/api/admin/register/verify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      },
    );

    if (response.status === 201) {
      const data = await response.json();
      // Save token to localStorage/sessionStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("Account created successfully!");
      return { success: true, user: data.user };
    } else {
      const error = await response.json();
      console.error("Verification failed:", error.error);
      return { success: false, error: error.error };
    }
  } catch (err) {
    console.error("Network error:", err);
    return { success: false, error: "Network error" };
  }
}
```

### UI Flow Example (Vue.js/React)

```javascript
// Step 1: Show registration form
// User fills: name, email, password
// User clicks "Register" → POST /register/request

// Step 2: Show "Check your email" message
// Display countdown timer (90 seconds)
// Show input field for 6-character code

// Step 3: User enters code
// POST /register/verify with email + code
// On success: Redirect to login/dashboard

// On error: Show error message, allow retry
```

---

## 2. Password Reset

### Step 1: Forgot Password Form

User enters email → clicks "Send Reset Code"

```javascript
async function requestPasswordReset(email) {
  try {
    const response = await fetch(
      "http://localhost:4000/api/admin/password/reset-request",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );

    if (response.status === 202) {
      const data = await response.json();
      console.log(
        `Reset code sent - expires in ${data.expiresInSeconds} seconds`,
      );
      return { success: true, expiresIn: data.expiresInSeconds };
    } else {
      const error = await response.json();
      console.error("Error:", error.error);
      return { success: false, error: error.error };
    }
  } catch (err) {
    console.error("Network error:", err);
    return { success: false, error: "Network error" };
  }
}
```

### Step 2: Reset Password with Code

User enters code + new password → clicks "Reset Password"

```javascript
async function resetPassword(email, code, newPassword) {
  try {
    const response = await fetch(
      "http://localhost:4000/api/admin/password/reset-verify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          newPassword,
        }),
      },
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Password reset successfully!");
      return { success: true };
    } else {
      const error = await response.json();
      console.error("Reset failed:", error.error);
      return { success: false, error: error.error };
    }
  } catch (err) {
    console.error("Network error:", err);
    return { success: false, error: "Network error" };
  }
}
```

### UI Flow Example

```javascript
// Step 1: Forgot Password Page
// User enters email
// POST /password/reset-request

// Step 2: Code Entry Page
// Show message: "Check your email for reset code"
// Display countdown timer (90 seconds)
// Input fields for:
//   - 6-character code
//   - New password
//   - Confirm password

// Step 3: Submit
// POST /password/reset-verify
// On success: Redirect to login with "Password changed"

// On error: Show error, allow retry
```

---

## 3. Complete Component Example (React)

```jsx
import { useState } from "react";

export function ResetPasswordFlow() {
  const [step, setStep] = useState("request"); // request | verify
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expiresIn, setExpiresIn] = useState(90);

  // Request reset code
  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/password/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.status === 202) {
        setStep("verify");
        // Start countdown
        let remaining = 90;
        const timer = setInterval(() => {
          remaining--;
          setExpiresIn(remaining);
          if (remaining <= 0) clearInterval(timer);
        }, 1000);
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Verify code and reset password
  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/password/reset-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: code.toUpperCase(),
          newPassword: password,
        }),
      });

      if (response.ok) {
        setStep("success");
        // Redirect to login after 2 seconds
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-form">
      {step === "request" && (
        <form onSubmit={handleRequest}>
          <h2>Reset Your Password</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={handleReset}>
          <h2>Enter Reset Code</h2>
          <p>Code expires in {expiresIn} seconds</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter 6-character code"
            maxLength={6}
            required
            disabled={loading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            required
            disabled={loading}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            required
            disabled={loading}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading || expiresIn <= 0}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      {step === "success" && (
        <div className="success">
          <h2>✓ Password Reset Successfully!</h2>
          <p>Redirecting to login...</p>
        </div>
      )}
    </div>
  );
}
```

---

## 4. Error Handling Reference

### Registration Errors

```
400 - name, email and password are required
409 - Email already in use (Cet e-mail est deja utilise)
410 - Verification code expired
401 - Invalid verification code
404 - Verification request not found
500 - Server error
```

### Password Reset Errors

```
400 - Email required or invalid input
404 - User not found / Verification request not found
410 - Reset code expired
401 - Invalid code
500 - Server error
```

---

## 5. Best Practices

### ✅ Do:

- Store verification codes in state, not localStorage
- Disable submit button while loading
- Show countdown timers (codes expire in 90 seconds)
- Clear sensitive data after success
- Show user-friendly error messages
- Validate email format before sending
- Validate password strength
- Require password confirmation for resets

### ❌ Don't:

- Store full emails in localStorage
- Display server error messages directly to users
- Allow multiple rapid requests (implement request throttling)
- Show codes in URL parameters
- Clear form too early
- Forget to handle network errors

---

## 6. API Response Codes

| Status | Endpoint               | Meaning                          |
| ------ | ---------------------- | -------------------------------- |
| 202    | register/request       | Code sent, awaiting verification |
| 202    | password/reset-request | Code sent, awaiting verification |
| 201    | register/verify        | Account created successfully     |
| 200    | password/reset-verify  | Password changed successfully    |
| 400    | Any                    | Bad request (missing fields)     |
| 401    | register/verify        | Wrong code                       |
| 401    | password/reset-verify  | Wrong code                       |
| 404    | password/reset-request | Email not found                  |
| 404    | register/verify        | Verification request not found   |
| 409    | register/request       | Email already taken              |
| 410    | verify endpoints       | Code expired                     |
| 500    | Any                    | Server error                     |

---

## 7. Testing Checklist

- [ ] Registration email sent successfully
- [ ] Can verify email with correct code
- [ ] Cannot verify with wrong code
- [ ] Codes expire after 90 seconds
- [ ] Cannot verify after 5 failed attempts
- [ ] Password reset email sent successfully
- [ ] Can reset password with correct code
- [ ] New password works for login
- [ ] Error messages are user-friendly
- [ ] Loading states prevent duplicate requests

---

**Your email system is ready! Integrate these flows into your frontend.** 🚀
