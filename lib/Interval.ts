import type { Temporal } from "@js-temporal/polyfill";

import { getTemporalPolyfill } from "./temporalPolyfill";

export default class Interval<T extends Temporal.Instant | Temporal.PlainDateTime> {
  private readonly _type: T extends Temporal.Instant
    ? typeof Temporal.Instant
    : T extends Temporal.PlainDateTime
    ? typeof Temporal.PlainDateTime
    : never;
  private readonly _compare: (a: T, b: T) => Temporal.ComparisonResult;
  private readonly _start: T;
  private readonly _end: T;

  constructor(start: T, end: T | Temporal.Duration) {
    this._type = Object.getPrototypeOf(start).constructor;
    if (
      this._type !== getTemporalPolyfill().Instant &&
      this._type !== getTemporalPolyfill().PlainDateTime
    ) {
      throw new TypeError(`start is not of type Temporal.Instant or Temporal.PlainDateTime.`);
    }
    this._compare = this._type.compare as any;
    this._start = start;
    if (end instanceof getTemporalPolyfill().Duration) {
      this._end = start.add(end) as T;
    } else if (end instanceof this._type) {
      this._end = end;
    } else {
      throw new TypeError(`start is not from the same type as end.`);
    }

    if (this._type.compare(this._start as any, this._end as any) > 0) {
      throw new RangeError(`start may not be greater than end.`);
    }
  }

  /**
   * Does this interval contain point b?
   * Assumes start is inclusive and end is exclusive
   */
  contains(b: T): boolean {
    const { _compare } = this;
    return _compare(this._start, b) <= 0 && _compare(this._end, b) > 0;
  }

  /**
   * Is this interval the same as another?
   */
  equals(b: Interval<T>): boolean {
    const { _compare } = this;
    return _compare(this._start, b._start) === 0 && _compare(this._end, b._end) === 0;
  }

  /**
   * Does this interval fully wrap another?
   * Assumes start is inclusive and end is exclusive
   */
  encloses(b: Interval<T>): boolean {
    const { _compare } = this;
    return _compare(this._start, b._start) <= 0 && _compare(this._end, b._end) > 0;
  }

  /**
   * Does this interval overlap another?
   * Assumes start is inclusive and end is exclusive
   */
  intersects(b: Interval<T>): boolean {
    const { _compare } = this;
    const aS_bS = _compare(this._start, b._start);
    const aS_bE = _compare(this._start, b._end);
    const aE_bS = _compare(this._end, b._start);
    const aE_bE = _compare(this._end, b._end);
    return (aS_bS >= 0 && aS_bE < 0) || (aE_bS > 0 && aE_bE <= 0) || (aS_bS <= 0 && aE_bE >= 0);
  }
  /**
   * What is the duration between the start and end?
   */
  toDuration(
    options?: T extends Temporal.Instant
      ? Temporal.DifferenceOptions<
          "hour" | "minute" | "second" | "millisecond" | "microsecond" | "nanosecond"
        >
      : T extends Temporal.PlainDateTime
      ? Temporal.DifferenceOptions<
          | "year"
          | "month"
          | "week"
          | "day"
          | "hour"
          | "minute"
          | "second"
          | "millisecond"
          | "microsecond"
          | "nanosecond"
        >
      : never,
  ): Temporal.Duration {
    return this._end.since(this._start as any, options as any);
  }

  /**
   * Generate a sequence of evenly spaced points.
   * The end is exclusive by default
   */
  *iterate(
    duration: Temporal.Duration,
    endInclusive: boolean = false,
  ): Generator<T, void, unknown> {
    if (duration.sign <= 0) {
      throw new RangeError("duration must be positive.");
    }
    const { _compare, _end } = this;
    let value: T = this._start;
    const isContained = endInclusive
      ? () => _compare(_end, value) >= 0
      : () => _compare(_end, value) > 0;
    while (isContained()) {
      yield value;
      value = value.add(duration) as T;
    }
  }
}
