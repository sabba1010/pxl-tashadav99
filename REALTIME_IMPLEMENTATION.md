# Admin Dashboard Real-Time Data Implementation

## Overview
The admin dashboard now displays all data in real-time with automatic polling and manual refresh capabilities.

## Components Updated

### 1. **DashboardOverview.tsx**
**Location:** `src/dashboard/admin-dashboard/DashboardOverview.tsx`

**Changes:**
- ✅ Replaced mock data with real API calls
- ✅ Implemented `useEffect` with polling (every 30 seconds)
- ✅ Fetches data from multiple backend endpoints:
  - `/user/getall` - Total registered users
  - `/product/all` - Active and pending listings
  - `/purchase/all` - Total transactions and escrow balance
  - `/deposit/all` - Pending deposit requests
  - `/withdraw/all` - Pending withdrawal requests
  - `/rating/all/all` - Platform ratings

**Features:**
- Real-time metric updates every 30 seconds
- Loading state indicators on metric cards
- Last updated timestamp display
- Manual refresh button
- Error handling with fallback values

**Metrics Displayed:**
- Escrow Balance (USD)
- Platform Profit Lifetime (USD)
- Total Transactions
- Admin Revenue Share
- Buyer Deposit Rate
- Seller Withdrawal Rate
- Profit Per $1 Traded
- Pending Listings
- Deposit Requests
- Withdrawal Requests
- Total Registered Users

---

### 2. **RatingsReputationPanel.tsx**
**Location:** `src/dashboard/admin-dashboard/RatingsReputationPanel.tsx`

**Changes:**
- ✅ Added auto-refresh polling (every 30 seconds)
- ✅ Added `lastUpdated` state to track refresh time
- ✅ Added `autoRefresh` toggle button
- ✅ Updated header to show last update time
- ✅ Added ON/OFF toggle for auto-refresh

**Features:**
- Automatic data refresh every 30 seconds (toggleable)
- Manual refresh via refresh button
- Last updated timestamp display
- Auto-refresh toggle button in header
- Maintains all existing functionality (search, filter, pagination, review management)

---

### 3. **useRealTimeData Hook** (NEW)
**Location:** `src/hook/useRealTimeData.ts`

**Description:**
Reusable custom React hook for implementing real-time data fetching with polling capabilities.

**Usage:**
```typescript
import useRealTimeData from "@/hook/useRealTimeData";

// In your component
const { 
  data, 
  loading, 
  error, 
  lastUpdated, 
  refresh, 
  isAutoRefreshEnabled, 
  toggleAutoRefresh 
} = useRealTimeData(
  async () => {
    // Your fetch function
    const res = await axios.get("/api/endpoint");
    return res.data;
  },
  {
    pollInterval: 30000, // Optional: default is 30 seconds
    onError: (error) => console.error(error) // Optional: error callback
  }
);
```

**Return Values:**
- `data` - The fetched data
- `loading` - Boolean indicating if data is being fetched
- `error` - Error object if fetch failed
- `lastUpdated` - Timestamp of last successful update
- `refresh()` - Function to manually trigger data fetch
- `isAutoRefreshEnabled` - Boolean toggle state
- `toggleAutoRefresh()` - Function to toggle auto-refresh on/off

---

## Backend API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `GET /user/getall` | Fetch all users |
| `GET /product/all` | Fetch all products |
| `GET /purchase/all` | Fetch all purchases/transactions |
| `GET /deposit/all` | Fetch all deposit requests |
| `GET /withdraw/all` | Fetch all withdrawal requests |
| `GET /rating/all/all` | Fetch all ratings |
| `DELETE /rating/delete/:id` | Delete a specific rating |

---

## Polling Configuration

- **Default Poll Interval:** 30 seconds (30,000ms)
- **Customizable:** Yes, via `pollInterval` option in `useRealTimeData`
- **Auto-Refresh Toggle:** Available in UI for user control

---

## Real-Time Update Flow

