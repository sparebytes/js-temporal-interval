import type { Temporal } from "@js-temporal/polyfill";
type Instant = Temporal.Instant;
type PlainDateTime = Temporal.PlainDateTime;
type ZonedDateTime = Temporal.ZonedDateTime;
type Duration = Temporal.Duration;
type PlainDate = Temporal.PlainDate;
type PlainYearMonth = Temporal.PlainYearMonth;
type TypeOfTemporal = ReturnType<typeof getTemporalPolyfill>;

import { getTemporalPolyfill } from "./temporalPolyfill";

export default class Interval<
  T extends ZonedDateTime | Instant | PlainDateTime | PlainDate | PlainYearMonth,
> {
  private readonly _type: T extends ZonedDateTime
    ? TypeOfTemporal["ZonedDateTime"]
    : T extends Instant
    ? TypeOfTemporal["Instant"]
    : T extends PlainDateTime
    ? TypeOfTemporal["PlainDateTime"]
    : T extends PlainDate
    ? TypeOfTemporal["PlainDate"]
    : T extends PlainYearMonth
    ? TypeOfTemporal["PlainYearMonth"]
    : never;
  private readonly _compare: (a: T, b: T) => Temporal.ComparisonResult;
  readonly start: T;
  readonly end: T;

  constructor(start: T, end: T | Duration) {
    const Temporal = getTemporalPolyfill();
    if (start == null) {
      throw new Error("start cannot be null");
    }
    if (end == null) {
      throw new Error("end cannot be null");
    }

    Object.defineProperty(this, "_type", {
      configurable: false,
      writable: false,
      enumerable: false,
      value: Object.getPrototypeOf(start).constructor,
    });

    if (
      this._type !== Temporal.ZonedDateTime &&
      this._type !== Temporal.Instant &&
      this._type !== Temporal.PlainDateTime &&
      this._type !== Temporal.PlainDate &&
      this._type !== Temporal.PlainYearMonth
    ) {
      throw new TypeError(`start is not of type Temporal.Instant or Temporal.PlainDateTime.`);
    }

    Object.defineProperty(this, "_compare", {
      configurable: false,
      writable: false,
      enumerable: false,
      value: this._type.compare as any,
    });

    Object.defineProperty(this, "start", {
      configurable: false,
      writable: false,
      enumerable: true,
      value: start,
    });

    if (end instanceof getTemporalPolyfill().Duration) {
      end = start.add(end) as T;
    } else if (!(end instanceof this._type)) {
      throw new TypeError(
        `start (${this._type.name}) is not from the same type as end (${
          Object.getPrototypeOf(this.end)?.constructor?.name
        }).`,
      );
    }

    Object.defineProperty(this, "end", {
      configurable: false,
      writable: false,
      enumerable: true,
      value: end,
    });

    if (this._type.compare(this.start as any, this.end as any) > 0) {
      throw new RangeError(`start may not be greater than end.`);
    }
  }

  /**
   * Does this interval contain point b?
   * Assumes start is inclusive and end is exclusive
   */
  contains(b: T): boolean {
    const { _compare } = this;
    return _compare(this.start, b) <= 0 && _compare(this.end, b) > 0;
  }

  /**
   * Is this interval the same as another?
   */
  equals(other: Interval<T>): boolean {
    const { _compare } = this;
    return _compare(this.start, other.start) === 0 && _compare(this.end, other.end) === 0;
  }

  /**
   * Does this interval fully wrap another?
   * Assumes start is inclusive and end is exclusive
   */
  encloses(b: Interval<T>): boolean {
    const { _compare } = this;
    return _compare(this.start, b.start) <= 0 && _compare(this.end, b.end) > 0;
  }

  /**
   * Does this interval overlap another?
   * Assumes start is inclusive and end is exclusive
   */
  overlaps(b: Interval<T>): boolean {
    const { _compare } = this;
    const aS_bS = _compare(this.start, b.start);
    const aS_bE = _compare(this.start, b.end);
    const aE_bS = _compare(this.end, b.start);
    const aE_bE = _compare(this.end, b.end);
    return (aS_bS >= 0 && aS_bE < 0) || (aE_bS > 0 && aE_bE <= 0) || (aS_bS <= 0 && aE_bE >= 0);
  }

  /**
   * Generate a sequence of evenly spaced points.
   * The end is exclusive by default
   * The duration must be positive.
   * Warning: using durations with units more precise than the interval type
   *          may result in an error or undefined behavior.
   */
  *iterate(
    duration: Temporal.DurationLike,
    options?: {
      endInclusive: boolean;
    },
  ): Generator<T, void, unknown> {
    const _duration = getTemporalPolyfill().Duration.from(duration);
    // TODO: print warning when duration units are more precise than this interval
    const { _compare, end: _end } = this;
    let value: T = this.start;
    const isContained =
      options?.endInclusive === true
        ? () => _compare(_end, value) >= 0
        : () => _compare(_end, value) > 0;
    while (isContained()) {
      const nextValue = value.add(_duration) as T;
      if (_compare(nextValue, value) <= 0) {
        throw new RangeError("duration is not large enough");
      }
      yield value;
      value = nextValue;
    }
  }

  /**
   * What is the duration between the start and end?
   */
  toDuration(options?: Parameters<T["since"]>[1]): Duration {
    return this.end.since(this.start as any, options as any);
  }

  toString() {
    return `${this.start.toString()}--${this.end.toString()}`;
  }
}
