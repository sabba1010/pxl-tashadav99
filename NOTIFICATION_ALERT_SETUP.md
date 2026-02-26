# Notification Alert System Setup Guide

## Overview
Your app now has a real-time notification alert system that displays toast notifications whenever new notifications arrive. Alerts appear in the top-right corner as soon as they're detected.

## Components Created

### 1. **useNotificationAlert Hook** (`src/hook/useNotificationAlert.ts`)
- Polls the backend for new notifications every 5 seconds (configurable)
- Automatically detects new notifications and triggers alerts
- Shows beautiful toast notifications using `react-hot-toast`
- Tracks notification IDs to avoid duplicate alerts

**Features:**
- Automatic polling at configurable intervals
- User-specific notifications support
- Clean toast UI with title and message
- 5-second duration per notification
- Top-right positioned alerts

### 2. **NotificationListener Component** (`src/components/NotificationListener.tsx`)
- Wraps the notification alert hook
- Renders the toast container
- Can be placed in any parent component (currently in Layout)

**Props:**
```typescript
interface NotificationListenerProps {
  userEmail?: string;        // Optional: For user-specific notifications
  pollInterval?: number;     // Optional: Poll interval in ms (default: 5000)
}
```

### 3. **Updated Layout Component** (`src/layout/Layout.tsx`)
- Integrated NotificationListener with user email detection
- Automatically starts notification alerts for logged-in users

## How It Works

1. **User logs in** → `useAuthHook` provides user email
2. **NotificationListener mounts** → Starts polling backend
3. **New notification arrives** → Toast alert appears automatically
4. **User sees alert** → Title and message displayed for 5 seconds
5. **System tracks IDs** → Prevents duplicate alerts

## Backend Requirements

Your backend endpoint should return notifications like this:

```json
[
  {
    "_id": "unique-id",
    "title": "Order Confirmed",
    "message": "Your order #12345 has been confirmed",
    "userEmail": "buyer@example.com",
    "timestamp": "2024-01-27T10:30:00Z"
  }
]
```

**Supported endpoints:**
- `GET /api/notification/getall` - All notifications
- `GET /api/notification/user/:email` - User-specific notifications

## Customization

### Change Poll Interval
In `Layout.tsx`, modify the `pollInterval` prop:
```tsx
<NotificationListener userEmail={user.email} pollInterval={3000} /> // 3 seconds
```

### Change Notification Position
In `useNotificationAlert.ts`, modify the `position` prop:
```typescript
toast.success(content, {
  position: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
});
```

### Change Notification Duration
```typescript
toast.success(content, {
  duration: 10000 // 10 seconds
});
```

### Add Different Toast Types
```typescript
// Success (green)
toast.success("Message");

// Error (red)
toast.error("Error message");

// Loading
toast.loading("Loading...");

// Custom
toast((t) => <CustomComponent />);
```

## Toast Styling Examples

### Custom Styling
```typescript
toast.success(message, {
  style: {
    background: '#10b981',
    color: 'white',
  },
  className: 'custom-toast',
});
```

### With Custom Icon
```typescript
toast.success(message, {
  icon: '🎉',
  duration: 3000,
});
```

## Testing the System

1. **Open your app and log in**
2. **Check browser console** for any errors
3. **Create a test notification** via your admin panel or backend API
4. **Observe toast alert** appearing in top-right corner

### Manual Test API Call
```bash
curl -X POST https://tasha-vps-backend-2.onrender.com/api/notification/notify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Notification",
    "message": "This is a test alert",
    "userEmail": "user@example.com"
  }'
```

## Important Notes

⚠️ **Environment Variable:** Make sure `REACT_APP_API_URL` is set in your `.env` file:
```
REACT_APP_API_URL=https://tasha-vps-backend-2.onrender.com
```

✅ **Token Required:** Notifications require the user to be logged in (token in localStorage)

✅ **Already Installed:** You already have `react-hot-toast` in your dependencies

## Files Modified
- `src/layout/Layout.tsx` - Added NotificationListener component

## Files Created
- `src/hook/useNotificationAlert.ts` - Main notification hook
- `src/components/NotificationListener.tsx` - Listener component

## Next Steps

1. **Test the alerts** by creating a test notification via your backend
2. **Adjust poll interval** based on your needs (shorter = more frequent, higher bandwidth)
3. **Customize styling** to match your app's design
4. **Add different notification types** (success, error, warning) as needed

## Troubleshooting

**No alerts appearing?**
- Check browser console for errors
- Verify `REACT_APP_API_URL` is correct
- Ensure token is stored in localStorage
- Verify backend endpoint is working

**Alerts appearing too frequently?**
- Increase `pollInterval` value (e.g., 10000 for 10 seconds)
- Check if backend is creating duplicate notifications

**Toast not styled correctly?**
- Check that `react-hot-toast` CSS is imported (it should auto-import)
- Override with custom className if needed
