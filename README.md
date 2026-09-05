# AWS LPU SSO Integration

Add **Login with AWS LPU SSO** to your application.

## 1. Register Your Application

Go to:

https://sso.awslpu.in/admin/clients

Click **Register Application**.

Enter:

```text
Application Name: My Application
Client ID: my-application
Redirect URI: https://myapp.com/auth/callback
````

After creating the application, you will receive:

```text
Client ID
Client Secret
```

Keep the Client Secret private.

---

## 2. Add the Login Button

When the user clicks **Login with AWS LPU SSO**, send them to:

```text
https://sso.awslpu.in/authorize
```

with these parameters:

```text
client_id=YOUR_CLIENT_ID
redirect_uri=YOUR_REDIRECT_URI
response_type=code
scope=openid profile email
state=RANDOM_VALUE
nonce=RANDOM_VALUE
code_challenge=YOUR_PKCE_CHALLENGE
code_challenge_method=S256
```

Example:

```text
https://sso.awslpu.in/authorize?client_id=my-application&redirect_uri=https%3A%2F%2Fmyapp.com%2Fauth%2Fcallback&response_type=code&scope=openid%20profile%20email&state=abc123&nonce=xyz456&code_challenge=YOUR_CHALLENGE&code_challenge_method=S256
```

The user will be taken to the AWS LPU SSO login page.

---

## 3. Handle the Callback

After successful login, AWS LPU SSO redirects the user to your registered URL:

```text
https://myapp.com/auth/callback?code=AUTHORIZATION_CODE&state=abc123
```

Check that the returned `state` matches the value you created before login.

Then take the `code` and exchange it for tokens.

---

## 4. Get the Tokens

Make a **server-side** request:

```text
POST https://sso.awslpu.in/oauth/token
```

Use your Client ID and Client Secret as HTTP Basic Authentication.

Send:

```text
grant_type=authorization_code
code=AUTHORIZATION_CODE
redirect_uri=YOUR_REDIRECT_URI
code_verifier=YOUR_CODE_VERIFIER
```

Example:

```bash
curl -X POST https://sso.awslpu.in/oauth/token \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "grant_type=authorization_code" \
  --data-urlencode "code=AUTHORIZATION_CODE" \
  --data-urlencode "redirect_uri=https://myapp.com/auth/callback" \
  --data-urlencode "code_verifier=YOUR_CODE_VERIFIER"
```

Response:

```json
{
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": 900,
  "id_token": "..."
}
```

---

## 5. Get the User

Use the access token to get the logged-in user's information:

```text
GET https://sso.awslpu.in/oauth/userinfo
```

Add:

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Example:

```bash
curl https://sso.awslpu.in/oauth/userinfo \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Response:

```json
{
  "sub": "USER_ID",
  "name": "John Doe",
  "email": "john@example.com",
  "picture": "https://..."
}
```

Use `sub` as the user's AWS LPU SSO ID.

---

## 6. Verify the Login

Before creating a session for the user:

* Verify the ID token using the public keys from:

```text
https://sso.awslpu.in/oauth/jwks
```

* Make sure the ID token was issued by:

```text
https://sso.awslpu.in
```

* Make sure it is intended for your Client ID.
* Make sure it has not expired.
* Make sure its `nonce` matches the nonce created during login.
* Make sure the `sub` from UserInfo matches the `sub` in the ID token.

Once verified, create a normal login session for the user in your application.

---

# Complete Flow

```text
1. Register your application
          ↓
2. Get Client ID + Client Secret
          ↓
3. Send user to /authorize
          ↓
4. User logs in
          ↓
5. Receive authorization code
          ↓
6. Send code to /oauth/token
          ↓
7. Receive access token + ID token
          ↓
8. Verify ID token
          ↓
9. Call /oauth/userinfo
          ↓
10. Create your application's session
```

---

# Important

The Client Secret must stay on your server.

Never put it in browser code or expose it to users.

The following URLs are available:

```text
Authorization
https://sso.awslpu.in/authorize

Token
https://sso.awslpu.in/oauth/token

User Information
https://sso.awslpu.in/oauth/userinfo

Public Keys
https://sso.awslpu.in/oauth/jwks

Configuration
https://sso.awslpu.in/.well-known/openid-configuration
```

That's it. Your application can now use **AWS LPU SSO**.

