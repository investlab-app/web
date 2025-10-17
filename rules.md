# Node types and Connection Rules

## Connector nodes

**Max Connections:**

- Incoming (target): **1** connection per handle, requires **2** valid incoming
- Outgoing (source): **1** connection per handle, requires **1** valid outgoing

**Allowed Connections:**

- Incoming from: `Rule`, `Connector`
- Outgoing to: `Connector`, `FlowThenElse`, `FlowThen`

**Types:**

- `And`
- `Or`

## Flow nodes

Each of the flow nodes has different validation rules, so they have been defined as separate supertypes

### FlowIf node

**Max Connections:**

- Incoming (target): **1** connection per handle, requires **1** valid incoming
- Outgoing (source): **1** connection per handle, requires **1** valid outgoing

**Allowed Connections:**

- Incoming from: `Trigger`, `FlowThen`, `FlowThenElse`
- Outgoing to: `Rule`

**Types:**

- `If`

### FlowThenElse node

**Max Connections:**

- Incoming (target): **1** connection per handle, requires **1** valid incoming
- Outgoing (source): **Unlimited** connections per handle, requires **1** valid outgoing

**Allowed Connections:**

- Incoming from: `Rule`, `Connector`
- Outgoing to: `Action`, `FlowIf`

**Types:**

- `ThenElse`

### FlowThen node

**Max Connections:**

- Incoming (target): **1** connection per handle, requires **1** valid incoming
- Outgoing (source): **Unlimited** connections per handle, requires **1** valid outgoing

**Allowed Connections:**

- Incoming from: `Trigger`, `Rule`
- Outgoing to: `Action`, `FlowIf`

**Types:**

- `Then`

## Trigger nodes

**Max Connections:**

- Incoming (target): **No** incoming connections allowed, requires **0** valid incoming
- Outgoing (source): **1** connection per handle, requires **1** valid outgoing

**Allowed Connections:**

- Incoming from: None
- Outgoing to: `FlowIf`, `FlowThen`

**Types:**

- `PriceChanges` - Price of (instrument) rises / falls
- `InstrumentBoughtSold` - (instrument) bought / sold

## Rule nodes

**Max Connections:**

- Incoming (target): **1** connection per handle, requires **0** valid incoming
- Outgoing (source): **1** connection per handle, requires **1** valid outgoing

**Allowed Connections:**

- Incoming from: `FlowIf`
- Outgoing to: `Connector`, `FlowThenElse`

**Types:**

- `PriceOverUnder` - Price over / under (value)
- `HappensBetween` - Event occurs between (date) and (date)
- `HappensWithin` - Event happens within (number) consecutive days

## Action nodes

**Max Connections:**

- Incoming (target): **1** connection per handle, requires **1** valid incoming
- Outgoing (source): **No** outgoing connections allowed, requires **0** valid outgoing

**Allowed Connections:**

- Incoming from: `FlowThen`, `FlowThenElse`
- Outgoing to: None

**Types:**

- `BuySellAmount` - [Buy / sell] (amount) of (instrument)
- `BuySellPrice` - [Buy / sell] (instrument) for $(price)
- `BuySellPercent` - [Buy / sell] (percent) of owned (instrument) stock
- `SendNotification` - Send [email / push] notification

# Valid Flow Patterns

1. Simple Action Flow:

   ```
   Trigger -> FlowThen -> Action
   ```

2. Basic Conditional Flow:

   ```
   Trigger -> FlowIf -> Rule -> FlowThen -> Action
   ```

3. Basic Conditional Flow with Else:

   ```
   Trigger -> FlowIf -> Rule -> FlowThenElse ->(then path)-> Action, (else part)-> Another Action
   ```

4. Connected Rules Flow:

   ```
   Trigger -> FlowIf -> Rule, Rule -> Connector -> FlowThen -> Action
   ```

5. Nested Conditional Flow:

   ```
   Trigger -> FlowIf -> Rule -> FlowThenElse ->(then part)-> Action, (else part)-> FlowIf -> Rule -> FlowThenElse ->(then part)-> Different Action (else part can be null)
   ```

6. Multiple Actions Flow:
   ```
   Trigger -> FlowThen -> Action, Another Action, Yet Another Action
   ```

7. Negation Flow: (At the moment no NOT node):
    ```
    Trigger -> FlowIf -> Rule -> FlowThenElse ->(else part)-> Action
    ```
