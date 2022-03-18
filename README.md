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
  Temporal.PlainDateTime.from("1990-01-01"),
  Temporal.PlainDateTime.from("2040-01-01"),
);

// Instant Interval
const instantInterval = new Interval(
  Temporal.Instant.from("1990-01-01Z"),
  Temporal.Instant.from("2040-01-01Z"),
);

instantInterval.contains(instant);
instantInterval.equals(other);
instantInterval.encloses(other);
instantInterval.intersects(other);
instantInterval.toDuration(Temporal.Duration.from("PT1H"));
Array.from(instantInterval.iterate(Temporal.Duration.from("PT1H")));
```