```
┌─────────────────────────────────┐
│  Component Mounts                │
└────────────┬──────────────────────┘
             │
             ▼
    ┌────────────────────┐
    │  Initial Fetch     │
    │  setLoading(true)  │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────────┐
    │  Set up Interval       │
    │  (30 seconds)          │
    │  if autoRefresh = ON   │
    └────────┬───────────────┘
             │
             ▼
    ┌────────────────────────┐
    │  Update UI with Data   │
    │  setLastUpdated()      │
    │  setLoading(false)     │
    └────────┬───────────────┘
             │
             ├─── Every 30s ──┐
             │                 ▼
             │         ┌───────────────┐
             │         │  Poll Data    │
             │         └───────┬───────┘
             │                 │
             │                 ▼
             │         ┌──────────────────┐
             └─────────│ Update State     │
                       │ Refresh UI       │
                       └──────────────────┘
```

---

## Features Summary

### ✅ Real-Time Updates
- Automatic data refresh every 30 seconds
- Manual refresh button available
- Loading indicators during fetch

### ✅ User Control
- Toggle auto-refresh ON/OFF
- Manual refresh via button
- Visual feedback with last updated time

### ✅ Error Handling
- Graceful error handling with console logs
- Fallback to previous data on error
- User-friendly error display

### ✅ Performance
- Efficient polling with cleanup on unmount
- Prevents memory leaks with proper interval cleanup
- Optimized fetch functions with Promise.allSettled

### ✅ Extensibility
- Reusable `useRealTimeData` hook
- Customizable poll intervals
- Optional error callbacks
- TypeScript support

---

## Testing the Real-Time Features

1. **Dashboard Overview:**
   - Open the admin dashboard
   - Observe metrics updating every 30 seconds
   - Check "Last updated" timestamp changes
   - Click refresh button for immediate update

2. **Ratings Panel:**
   - Navigate to Ratings & Reputation
   - Toggle "Auto-refresh ON/OFF" button
   - Observe data updating when ON
   - Manual refresh works independently

3. **Browser DevTools:**
   - Check Network tab to see API calls every 30 seconds
   - Monitor Console for any fetch errors
   - Verify requests are cancelled on component unmount

---

## Performance Considerations

- **Network Calls:** 6-7 API calls every 30 seconds per dashboard page
- **Optimization:** Use Promise.allSettled for parallel fetching
- **Memory:** Intervals properly cleaned up on unmount
- **Load:** Spread across 30-second window to avoid spikes

---

## Future Enhancements

1. WebSocket implementation for true real-time updates (replace polling)
2. Configurable poll intervals per dashboard section
3. Data caching to reduce API calls
4. Incremental updates instead of full refresh
5. Server-sent events (SSE) support
6. Offline mode with cached data display

---

## Troubleshooting

**Issue:** Data not updating
- Check browser console for API errors
- Verify backend is running and accessible
- Check if auto-refresh is enabled
- Try manual refresh button

**Issue:** Too many API calls
- Increase pollInterval in useRealTimeData
- Reduce number of components polling simultaneously
- Consider implementing data caching

**Issue:** Memory leaks
- Ensure intervals are cleaned up in useEffect return
- Check browser DevTools memory profiler
- Verify component unmounts properly

---

## Code Examples

### Using the Dashboard Overview
```tsx
// Already implemented in DashboardOverview.tsx
const fetchAdminMetrics = useCallback(async () => {
  const [usersRes, productsRes, purchaseRes, ...] = 
    await Promise.allSettled([...]);
  // Process and set state
}, []);

useEffect(() => {
  fetchAdminMetrics();
  const interval = setInterval(fetchAdminMetrics, 30000);
  return () => clearInterval(interval);
}, [fetchAdminMetrics]);
```

### Using the Custom Hook
```tsx
// Example usage for future components
const MyComponent = () => {
  const { data, loading, refresh, lastUpdated } = useRealTimeData(
    async () => {
      const res = await axios.get("/api/data");
      return res.data;
    },
    { pollInterval: 20000 }
  );

  return (
    <div>
      {loading ? "Loading..." : <div>{JSON.stringify(data)}</div>}
      <p>Updated: {lastUpdated?.toLocaleTimeString()}</p>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
};
```

---

## Related Files

- [DashboardOverview.tsx](../src/dashboard/admin-dashboard/DashboardOverview.tsx)
- [RatingsReputationPanel.tsx](../src/dashboard/admin-dashboard/RatingsReputationPanel.tsx)
- [useRealTimeData.ts](../src/hook/useRealTimeData.ts)

---

**Last Updated:** January 23, 2026
**Status:** ✅ Production Ready
