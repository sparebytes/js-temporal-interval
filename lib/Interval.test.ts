// @ts-nocheck

import { Temporal as T } from "@js-temporal/polyfill";
import { setTemporalPolyfill } from "./temporalPolyfill";
setTemporalPolyfill(T);
import Interval from "./Interval";

describe("Type Validation", () => {
  const jsDate = new Date();
  const zonedDateTime = T.ZonedDateTime.from("2012-01-01[utc]");
  const instant = T.Instant.from("2012-01-01Z");
  const plainDateTime = T.PlainDateTime.from("2012-01-01");
  const plainDate = T.PlainDate.from("2012-01-01");
  const plainYearMonth = T.PlainYearMonth.from("2012-01");

  it("start must be not be null or undefined", () => {
    expect(() => new Interval(null, instant)).toThrow();
    expect(() => new Interval(undefined, instant)).toThrow();
  });
  it("end must be not be null or undefined", () => {
    expect(() => new Interval(instant, null)).toThrow();
    expect(() => new Interval(instant, undefined)).toThrow();
  });
  it("start must be allowed type", () => {
    expect(() => new Interval(jsDate, jsDate)).toThrow();
  });
  it("start and end type must be the same", () => {
    expect(() => new Interval(zonedDateTime, instant)).toThrow();
    expect(() => new Interval(plainDateTime, instant)).toThrow();
    expect(() => new Interval(plainDate, instant)).toThrow();
    expect(() => new Interval(plainYearMonth, instant)).toThrow();
    expect(() => new Interval(plainDateTime, instant)).toThrow();
    expect(() => new Interval(instant, zonedDateTime)).toThrow();
    expect(() => new Interval(instant, plainDateTime)).toThrow();
    expect(() => new Interval(instant, plainDate)).toThrow();
    expect(() => new Interval(instant, plainYearMonth)).toThrow();
    expect(() => new Interval(instant, plainDateTime)).toThrow();
  });
});

describe("ZonedDateTime", () => {
  testIntervals({
    pointA: T.ZonedDateTime.from("2012-01-01[utc]"),
    pointB: T.ZonedDateTime.from("2018-01-01[utc]"),
    iOuter: new Interval(
      T.ZonedDateTime.from("1990-01-01[utc]"),
      T.ZonedDateTime.from("2040-01-01[utc]"),
    ),
    iLeft: new Interval(
      T.ZonedDateTime.from("2000-01-01[utc]"),
      T.ZonedDateTime.from("2010-01-01[utc]"),
    ),
    iLeftAdjacent: new Interval(
      T.ZonedDateTime.from("2010-01-01[utc]"),
      T.ZonedDateTime.from("2020-01-01[utc]"),
    ),
    iCenter: new Interval(
      T.ZonedDateTime.from("2005-01-01[utc]"),
      T.ZonedDateTime.from("2025-01-01[utc]"),
    ),
    iRight: new Interval(
      T.ZonedDateTime.from("2020-01-01[utc]"),
      T.ZonedDateTime.from("2030-01-01[utc]"),
    ),
    iCenterDuration: "P20Y",
    iterate: {
      disallowedDuration: null,
      allowedDuration: "PT1H",
      interval: new Interval(
        T.ZonedDateTime.from("2000-01-01T01:00:00[utc]"),
        T.ZonedDateTime.from("2000-01-01T06:00:00[utc]"),
      ),
      expected: [
        T.ZonedDateTime.from("2000-01-01T01:00:00[utc]"),
        T.ZonedDateTime.from("2000-01-01T02:00:00[utc]"),
        T.ZonedDateTime.from("2000-01-01T03:00:00[utc]"),
        T.ZonedDateTime.from("2000-01-01T04:00:00[utc]"),
        T.ZonedDateTime.from("2000-01-01T05:00:00[utc]"),
      ],
    },
    toString: "2005-01-01T00:00:00+00:00[UTC]--2025-01-01T00:00:00+00:00[UTC]",
    jsonStringify:
      '{"start":"2005-01-01T00:00:00+00:00[UTC]","end":"2025-01-01T00:00:00+00:00[UTC]"}',
  });
});

