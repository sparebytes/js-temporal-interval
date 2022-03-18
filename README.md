# Temporal Interval

An Interval object represents a half-open interval of time, where each endpoint is an Instant or PlainDateTime.

See https://stackblitz.com/edit/temporal-interval

## Installation

```sh
yarn install @js-temporal/polyfill temporal-interval
```

## Usage

```ts
import { Temporal } from "@js-temporal/polyfill";

// run setTemporalPolyfill as early as possible
import Interval, { setTemporalPolyfill } from "temporal-interval";
setTemporalPolyfill(Temporal);

// PlainDateTime Interval
const plainDateTimeInterval = new Interval(
  Temporal.PlainDateTime.from("2000-01-01"),
  Temporal.PlainDateTime.from("2000-01-02"),
);

// Instant Interval
const interval = new Interval(
  Temporal.Instant.from("2000-01-01Z"),
  Temporal.Instant.from("2000-01-02Z"),
);

const other = new Interval(
  Temporal.Instant.from("2000-01-02Z"),
  Temporal.Instant.from("2000-01-03Z"),
);

const { log } = console;
log("      toString:", interval.toString());
log("JSON.stringify:", JSON.stringify(interval));
log("      contains:", interval.contains(Temporal.Instant.from("2000-01-01Z")));
log("        equals:", interval.equals(other));
log("      encloses:", interval.encloses(other));
log("    intersects:", interval.intersects(other));
log("    toDuration:", interval.toDuration(Temporal.Duration.from("PT1H")));
log("       iterate:", Array.from(interval.iterate(Temporal.Duration.from("PT1H"))));
```
