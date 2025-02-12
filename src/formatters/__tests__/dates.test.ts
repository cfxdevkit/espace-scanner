import { DateFormatter } from "../dates";

describe("DateFormatter", () => {
  describe("formatDate", () => {
    it("should format timestamp with default style", () => {
      expect(DateFormatter.formatDate(1707307200)).toBe("2024-02-07 12:00:00");
    });

    it("should format ISO date string with default style", () => {
      expect(DateFormatter.formatDate("2024-02-07T12:00:00Z")).toBe("2024-02-07 12:00:00");
    });

    it("should format timestamp with date style", () => {
      expect(DateFormatter.formatDate(1707307200, "date")).toBe("2024-02-07");
    });

    it("should format timestamp with unix style", () => {
      expect(DateFormatter.formatDate(1707307200, "unix")).toBe("1707307200");
    });

    it("should handle invalid timestamp", () => {
      expect(DateFormatter.formatDate("invalid", "full")).toBe("N/A");
      expect(DateFormatter.formatDate("not-a-date", "date")).toBe("N/A");
      expect(DateFormatter.formatDate("error", "unix")).toBe("N/A");
    });

    it("should handle error cases", () => {
      // @ts-ignore - Testing invalid input
      expect(DateFormatter.formatDate(null)).toBe("1970-01-01 00:00:00");
      // @ts-ignore - Testing invalid input
      expect(DateFormatter.formatDate(undefined)).toBe("N/A");
      expect(DateFormatter.formatDate(NaN)).toBe("N/A");
    });

    it("should handle different date components", () => {
      // Test single digit month and day
      expect(DateFormatter.formatDate("2024-01-05T02:03:04Z")).toBe("2024-01-05 02:03:04");
      // Test timezone conversion
      expect(DateFormatter.formatDate("2024-12-31T23:59:59Z")).toBe("2024-12-31 23:59:59");
    });
  });

  describe("formatTimestamp", () => {
    it("should format timestamp", () => {
      expect(DateFormatter.formatTimestamp(1707307200)).toBe("2024-02-07 12:00:00");
    });

    it("should format ISO date string", () => {
      expect(DateFormatter.formatTimestamp("2024-02-07T12:00:00Z")).toBe("2024-02-07 12:00:00");
    });

    it("should handle invalid timestamp", () => {
      expect(DateFormatter.formatTimestamp("invalid")).toBe("N/A");
    });
  });

  describe("getCurrentTimestamp", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2024-02-07T12:00:00Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return current timestamp", () => {
      expect(DateFormatter.getCurrentTimestamp()).toBe(1707307200);
    });
  });

  describe("get24HoursAgo", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2024-02-07T12:00:00Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return timestamp from 24 hours ago", () => {
      expect(DateFormatter.get24HoursAgo()).toBe(1707307200 - 24 * 60 * 60);
    });
  });

  describe("getTimeAgo", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2024-02-07T12:00:00Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return timestamp from specified days ago", () => {
      expect(DateFormatter.getTimeAgo(7)).toBe(1707307200 - 7 * 24 * 60 * 60);
    });

    it("should handle fractional days", () => {
      expect(DateFormatter.getTimeAgo(0.5)).toBe(1707307200 - 0.5 * 24 * 60 * 60);
    });

    it("should handle zero days", () => {
      expect(DateFormatter.getTimeAgo(0)).toBe(1707307200);
    });

    it("should handle negative days", () => {
      expect(DateFormatter.getTimeAgo(-1)).toBe(1707307200 + 24 * 60 * 60);
    });
  });
});
