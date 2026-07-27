import { beforeEach, describe, expect, it } from "vitest";
import {
  clearAuthEmailDraft,
  readAuthEmailDraft,
  readServerAuthEmailDraft,
  saveAuthEmailDraft,
  subscribeAuthEmailDraft,
} from "@/lib/auth-email-draft";

beforeEach(() => {
  window.sessionStorage.clear();
});

describe("saveAuthEmailDraft", () => {
  it("trims and lowercases the email before storing it", () => {
    saveAuthEmailDraft("  Ada@Example.com  ");

    expect(window.sessionStorage.getItem("auth-starter:email-draft")).toBe(
      "ada@example.com",
    );
  });
});

describe("readAuthEmailDraft", () => {
  it("returns the stored draft", () => {
    saveAuthEmailDraft("ada@example.com");

    expect(readAuthEmailDraft()).toBe("ada@example.com");
  });

  it("returns an empty string when nothing is stored", () => {
    expect(readAuthEmailDraft()).toBe("");
  });
});

describe("clearAuthEmailDraft", () => {
  it("removes the stored draft", () => {
    saveAuthEmailDraft("ada@example.com");

    clearAuthEmailDraft();

    expect(readAuthEmailDraft()).toBe("");
  });
});

describe("readServerAuthEmailDraft", () => {
  it("always returns an empty string", () => {
    expect(readServerAuthEmailDraft()).toBe("");
  });
});

describe("subscribeAuthEmailDraft", () => {
  it("returns a no-op unsubscribe function", () => {
    const unsubscribe = subscribeAuthEmailDraft();

    expect(() => unsubscribe()).not.toThrow();
  });
});
