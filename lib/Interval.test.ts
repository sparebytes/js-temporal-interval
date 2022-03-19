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
  const pointA = T.ZonedDateTime.from("2012-01-01[utc]");
  const pointB = T.ZonedDateTime.from("2018-01-01[utc]");
  const iOuter = new Interval(
    T.ZonedDateTime.from("1990-01-01[utc]"),
    T.ZonedDateTime.from("2040-01-01[utc]"),
  );
  const iLeft = new Interval(
    T.ZonedDateTime.from("2000-01-01[utc]"),
    T.ZonedDateTime.from("2010-01-01[utc]"),
  );
  const iLeftAdjacent = new Interval(
    T.ZonedDateTime.from("2010-01-01[utc]"),
    T.ZonedDateTime.from("2020-01-01[utc]"),
  );
  const iCenter = new Interval(
    T.ZonedDateTime.from("2005-01-01[utc]"),
    T.ZonedDateTime.from("2025-01-01[utc]"),
  );
  const iRight = new Interval(
    T.ZonedDateTime.from("2020-01-01[utc]"),
    T.ZonedDateTime.from("2030-01-01[utc]"),
  );

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

  describe("Duration", () => {
    it("toDuration", () => {
      expect(T.Duration.compare(iCenter.toDuration(), "P7305D")).toBe(0);
    });
  });

  describe("Iterate", () => {
    it("iterate", () => {
      const actual = Array.from(
        new Interval(
          T.ZonedDateTime.from("2000-01-01T01:00:00[utc]"),
          T.ZonedDateTime.from("2000-01-01T06:00:00[utc]"),
        ).iterate(T.Duration.from("PT1H")),
      );
      const expected = [
        T.ZonedDateTime.from("2000-01-01T01:00:00[utc]"),
        T.ZonedDateTime.from("2000-01-01T02:00:00[utc]"),
        T.ZonedDateTime.from("2000-01-01T03:00:00[utc]"),
        T.ZonedDateTime.from("2000-01-01T04:00:00[utc]"),
        T.ZonedDateTime.from("2000-01-01T05:00:00[utc]"),
      ];
      expect(actual.length).toBe(expected.length);
      for (let i = 0; i < actual.length; i++) {
        expect(actual[i].toString()).toBe(expected[i].toString());
      }
    });
  });

  describe("Encoding", () => {
    it("toString", () => {
      expect(iCenter.toString()).toBe(
        "2005-01-01T00:00:00+00:00[UTC]--2025-01-01T00:00:00+00:00[UTC]",
      );
    });
    it("JSON.stringify", () => {
      expect(JSON.stringify(iCenter)).toBe(
        '{"start":"2005-01-01T00:00:00+00:00[UTC]","end":"2025-01-01T00:00:00+00:00[UTC]"}',
      );
    });
  });
});

describe("Instant", () => {
  const pointA = T.Instant.from("2012-01-01Z");
  const pointB = T.Instant.from("2018-01-01Z");
  const iOuter = new Interval(T.Instant.from("1990-01-01Z"), T.Instant.from("2040-01-01Z"));
  const iLeft = new Interval(T.Instant.from("2000-01-01Z"), T.Instant.from("2010-01-01Z"));
  const iLeftAdjacent = new Interval(T.Instant.from("2010-01-01Z"), T.Instant.from("2020-01-01Z"));
  const iCenter = new Interval(T.Instant.from("2005-01-01Z"), T.Instant.from("2025-01-01Z"));
  const iRight = new Interval(T.Instant.from("2020-01-01Z"), T.Instant.from("2030-01-01Z"));

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

  describe("Duration", () => {
    it("toDuration", () => {
      expect(T.Duration.compare(iCenter.toDuration(), "P7305D")).toBe(0);
    });
  });

  describe("Iterate", () => {
    it("iterate", () => {
      const actual = Array.from(
        new Interval(
          T.Instant.from("2000-01-01T01:00:00Z"),
          T.Instant.from("2000-01-01T06:00:00Z"),
        ).iterate(T.Duration.from("PT1H")),
      );
      const expected = [
        T.Instant.from("2000-01-01T01:00:00Z"),
        T.Instant.from("2000-01-01T02:00:00Z"),
        T.Instant.from("2000-01-01T03:00:00Z"),
        T.Instant.from("2000-01-01T04:00:00Z"),
        T.Instant.from("2000-01-01T05:00:00Z"),
      ];
      expect(actual.length).toBe(expected.length);
      for (let i = 0; i < actual.length; i++) {
        expect(actual[i].toString()).toBe(expected[i].toString());
      }
    });
  });

  describe("Encoding", () => {
    it("toString", () => {
      expect(iCenter.toString()).toBe("2005-01-01T00:00:00Z--2025-01-01T00:00:00Z");
    });
    it("JSON.stringify", () => {
      expect(JSON.stringify(iCenter)).toBe(
        '{"start":"2005-01-01T00:00:00Z","end":"2025-01-01T00:00:00Z"}',
      );
    });
  });
});

