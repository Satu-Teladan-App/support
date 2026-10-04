# Account Deletion Backend

Complete backend implementation for handling user account deletion requests.

## 🏗️ Architecture

### API Routes

#### 1. **Authentication Check** (`/api/auth/check`)

- **Method**: GET
- **Purpose**: Verify if user is authenticated
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "authenticated": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### 2. **Submit Deletion Request** (`/api/account-deletion/request`)

- **Method**: POST
- **Purpose**: Submit a new account deletion request
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body**:

```json
{
  "email": "user@example.com",
  "reason": "User's reason for deletion (min 10 characters)"
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Permintaan penghapusan akun berhasil dibuat",
  "data": {
    "id": "uuid",
    "status": "pending",
    "requested_at": "2024-01-01T00:00:00Z"
  }
}
```

#### 3. **Get Deletion Request Status** (`/api/account-deletion/request`)

- **Method**: GET
- **Purpose**: Get user's deletion request history
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "reason": "User reason",
      "status": "pending",
      "requested_at": "2024-01-01T00:00:00Z",
      "processed_at": null,
      "metadata": {}
    }
  ]
}
```

#### 4. **Admin - List Deletion Requests** (`/api/account-deletion/admin`)

- **Method**: GET
- **Purpose**: List all deletion requests (admin only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Admin**: a user with an `admin_roles` row, the same check as `public.is_admin()` and admin-dashboard. Other signed-in users get 403.
- **Query Parameters**:
  - `status`: Filter by status (pending/approved/rejected/completed/all)
  - `limit`: Number of results (default: 50)
  - `offset`: Pagination offset (default: 0)
- **Response**:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0
  }
}
```

#### 5. **Admin - Process Deletion Request** (`/api/account-deletion/admin`)

- **Method**: PATCH
- **Purpose**: Approve, reject, or complete a deletion request
- **Headers**:
  - `Authorization: Bearer <admin_token>`
  - `Content-Type: application/json`
- **Body**:

```json
{
  "request_id": "uuid",
  "action": "approved|rejected|completed",
  "notes": "Optional admin notes"
}
```

- `approved` / `rejected`: only for `pending` requests. The notes and the admin's email are added to `metadata`; the requester's email stays there so support can contact them.
- `completed`: only for `approved` requests. The API calls `public.delete_user_account()`, which deletes the account and its data in one transaction and anonymizes the request, then removes the user's files through the Storage API. The response includes `storage_cleanup: { removed, failed }`.
- Any other transition returns 409.

## 🗄️ Database Schema

### Table: `account_deletion_requests`

| Column       | Type      | Description                            |
| ------------ | --------- | -------------------------------------- |
| id           | UUID      | Primary key                            |
| user_id      | UUID      | Foreign key to auth.users; null once the account is deleted |
| reason       | TEXT      | User's reason for deletion; removed on completion |
| status       | TEXT      | pending/approved/rejected/completed (`cancelled`: superseded by another completed request) |
| requested_at | TIMESTAMP | When request was made                  |
| processed_at | TIMESTAMP | When request was approved or rejected  |
| processed_by | UUID      | Admin who approved or rejected         |
| metadata     | JSONB     | Email, IP, user agent, admin notes; only the admin's email and completion details remain after completion |
| created_at   | TIMESTAMP | Record creation time                   |
| updated_at   | TIMESTAMP | Last update time                       |

### Indexes

- `idx_account_deletion_requests_user_id` - Fast user lookup
- `idx_account_deletion_requests_status` - Filter by status
- `idx_account_deletion_requests_requested_at` - Chronological ordering

## 🔐 Security Features

### Row Level Security (RLS)

- Users can only view their own deletion requests
- Users can only create pending deletion requests for themselves
- Only service role can update requests (admin operations)
- Only service role can run `delete_user_account()`, and only for approved requests

### Authentication

- All endpoints require valid Supabase JWT token
- Token validated on every request
- Email verification ensures request matches logged-in user

### Data Protection

- Stores request metadata (IP, user agent) for audit trail
- Prevents a new request while one is pending or approved
- Validates reason length (minimum 10 characters)
- Completed requests are kept but anonymized: the user id, reason, email, IP address, user agent and admin notes are removed; the id, dates, status and approving admin stay

## 📦 Installation

### 1. Install Dependencies

```bash
pnpm add @supabase/supabase-js
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Run Database Migration

Run the SQL migration in Supabase Dashboard or CLI:

```bash
# Using Supabase CLI
supabase migration up

# Or manually run the SQL in:
# supabase/migrations/001_create_account_deletion_requests.sql
```

Then run `supabase/migrations/004_support_approved_account_deletion.sql`. It adds the approved/rejected statuses, keeps anonymized requests after deletion, and creates `delete_user_account()`.

## 🚀 Usage

### Frontend Integration

```typescript
import {
  submitDeletionRequest,
  checkAuthStatus,
} from "@/lib/api/account-deletion";

// Check authentication
const authStatus = await checkAuthStatus();
if (authStatus.authenticated) {
  console.log("User:", authStatus.user);
}

// Submit deletion request
try {
  await submitDeletionRequest({
    email: "user@example.com",
    reason: "I no longer need this account",
  });
  // Show success message
} catch (error) {
  // Handle error
  console.error(error.message);
}
```

## 🔧 Configuration

### Status Flow

```
pending → approved → completed
        ↘ rejected
```

- **pending**: Initial state when user submits request
- **approved**: Admin has approved the request
- **rejected**: Admin has rejected the request
- **completed**: Account has been fully deleted

### Customization

#### Add Email Notifications

In `/app/api/account-deletion/request/route.ts` (line 82):

```typescript
// TODO: Send email notification to user
// Example using your email service:
// await sendEmail({
//   to: user.email,
//   template: 'deletion-request-received',
//   data: { ...deletionRequest }
// })
```

## 📊 Monitoring

### Check Deletion Request Statistics

```sql
-- Count by status
SELECT status, COUNT(*)
FROM account_deletion_requests
GROUP BY status;

-- Recent requests
SELECT *
FROM account_deletion_requests
ORDER BY requested_at DESC
LIMIT 10;

-- Average processing time
SELECT AVG(
  EXTRACT(EPOCH FROM (processed_at - requested_at)) / 3600
) as avg_hours
FROM account_deletion_requests
WHERE processed_at IS NOT NULL;
```

## 🛠️ Development

### Test Authentication

```typescript
// Set up test user in browser console
localStorage.setItem("supabase.auth.token", "your_test_token");
```

### Test API Endpoints

```bash
# Check auth
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/auth/check

# Submit deletion request
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","reason":"Testing deletion"}' \
  http://localhost:3000/api/account-deletion/request
```

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot find module '@supabase/supabase-js'"**

   - Run: `pnpm add @supabase/supabase-js`

2. **"Unauthorized" errors**

   - Check environment variables are set correctly
   - Verify Supabase URL and keys
   - Ensure user is logged in with valid session

3. **Database errors**

   - Verify migration has been run
   - Check RLS policies are enabled
   - Ensure service role key has proper permissions

4. **"Already have pending request" error**
   - User can only have one open (pending or approved) request at a time
   - Previous request must be processed first

## 📝 TODO

- [ ] Implement email notifications
- [ ] Add admin dashboard UI
- [x] Implement actual account deletion logic
- [ ] Add rate limiting
- [ ] Add request expiration (auto-cancel after 30 days)
- [ ] Add audit logging
- [ ] Implement soft delete option
- [ ] Add data export before deletion

## 📄 License

Part of the Satu Teladan App project.
