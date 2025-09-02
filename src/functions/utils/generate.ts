import { randomNumber } from "@magicyan/discord";

export function generateId() {
  const id = randomNumber(1000, 9999);
  return id.toString();
}
