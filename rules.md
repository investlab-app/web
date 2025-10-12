# Node types

## Connector nodes: - TWO incoming nodes of type Connector/Rule and ONE outcoming node of type Connector/Flow(then part)

- And
- Or

## Flow nodes: - ONE incoming node of type Trigger and INFINITE outcoming nodes of type Action (either from the THEN or ELSE handle). Between if and then/else all the relevant Rule nodes should be placed

- If - then/else - if node connects with then/else node

## Trigger nodes: - NO incoming nodes and ONE outcoming node of type Flow(if part)

- PriceChanges - Price of (instrument) (rises / falls)
- InstrumentSoldBought - (instrument) (bought / sold)

## Rule nodes: - ONE incoming node of type Flow(if part)/Connector and ONE outcoming node of type Connector/Flow(then part)

- PriceOverUnder - Price over / under (value)
- HappensBetween - Event occurs between (date) and (date)
- HappensWithin - Event happens within X consecutive days

## Action nodes: - ONE incoming node of type Flow(then part) and NO outcoming node

- BuySellAmount - Buys / sells (value) amount(volume) of (instrument)
- BuySellPercent - Buys / sells (percent) of owned (instrument)
- SendNotification - Send notif of type (push/email)

# Summary:

Trigger -> 1 -> Flow(IF) -> Rule and Connectors -> Flow(THEN) -> inf -> Action
