import { describe, expect, it } from "vitest";
import { bestEnglishVoice } from "./speech";

function voice(name: string, lang: string) {
  return { name, lang, voiceURI: name };
}

describe("choosing the English voice", () => {
  it("prefers Google's British voice over old Windows voices in Chrome", () => {
    const voices = [voice("Microsoft Hazel - English (United Kingdom)", "en-GB"), voice("Google US English", "en-US"), voice("Google UK English Female", "en-GB")];
    expect(bestEnglishVoice(voices)?.name).toBe("Google UK English Female");
  });

  it("prefers natural voices in Edge", () => {
    const voices = [voice("Google UK English Female", "en-GB"), voice("Microsoft Sonia Online (Natural) - English (United Kingdom)", "en-GB")];
    expect(bestEnglishVoice(voices)?.name).toContain("Sonia");
  });

  it("prefers enhanced voices on iPhone", () => {
    const compact = { ...voice("Daniel", "en-GB"), voiceURI: "com.apple.voice.compact.en-GB.Daniel" };
    const enhanced = { ...voice("Daniel", "en-GB"), voiceURI: "com.apple.voice.enhanced.en-GB.Daniel" };
    const voices = [compact, enhanced];
    expect(bestEnglishVoice(voices)?.voiceURI).toContain("enhanced");
  });

  it("understands Android's underscore language codes", () => {
    const voices = [voice("English United States", "en_US"), voice("English United Kingdom", "en_GB")];
    expect(bestEnglishVoice(voices)?.name).toBe("English United Kingdom");
  });

  it("falls back to any English voice when no British voice exists", () => {
    expect(bestEnglishVoice([voice("Svenska", "sv-SE"), voice("Samantha", "en-US")])?.name).toBe("Samantha");
    expect(bestEnglishVoice([voice("Svenska", "sv-SE")])).toBeUndefined();
  });
});
