# Wallet Feature

The wallet feature allows users to manage their account balance and deposit funds into their trading account.

## Overview

The wallet feature provides:

- **Balance Display**: Shows current account balance in the sidebar
- **Deposit Functionality**: Modal dialog for depositing funds
- **Real-time Updates**: Automatic balance refresh after transactions

## Components

### DepositDialog

Modal dialog component for depositing funds into the account.

**Location**: `src/features/wallet/components/deposit-dialog.tsx`

**Props**:

- `open: boolean` - Controls whether the dialog is visible
- `onOpenChange: (open: boolean) => void` - Callback when dialog open state changes

**Features**:

- Input validation for positive amounts
- Loading state during deposit processing
- Success/error toast notifications
- Automatic query invalidation to refresh balance

**Usage**:

```tsx
import { DepositDialog } from '@/features/wallet/components/deposit-dialog';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Deposit</button>
      <DepositDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
```

### WalletSection

Sidebar component displaying the wallet balance with a deposit button.

**Location**: `src/features/shared/components/wallet-section.tsx`

**Features**:

- Displays formatted account balance
- Loading skeleton during data fetch
- Plus button to trigger deposit dialog
- Tooltip showing balance amount
- Responsive design that collapses with sidebar

**Integration**:
Integrated into `AppSidebar` footer in `src/features/shared/components/app-sidebar.tsx`

## Translations

Wallet translations are available in:

- **English**: `src/i18n/locales/en/wallet.ts`
- **Polish**: `src/i18n/locales/pl/wallet.ts`

Common keys:

- `wallet.deposit` - "Deposit" action button
- `wallet.deposit_funds` - "Deposit Funds" dialog title
- `wallet.deposit_description` - Dialog description
- `wallet.amount` - "Amount" label
- `wallet.enter_amount` - Placeholder text
- `wallet.minimum_deposit` - Minimum deposit notice
- `wallet.deposit_success` - Success message (with `{{amount}}` interpolation)
- `wallet.invalid_amount` - Validation error message

## Architecture

### Data Flow

1. User clicks the plus (+) button in the wallet sidebar section
2. `WalletSection` opens the `DepositDialog`
3. User enters amount and submits the form
4. `DepositDialog` validates input and calls the deposit API (to be implemented)
5. On success:
   - Toast notification displays confirmation
   - Investor query is invalidated
   - Balance updates automatically
   - Dialog closes

### State Management

- **Dialog State**: Managed in `WalletSection` using local `useState`
- **Deposit State**: Managed in `DepositDialog` using TanStack Query `useMutation`
- **Balance State**: Fetched from `investorsMeRetrieveOptions()` query

## Future Implementation

### Backend Integration

Replace the simulated API call in `DepositDialog.mutationFn` with actual API endpoint:

```tsx
// TODO: Replace with actual API call
const response = await depositFunds({ amount: numAmount });
```

### Additional Features

Potential enhancements:

- Withdrawal functionality
- Transaction history view
- Deposit method selection (credit card, bank transfer, etc.)
- Recurring deposits
- Deposit limits and validations
- Payment processing integration

## Testing

### Component Testing

Test the deposit dialog validation and state management:

```tsx
// Example test structure
describe('DepositDialog', () => {
  it('should validate positive amounts', () => {
    // Test implementation
  });

  it('should show success notification on deposit', () => {
    // Test implementation
  });

  it('should disable submit button with invalid input', () => {
    // Test implementation
  });
});
```

### Integration Testing

Test the full wallet flow in E2E tests using Playwright.
