# Temporal Interval

An Interval object represents a half-open interval of one of the following:

- ZonedDateTime
- Instant
- PlainDateTime
- PlainDate
- PlainYearMonth

See [Stack Blitz Example](https://stackblitz.com/edit/temporal-interval)

## Installation

```sh
npm install @js-temporal/polyfill temporal-interval
```

## Usage

```ts
import { Temporal } from "@js-temporal/polyfill";

// run setTemporalPolyfill as early as possible
import Interval, { setTemporalPolyfill } from "temporal-interval";
setTemporalPolyfill(Temporal);

// ZonedDateTime Interval
const zonedDateTimeInterval = new Interval(
  Temporal.ZonedDateTime.from("2000-01-01[utc]"),
  Temporal.ZonedDateTime.from("2000-01-02[utc]"),
);

// Instant Interval
const instantInterval = new Interval(
  Temporal.Instant.from("2000-01-01Z"),
  Temporal.Instant.from("2000-01-02Z"),
);

// PlainDateTime Interval
const plainDateTimeInterval = new Interval(
  Temporal.PlainDateTime.from("2000-01-01"),
  Temporal.PlainDateTime.from("2000-01-02"),
);

// PlainDate Interval
const plainDateInterval = new Interval(
  Temporal.PlainDate.from("2000-01-01"),
  Temporal.PlainDate.from("2000-01-02"),
);

// PlainYearMonth Interval
const plainYearMonthInterval = new Interval(
  Temporal.PlainYearMonth.from("2000-01-01"),
  Temporal.PlainYearMonth.from("2000-01-02"),
);

function example({ interval, point, other, duration }) {
  const { log } = console;
  log("         start:", interval.start);
  log("           end:", interval.end);
  log("    contains():", interval.contains(point));
  log("      equals():", interval.equals(other));
  log("    encloses():", interval.encloses(other));
  log("    overlaps():", interval.overlaps(other));
  log("intersection():", interval.intersection(other));
  log("       union():", interval.union(other));
  log("  toDuration():", interval.toDuration());
  log("     iterate():", Array.from(interval.iterate(duration)));
  log("    toString():", interval.toString());
  log("JSON.stringify:", JSON.stringify(interval));
}

example({
  interval: instantInterval,
  point: instantInterval.start,
  duration: Temporal.Duration.from("PT1H"),
  other: new Interval(Temporal.Instant.from("2000-01-02Z"), Temporal.Instant.from("2000-01-03Z")),
});
```
