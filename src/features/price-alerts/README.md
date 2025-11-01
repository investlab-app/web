# Price Alerts Feature

## Overview

The Price Alerts feature allows users to create and manage price alerts for stocks. Users can set price thresholds (above/below) and receive notifications when prices reach their target levels.

## Architecture

### Frontend Structure

```
web/src/features/price-alerts/
├── components/
│   ├── create-price-alert-form.tsx    # Form for creating new alerts
│   ├── price-alerts-container.tsx     # Main container component
│   ├── price-alerts-table.tsx         # Table displaying alerts
│   └── index.ts                       # Component exports
├── hooks/
│   ├── use-price-alerts.ts            # All price alert hooks
│   └── index.ts                       # Hook exports
└── README.md                          # This file

web/src/routes/_authed/price-alerts/
└── index.tsx                          # Route component
```

### Backend Structure

```
backend/backend/modules/prices/
├── models.py                          # PriceAlert model (already exists)
├── serializers.py                     # PriceAlertSerializer (already exists)
├── views.py                           # CRUD views (already exists)
├── urls.py                            # URL routing (already exists)
└── ...
```

## Features

### Create Price Alert
- Select a stock symbol from dropdown
- Choose threshold type: "Price Goes Above" or "Price Goes Below"
- Set target price
- Enable/disable notifications
- Form validation with Zod schema

### View Price Alerts
- Displays all user's alerts in a table
- Shows symbol, name, threshold type, price, and status
- Visual indicators (chevron up/down) for threshold types
- Status badge (Active/Inactive)

### Delete Price Alert
- Confirmation dialog before deletion
- Loading state during deletion
- Toast notifications for success/error

### Sidebar Navigation
- New "Price Alerts" navigation item with Bell icon
- Accessible from main dashboard

## API Endpoints

All endpoints require authentication (Clerk JWT token).

### List/Create Alerts
- **GET** `/api/prices/price-alert/` - List all alerts for current user
- **POST** `/api/prices/price-alert/` - Create new alert

### Retrieve/Update/Delete Alert
- **GET** `/api/prices/price-alert/{id}/` - Get alert details
- **PATCH** `/api/prices/price-alert/{id}/` - Update alert
- **DELETE** `/api/prices/price-alert/{id}/` - Delete alert

## Usage

### Using the Price Alerts Container

```tsx
import { PriceAlertsContainer } from '@/features/price-alerts/components';

export function MyPage() {
  return <PriceAlertsContainer />;
}
```

### Using Individual Hooks

```tsx
import {
  usePriceAlerts,
  useCreatePriceAlert,
  useDeletePriceAlert,
  useUpdatePriceAlert,
} from '@/features/price-alerts/hooks';

// Fetch all alerts
const { data: alerts } = usePriceAlerts();

// Create new alert
const createMutation = useCreatePriceAlert();
createMutation.mutate({
  instrument_ticker: 'AAPL',
  threshold_type: 'above',
  threshold_value: 150,
  notification_config: { is_active: true },
});

// Delete alert
const deleteMutation = useDeletePriceAlert();
deleteMutation.mutate(alertId);

// Update alert
const updateMutation = useUpdatePriceAlert();
updateMutation.mutate({
  id: alertId,
  data: { threshold_value: 160 },
});
```

## Hooks

### `usePriceAlerts()`
Fetches all price alerts for the current user.

**Returns:**
- `data`: `PriceAlert[]` - Array of alerts
- `isLoading`: `boolean` - Loading state
- `error`: `Error | null` - Any errors

**Caching:** 5 minutes stale time

### `useCreatePriceAlert()`
Creates a new price alert.

**Mutation Options:**
```typescript
{
  instrument_ticker: string;
  threshold_type: 'above' | 'below';
  threshold_value: string | number;
  notification_config: {
    is_active?: boolean;
    enable_email?: boolean;
    enable_in_app?: boolean;
  };
}
```

**Side Effects:**
- Invalidates `priceAlerts` query
- Shows success/error toast

### `useDeletePriceAlert()`
Deletes a price alert.

**Parameters:** `alertId: string`

**Side Effects:**
- Invalidates `priceAlerts` query
- Shows success/error toast

### `useUpdatePriceAlert()`
Updates an existing price alert.

**Parameters:**
```typescript
{
  id: string;
  data: {
    threshold_type?: 'above' | 'below';
    threshold_value?: number;
    notification_config?: {...};
  };
}
```

**Side Effects:**
- Invalidates `priceAlerts` query
- Shows success/error toast

## Components

### `PriceAlertsContainer`
Main container component that orchestrates all alerts functionality.

**Features:**
- Displays header with title and description
- "Create Alert" button opens dialog
- Shows empty state or alerts table
- Handles create/delete operations

### `CreatePriceAlertForm`
Form for creating new price alerts.

**Props:**
- `onSubmit: (data) => Promise<void>` - Submit handler
- `isSubmitting?: boolean` - Loading state