describe("PlainDateTime", () => {
  const pointA = T.PlainDateTime.from("2012-01-01");
  const pointB = T.PlainDateTime.from("2018-01-01");
  const iOuter = new Interval(
    T.PlainDateTime.from("1990-01-01"),
    T.PlainDateTime.from("2040-01-01"),
  );
  const iLeft = new Interval(
    T.PlainDateTime.from("2000-01-01"),
    T.PlainDateTime.from("2010-01-01"),
  );
  const iLeftAdjacent = new Interval(
    T.PlainDateTime.from("2010-01-01"),
    T.PlainDateTime.from("2020-01-01"),
  );
  const iCenter = new Interval(
    T.PlainDateTime.from("2005-01-01"),
    T.PlainDateTime.from("2025-01-01"),
  );
  const iRight = new Interval(
    T.PlainDateTime.from("2020-01-01"),
    T.PlainDateTime.from("2030-01-01"),
  );

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

  describe("toDuration", () => {
    expect(T.Duration.compare(iCenter.toDuration(), "P7305D")).toBe(0);
  });

  describe("Iterate", () => {
    it("iterate", () => {
      const actual = Array.from(
        new Interval(
          T.PlainDateTime.from("2000-01-01"),
          T.PlainDateTime.from("2000-01-06"),
        ).iterate(T.Duration.from("P1D")),
      );
      const expected = [
        T.PlainDateTime.from("2000-01-01"),
        T.PlainDateTime.from("2000-01-02"),
        T.PlainDateTime.from("2000-01-03"),
        T.PlainDateTime.from("2000-01-04"),
        T.PlainDateTime.from("2000-01-05"),
      ];
      expect(actual.length).toBe(expected.length);
      for (let i = 0; i < actual.length; i++) {
        expect(actual[i].toString()).toBe(expected[i].toString());
      }
    });
  });

  describe("Encoding", () => {
    it("toString", () => {
      expect(iCenter.toString()).toBe("2005-01-01T00:00:00--2025-01-01T00:00:00");
    });
    it("JSON.stringify", () => {
      expect(JSON.stringify(iCenter)).toBe(
        '{"start":"2005-01-01T00:00:00","end":"2025-01-01T00:00:00"}',
      );
    });
  });
});

describe("Instant", () => {
  const pointA = T.Instant.from("2012-01-01Z");
  const pointB = T.Instant.from("2018-01-01Z");
  const iOuter = new Interval(T.Instant.from("1990-01-01Z"), T.Instant.from("2040-01-01Z"));
  const iLeft = new Interval(T.Instant.from("2000-01-01Z"), T.Instant.from("2010-01-01Z"));
  const iLeftAdjacent = new Interval(T.Instant.from("2010-01-01Z"), T.Instant.from("2020-01-01Z"));
  const iCenter = new Interval(T.Instant.from("2005-01-01Z"), T.Instant.from("2025-01-01Z"));
  const iRight = new Interval(T.Instant.from("2020-01-01Z"), T.Instant.from("2030-01-01Z"));

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

  describe("Duration", () => {
    it("toDuration", () => {
      expect(T.Duration.compare(iCenter.toDuration(), "P7305D")).toBe(0);
    });
  });

  describe("Iterate", () => {
    it("iterate", () => {
      const actual = Array.from(
        new Interval(
          T.Instant.from("2000-01-01T01:00:00Z"),
          T.Instant.from("2000-01-01T06:00:00Z"),
        ).iterate(T.Duration.from("PT1H")),
      );
      const expected = [
        T.Instant.from("2000-01-01T01:00:00Z"),
        T.Instant.from("2000-01-01T02:00:00Z"),
        T.Instant.from("2000-01-01T03:00:00Z"),
        T.Instant.from("2000-01-01T04:00:00Z"),
        T.Instant.from("2000-01-01T05:00:00Z"),
      ];
      expect(actual.length).toBe(expected.length);
      for (let i = 0; i < actual.length; i++) {
        expect(actual[i].toString()).toBe(expected[i].toString());
      }
    });
  });

  describe("Encoding", () => {
    it("toString", () => {
      expect(iCenter.toString()).toBe("2005-01-01T00:00:00Z--2025-01-01T00:00:00Z");
    });
    it("JSON.stringify", () => {
      expect(JSON.stringify(iCenter)).toBe(
        '{"start":"2005-01-01T00:00:00Z","end":"2025-01-01T00:00:00Z"}',
      );
    });
  });
});

describe("PlainDate", () => {
  const pointA = T.PlainDate.from("2012-01-01");
  const pointB = T.PlainDate.from("2018-01-01");
  const iOuter = new Interval(T.PlainDate.from("1990-01-01"), T.PlainDate.from("2040-01-01"));
  const iLeft = new Interval(T.PlainDate.from("2000-01-01"), T.PlainDate.from("2010-01-01"));
  const iLeftAdjacent = new Interval(
    T.PlainDate.from("2010-01-01"),
    T.PlainDate.from("2020-01-01"),
  );
  const iCenter = new Interval(T.PlainDate.from("2005-01-01"), T.PlainDate.from("2025-01-01"));
  const iRight = new Interval(T.PlainDate.from("2020-01-01"), T.PlainDate.from("2030-01-01"));

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

  describe("toDuration", () => {
    expect(T.Duration.compare(iCenter.toDuration(), "P7305D")).toBe(0);
  });

  describe("Iterate", () => {
    it("iterate", () => {
      const actual = Array.from(
        new Interval(T.PlainDate.from("2000-01-01"), T.PlainDate.from("2000-01-06")).iterate(
          T.Duration.from("P1D"),
        ),
      );
      const expected = [
        T.PlainDate.from("2000-01-01"),
        T.PlainDate.from("2000-01-02"),
        T.PlainDate.from("2000-01-03"),
        T.PlainDate.from("2000-01-04"),
        T.PlainDate.from("2000-01-05"),
      ];
      expect(actual.length).toBe(expected.length);
      for (let i = 0; i < actual.length; i++) {
        expect(actual[i].toString()).toBe(expected[i].toString());
      }
    });
  });

  describe("Encoding", () => {
    it("toString", () => {
      expect(iCenter.toString()).toBe("2005-01-01--2025-01-01");
    });
    it("JSON.stringify", () => {
      expect(JSON.stringify(iCenter)).toBe('{"start":"2005-01-01","end":"2025-01-01"}');
    });
  });
});
