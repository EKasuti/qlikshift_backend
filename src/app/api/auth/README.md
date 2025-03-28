<a id="readme-top"></a>

# API/AUTH

This folder contains the following apis

| Method   | Endpoint                               | Description                     |
|----------|----------------------------------------|---------------------------------|
| `POST`   | `/api/auth/signup`                     | Creates account for user        |
| `POST`   | `/api/auth/login`                      | Logs in a user                  |
| `GET`    | `/api/auth/`                           | Retrieves user details          |


## Detailed Endpoint Descriptions

#### POST `/api/auth/signup`

Endpoint to create account for user.

**Payload:**
- `username` (required) : Username
- `email` (required) : Emails
- `password` (required) : Password

#### POST `/api/auth/login`

Endpoint to login a user.

**Payload:**
- `email` (required) : Emails
- `password` (required) : Password

#### GET `/api/auth/login`

Endpoint to retrieve user details using tokens.




<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Database Schema

Authentication uses the following sql tables:

- **users**:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  is_super_user BOOLEAN DEFAULT false,
  is_email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
- **user_sessions**:
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```


<p align="right">(<a href="#readme-top">back to top</a>)</p>