**Features:**
- Symbol selection dropdown (auto-fetches instruments)
- Threshold type selector (above/below)
- Price input field with validation
- Enable notifications checkbox
- Form validation with Zod

### `PriceAlertsTable`
Table displaying all price alerts.

**Props:**
- `alerts: PriceAlert[]` - Array of alerts
- `isLoading?: boolean` - Loading state
- `onDelete?: (id: string) => Promise<void>` - Delete handler
- `isDeleting?: boolean` - Deletion loading state

**Features:**
- Symbol and name columns
- Threshold type with visual indicators
- Price display with formatting
- Active/Inactive status badge
- Delete button with confirmation dialog
- Empty state handling

## Route

### `/price-alerts`
Main route for price alerts management.

**File:** `web/src/routes/_authed/price-alerts/index.tsx`

**Features:**
- Renders inside `AppFrame` for consistent layout
- Protected route (requires authentication via `/_authed` parent)
- Full page view of `PriceAlertsContainer`

## Internationalization (i18n)

The feature uses translation keys. Required translations:

```
price_alerts:
  title: "Price Alerts"
  description: "Manage your price alerts and get notified when prices reach your target levels"
  create_alert: "Create Alert"
  add_alert: "Add Alert"
  new_alert: "Create New Price Alert"
  set_target_price: "Set a price target and get notified when the stock reaches it"
  form_description: "Set up a price alert for a stock and get notified when the price reaches your target"
  select_symbol: "Select a symbol"
  threshold_type: "Alert When"
  type_above: "Price Goes Above"
  type_below: "Price Goes Below"
  threshold_value: "Price ($)"
  enable_notifications: "Enable Notifications"
  notifications_description: "Receive notifications when the price alert triggers"
  created_title: "Alert Created"
  created_message: "Price alert has been created successfully"
  creation_error: "Failed to create price alert"
  deleted_title: "Alert Deleted"
  deleted_message: "Price alert has been deleted"
  deletion_error: "Failed to delete price alert"
  updated_title: "Alert Updated"
  updated_message: "Price alert has been updated"
  update_error: "Failed to update price alert"
  empty_state: "No price alerts yet"
  delete_alert: "Delete Price Alert"
  delete_alert_description: "Are you sure you want to delete this price alert?"
  no_alerts: "No price alerts created yet"

common.tooltips.navigation:
  price_alerts: "Manage your price alerts and notifications"
```

## Integration with Backend

### Authentication
All requests automatically include the Clerk JWT token via the API client.

### Data Model
The `PriceAlert` model includes:
- `id`: UUID primary key
- `investor`: Foreign key to Investor
- `instrument`: Foreign key to Instrument
- `notification_config`: Foreign key to NotificationConfig
- `threshold_type`: "above" or "below"
- `threshold_value`: Decimal price threshold
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Validation
- Symbol must exist in Instruments table
- Threshold value must be positive
- Unique constraint: (instrument, threshold_type, threshold_value) per investor

## Error Handling

### User Feedback
- Toast notifications for success/error
- Form validation errors displayed inline
- Confirmation dialog for destructive actions
- Loading states during operations

### API Errors
- Caught by mutation hooks
- Logged to console
- User-friendly error messages via toast

## Performance

### Caching
- Price alerts cached with 5-minute stale time
- Query invalidated on create/update/delete
- Instruments list cached separately

### Optimization
- Table virtualization not needed (typically < 100 alerts)
- Form fields debounced via React Hook Form
- Dialog lazy-loaded on first open

## Testing

### Unit Tests (Frontend)
```tsx
describe('PriceAlertsContainer', () => {
  it('displays alerts from query', () => { ... });
  it('creates new alert via form', () => { ... });
  it('deletes alert with confirmation', () => { ... });
});
```

### E2E Tests (Playwright)
```typescript
test('user can create and delete price alert', async ({ page }) => {
  // Login via Clerk
  // Navigate to /price-alerts
  // Create alert
  // Verify in table
  // Delete alert
  // Verify removal
});
```

## Future Enhancements

- [ ] Edit existing alerts
- [ ] Bulk delete alerts
- [ ] Alert history/logs
- [ ] Email notification preferences
- [ ] Push notification preferences
- [ ] Price alert triggers history
- [ ] Recurring alerts
- [ ] Smart alerts (e.g., trailing stops)

## Troubleshooting

### Alerts not appearing
1. Check user is authenticated (check Clerk session)
2. Verify alerts exist in backend database
3. Check network tab for API errors
4. Verify user's investor record exists

### Form not submitting
1. Check console for validation errors
2. Verify symbol is correctly selected
3. Check threshold value is valid number
4. Ensure notifications config is properly set

### Delete not working
1. Check confirmation dialog appears
2. Verify delete button is not disabled
3. Check network request succeeds
4. Look for error toast message

## Related Features

- **Instruments**: Provides stock symbol data
- **Notifications**: Handles alert delivery
- **Dashboard**: Shows portfolio overview
- **Transactions**: Shows trade history