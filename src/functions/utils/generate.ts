import { randomUUID } from "crypto";

export function generateTicketId() {
  const uuid = randomUUID();
  return uuid.split("-")[0];
}
