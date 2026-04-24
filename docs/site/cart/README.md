# Cart

## Route

- `GET /cart` → `src/app/(site)/cart/page.tsx`

## State Management

- Uses `CartContext`:
  - Hook: `useCart` from `src/context/CartContext.tsx`
  - Exposes: `items`, `removeItem`, `updateQuantity`, `totalPrice`

## UI Behavior

- Shows an empty state when `items.length === 0`.
- Quantity controls call `updateQuantity(id, quantity)`.
