// @ts-nocheck

import { Temporal as T } from "@js-temporal/polyfill";
import { setTemporalPolyfill } from "./temporalPolyfill";
setTemporalPolyfill(T);
import Interval from "./Interval";

describe("Validation", () => {
  const jsDate = new Date();
  const instantA = T.Instant.from("2012-01-01Z");
  const instantB = T.Instant.from("2018-01-01Z");
  const plainDateTimeA = T.PlainDateTime.from("2012-01-01");
  const plainDateTimeB = T.PlainDateTime.from("2018-01-01");

  it("start type must be Instant or DateTimePlain", () => {
    expect(() => new Interval(jsDate, instantB)).toThrow();
    expect(() => new Interval(null, instantB)).toThrow();
    expect(() => new Interval(undefined, instantB)).toThrow();
  });
  it("end type must be as start type", () => {
    expect(() => new Interval(instantA, plainDateTimeB)).toThrow();
    expect(() => new Interval(plainDateTimeA, instantB)).toThrow();
    expect(() => new Interval(instantA, jsDate)).toThrow();
    expect(() => new Interval(instantA, null)).toThrow();
    expect(() => new Interval(instantA, undefined)).toThrow();
  });
  it("start cannot be greater than end", () => {
    expect(() => new Interval(instantB, instantA)).toThrow();
    expect(() => new Interval(plainDateTimeB, plainDateTimeA)).toThrow();
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
    it("a and b do not intersect", () => {
      expect(iLeft.encloses(iRight)).toBe(false);
    });
    it("a and b partially intersect", () => {
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

  describe("Intersects", () => {
    it("a and b do not intersect", () => {
      expect(iLeft.intersects(iRight)).toBe(false);
    });
    it("a and b partially intersect", () => {
      expect(iLeft.intersects(iCenter)).toBe(true);
      expect(iCenter.intersects(iLeft)).toBe(true);
    });
    it("a encloses b", () => {
      expect(iOuter.intersects(iCenter)).toBe(true);
    });
    it("b encloses a", () => {
      expect(iCenter.intersects(iOuter)).toBe(true);
    });
    it("b starts when a ends", () => {
      // TODO: test for inclusivity
      expect(iLeft.intersects(iLeftAdjacent)).toBe(false);
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
    it("a and b do not intersect", () => {
      expect(iLeft.encloses(iRight)).toBe(false);
    });
    it("a and b partially intersect", () => {
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

  describe("Intersects", () => {
    it("a and b do not intersect", () => {
      expect(iLeft.intersects(iRight)).toBe(false);
    });
    it("a and b partially intersect", () => {
      expect(iLeft.intersects(iCenter)).toBe(true);
      expect(iCenter.intersects(iLeft)).toBe(true);
    });
    it("a encloses b", () => {
      expect(iOuter.intersects(iCenter)).toBe(true);
    });
    it("b encloses a", () => {
      expect(iCenter.intersects(iOuter)).toBe(true);
    });
    it("b starts when a ends", () => {
      // TODO: test for inclusivity
      expect(iLeft.intersects(iLeftAdjacent)).toBe(false);
    });
  });
});