describe("Instant", () => {
  testIntervals({
    pointA: T.Instant.from("2012-01-01Z"),
    pointB: T.Instant.from("2018-01-01Z"),
    iOuter: new Interval(T.Instant.from("1990-01-01Z"), T.Instant.from("2040-01-01Z")),
    iLeft: new Interval(T.Instant.from("2000-01-01Z"), T.Instant.from("2010-01-01Z")),
    iLeftAdjacent: new Interval(T.Instant.from("2010-01-01Z"), T.Instant.from("2020-01-01Z")),
    iCenter: new Interval(T.Instant.from("2005-01-01Z"), T.Instant.from("2025-01-01Z")),
    iRight: new Interval(T.Instant.from("2020-01-01Z"), T.Instant.from("2030-01-01Z")),
    iCenterDuration: "P20Y",
    iterate: {
      disallowedDuration: null,
      allowedDuration: "PT1H",
      interval: new Interval(
        T.Instant.from("2000-01-01T01:00:00Z"),
        T.Instant.from("2000-01-01T06:00:00Z"),
      ),
      expected: [
        T.Instant.from("2000-01-01T01:00:00Z"),
        T.Instant.from("2000-01-01T02:00:00Z"),
        T.Instant.from("2000-01-01T03:00:00Z"),
        T.Instant.from("2000-01-01T04:00:00Z"),
        T.Instant.from("2000-01-01T05:00:00Z"),
      ],
    },
    toString: "2005-01-01T00:00:00Z--2025-01-01T00:00:00Z",
    jsonStringify: '{"start":"2005-01-01T00:00:00Z","end":"2025-01-01T00:00:00Z"}',
  });
});

describe("PlainDateTime", () => {
  testIntervals({
    pointA: T.PlainDateTime.from("2012-01-01"),
    pointB: T.PlainDateTime.from("2018-01-01"),
    iOuter: new Interval(T.PlainDateTime.from("1990-01-01"), T.PlainDateTime.from("2040-01-01")),
    iLeft: new Interval(T.PlainDateTime.from("2000-01-01"), T.PlainDateTime.from("2010-01-01")),
    iLeftAdjacent: new Interval(
      T.PlainDateTime.from("2010-01-01"),
      T.PlainDateTime.from("2020-01-01"),
    ),
    iCenter: new Interval(T.PlainDateTime.from("2005-01-01"), T.PlainDateTime.from("2025-01-01")),
    iRight: new Interval(T.PlainDateTime.from("2020-01-01"), T.PlainDateTime.from("2030-01-01")),
    iCenterDuration: "P20Y",
    iterate: {
      disallowedDuration: null,
      allowedDuration: "P1D",
      interval: new Interval(
        T.PlainDateTime.from("2000-01-01"),
        T.PlainDateTime.from("2000-01-06"),
      ),
      expected: [
        T.PlainDateTime.from("2000-01-01"),
        T.PlainDateTime.from("2000-01-02"),
        T.PlainDateTime.from("2000-01-03"),
        T.PlainDateTime.from("2000-01-04"),
        T.PlainDateTime.from("2000-01-05"),
      ],
    },
    toString: "2005-01-01T00:00:00--2025-01-01T00:00:00",
    jsonStringify: '{"start":"2005-01-01T00:00:00","end":"2025-01-01T00:00:00"}',
  });
});

describe("PlainDate", () => {
  testIntervals({
    pointA: T.PlainDate.from("2012-01-01"),
    pointB: T.PlainDate.from("2018-01-01"),
    iOuter: new Interval(T.PlainDate.from("1990-01-01"), T.PlainDate.from("2040-01-01")),
    iLeft: new Interval(T.PlainDate.from("2000-01-01"), T.PlainDate.from("2010-01-01")),
    iLeftAdjacent: new Interval(T.PlainDate.from("2010-01-01"), T.PlainDate.from("2020-01-01")),
    iCenter: new Interval(T.PlainDate.from("2005-01-01"), T.PlainDate.from("2025-01-01")),
    iRight: new Interval(T.PlainDate.from("2020-01-01"), T.PlainDate.from("2030-01-01")),
    iCenterDuration: "P20Y",
    iterate: {
      disallowedDuration: "PT1H",
      allowedDuration: "P1D",
      interval: new Interval(T.PlainDate.from("2000-01-01"), T.PlainDate.from("2000-01-06")),
      expected: [
        T.PlainDate.from("2000-01-01"),
        T.PlainDate.from("2000-01-02"),
        T.PlainDate.from("2000-01-03"),
        T.PlainDate.from("2000-01-04"),
        T.PlainDate.from("2000-01-05"),
      ],
    },
    toString: "2005-01-01--2025-01-01",
    jsonStringify: '{"start":"2005-01-01","end":"2025-01-01"}',
  });
});

