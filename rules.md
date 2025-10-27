# Node types and Connection Rules

## Connector nodes

**Max Connections:**

- Incoming (target): **1** connection per handle, requires **1** valid incoming
- Outgoing (source): **1** connection per handle, requires **2** valid outgoing

**Allowed Connections:**

- Incoming from: `Flow`, `Connector`
- Outgoing to: `Rule`, `Connector`

**Types:**

- `And`
- `Or`

## Flow nodes

Each of the flow nodes has different validation rules, so they have been defined as separate supertypes

### IfThenElse node

**Max Connections:**

- Incoming (target): **1** connection per handle, requires **1** valid incoming
- Outgoing (source): **1 or inf** connection per handle, requires **2** valid outgoing

**Allowed Connections:**

- Incoming from: `Trigger`, `Flow`
- Outgoing to: `Rule, Connector, Flow, Action`

**Types:**

- `IfThenElse`

## Trigger nodes

**Max Connections:**

- Incoming (target): **No** incoming connections allowed, requires **0** valid incoming
- Outgoing (source): **inf** connection per handle, requires **1** valid outgoing

**Allowed Connections:**

- Incoming from: None
- Outgoing to: `Flow`, `Action`

**Types:**

- `PriceChanges` - Price of (instrument) rises / falls
- `InstrumentBoughtSold` - (instrument) bought / sold

## Rule nodes

**Max Connections:**

- Incoming (target): **1** connection per handle, requires **1** valid incoming
- Outgoing (source): **No** connection per handle, requires **0** valid outgoing

**Allowed Connections:**

- Incoming from: `Connector, Flow`
- Outgoing to: None

**Types:**

- `PriceOverUnder` - Price over / under (value)
- `HappensBetween` - Event occurs between (date) and (date)
- `HappensWithin` - Event happens within (number) consecutive days

## Action nodes

**Max Connections:**

- Incoming (target): **1** connection per handle, requires **1** valid incoming
- Outgoing (source): **No** outgoing connections allowed, requires **0** valid outgoing

**Allowed Connections:**

- Incoming from: `Flow`, `Trigger`
- Outgoing to: None

**Types:**

- `BuySellAmount` - [Buy / sell] (amount) of (instrument)
- `BuySellPrice` - [Buy / sell] (instrument) for $(price)
- `BuySellPercent` - [Buy / sell] (percent) of owned (instrument) stock
- `SendNotification` - Send [email / push] notification
