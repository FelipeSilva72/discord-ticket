import { formatEmoji } from "discord.js";
import fs from "node:fs/promises";

type EmojiList = typeof import("#emojis");

type IconKey = keyof EmojiList["animated"] | keyof EmojiList["static"];
interface IconInfo {
  id: string;
  animated?: boolean;
  toString(): string;
  toJSON(): object;
}
type Icon = Record<IconKey, IconInfo>;

const filepath = process.env.ENV === "dev" ? "emojis.dev.json" : "emojis.json";
const file = await fs.readFile(filepath, "utf-8");
const emojis: EmojiList = JSON.parse(file);

type ExtractedId =
  | { id: string; type: "id" | "emoji" | "url" }
  | { id: null; type: "null" };

function extractId(input: string): ExtractedId {
  if (!input) return { id: null, type: "null" };

  if (/^\d+$/.test(input)) {
    return { id: input, type: "id" };
  }

  const urlRegex = /\/emojis\/(\d+)\.\w+$/;
  const urlMatch = input.match(urlRegex);
  if (urlMatch) {
    return { id: urlMatch[1], type: "url" };
  }

  const emojiRegex = /\p{Emoji}/u;
  if (emojiRegex.test(input)) {
    return { id: input, type: "emoji" };
  }

  return { id: null, type: "null" };
}

function transform(emojis: Record<string, string>, animated: boolean = false) {
  return Object.entries(emojis).reduce((obj, [name, value]) => {
    const { id, type } = extractId(value);
    const data = { animated, id };
    return {
      ...obj,
      [name]: {
        ...data,
        toString: () =>
          type === "null"
            ? ""
            : type === "emoji"
            ? id
            : formatEmoji(id, animated),
        toJSON: () =>
          type === "null"
            ? undefined
            : type === "emoji"
            ? { name: id, animated, id: undefined }
            : data,
      },
    };
  }, {} as Icon);
}

export const icon: Icon = {
  ...transform(emojis.static),
  ...transform(emojis.animated, true),
};