describe("PlainYearMonth", () => {
  testIntervals({
    pointA: T.PlainYearMonth.from("2012-01-01"),
    pointB: T.PlainYearMonth.from("2018-01-01"),
    iOuter: new Interval(T.PlainYearMonth.from("1990-01-01"), T.PlainYearMonth.from("2040-01-01")),
    iLeft: new Interval(T.PlainYearMonth.from("2000-01-01"), T.PlainYearMonth.from("2010-01-01")),
    iLeftAdjacent: new Interval(
      T.PlainYearMonth.from("2010-01-01"),
      T.PlainYearMonth.from("2020-01-01"),
    ),
    iCenter: new Interval(T.PlainYearMonth.from("2005-01-01"), T.PlainYearMonth.from("2025-01-01")),
    iRight: new Interval(T.PlainYearMonth.from("2020-01-01"), T.PlainYearMonth.from("2030-01-01")),
    iCenterDuration: "P20Y",
    iterate: {
      disallowedDuration: "P1D",
      allowedDuration: "P1M",
      interval: new Interval(T.PlainYearMonth.from("2000-01"), T.PlainYearMonth.from("2000-06")),
      expected: [
        T.PlainYearMonth.from("2000-01"),
        T.PlainYearMonth.from("2000-02"),
        T.PlainYearMonth.from("2000-03"),
        T.PlainYearMonth.from("2000-04"),
        T.PlainYearMonth.from("2000-05"),
      ],
    },
    toString: "2005-01--2025-01",
    jsonStringify: '{"start":"2005-01","end":"2025-01"}',
  });
});

function testIntervals({
  pointA,
  pointB,
  iOuter,
  iLeft,
  iLeftAdjacent,
  iCenter,
  iRight,
  iCenterDuration,
  iterate,
  toString,
  jsonStringify,
}) {
  it("start cannot be greater than end", () => {
    expect(() => new Interval(pointB, pointA)).toThrow();
  });

  describe("Contains", () => {
    it("point is before interval", () => {
      expect(iRight.contains(pointA)).toBe(false);
    });
    it("point is inside interval", () => {
      expect(iCenter.contains(pointB)).toBe(true);
    });
    it("point is after interval", () => {
      expect(iLeft.contains(pointB)).toBe(false);
    });
  });

  describe("Equals", () => {
    it("a and b equal", () => {
      expect(iCenter.equals(iCenter)).toBe(true);
    });
    it("a and b do not equal", () => {
      expect(iLeft.equals(iRight)).toBe(false);
    });
  });

  describe("Encloses", () => {
    it("a and b do not overlap", () => {
      expect(iLeft.encloses(iRight)).toBe(false);
    });
    it("a and b partially overlap", () => {
      expect(iLeft.encloses(iCenter)).toBe(false);
      expect(iCenter.encloses(iLeft)).toBe(false);
    });
    it("a encloses b", () => {
      expect(iOuter.encloses(iCenter)).toBe(true);
    });
    it("b encloses a", () => {
      expect(iCenter.encloses(iOuter)).toBe(false);
    });
    it("b starts when a ends", () => {
      expect(iLeft.encloses(iLeftAdjacent)).toBe(false);
    });
  });

  describe("Overlaps", () => {
    it("a and b do not overlap", () => {
      expect(iLeft.overlaps(iRight)).toBe(false);
    });
    it("a and b partially overlap", () => {
      expect(iLeft.overlaps(iCenter)).toBe(true);
      expect(iCenter.overlaps(iLeft)).toBe(true);
    });
    it("a encloses b", () => {
      expect(iOuter.overlaps(iCenter)).toBe(true);
    });
    it("b encloses a", () => {
      expect(iCenter.overlaps(iOuter)).toBe(true);
    });
    it("b starts when a ends", () => {
      // TODO: test for inclusivity
      expect(iLeft.overlaps(iLeftAdjacent)).toBe(false);
    });
  });

  describe("Iterate", () => {
    const { disallowedDuration, allowedDuration, interval, expected } = iterate;

    it("iterate", () => {
      const actual = Array.from(interval.iterate(allowedDuration));
      expect(actual.length).toBe(expected.length);
      for (let i = 0; i < actual.length; i++) {
        expect(actual[i].toString()).toBe(expected[i].toString());
      }
    });
    it("iterate should throw with zero or negative duration", () => {
      expect(() => Array.from(interval.iterate(new Temporal.Duration({ days: -1 })))).toThrow();
      expect(() => Array.from(interval.iterate(new Temporal.Duration()))).toThrow();
    });
    if (disallowedDuration) {
      it("iterate should throw with disallowed duration", () => {
        expect(() => Array.from(interval.iterate(disallowedDuration))).toThrow();
      });
    }
  });

  describe("Duration", () => {
    it("toDuration", () => {
      console.log(iCenter.toDuration().toString(), iCenterDuration.toString());
      expect(
        T.Duration.compare(iCenter.toDuration(), iCenterDuration, {
          relativeTo: T.ZonedDateTime.from("2020-01-01[utc]"),
        }),
      ).toBe(0);
    });
  });

  describe("Encoding", () => {
    it("toString", () => {
      expect(iCenter.toString()).toBe(toString);
    });
    it("JSON.stringify", () => {
      expect(JSON.stringify(iCenter)).toBe(jsonStringify);
    });
  });
}
