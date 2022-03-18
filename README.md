# Temporal Interval

## Installation

```sh
yarn install @js-temporal/polyfill temporal-interval
```

## Usage

```ts
import { Temporal } from "@js-temporal/polyfill";

// run this as early as possible
import Interval, { setTemporalPolyfill } from "temporal-interval";
setTemporalPolyfill(Temporal);

// Instant Interval
const plainDateTimeInterval = new Interval(
  Temporal.PlainDateTime.from("1990-01-01"),
  Temporal.PlainDateTime.from("2040-01-01"),
);

// PlainDateTime Interval
const instantInterval = new Interval(
  Temporal.Instant.from("1990-01-01Z"),
  Temporal.Instant.from("2040-01-01Z"),
);
```
