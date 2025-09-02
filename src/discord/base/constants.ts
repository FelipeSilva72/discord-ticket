import constantsJson from "../../../constants.json";

declare global {
  const constants: typeof constantsJson;
}
Object.assign(
  globalThis,
  Object.freeze({
    constants: constantsJson,
  })
);
