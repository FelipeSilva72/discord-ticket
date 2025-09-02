import {
  ComponentData,
  createContainer,
  isAttachment,
  withProperties,
} from "@magicyan/discord";
import { MessageFlags } from "discord.js";

type UnusedProps =
  | "content"
  | "embeds"
  | "components"
  | "ephemeral"
  | "fetchReply";

type ResFunction = <R>(...components: ComponentData[]) => R & {
  with<R>(options: Partial<Omit<R, UnusedProps>>): R;
};

type Res = Record<keyof typeof constants.colors, ResFunction>;

export const res: Res = Object.entries(constants.colors).reduce(
  (acc, [key, color]) => ({
    ...acc,
    [key]: function (...components: ComponentData[]) {
      const container = createContainer(color, components);
      const files = components.filter(isAttachment);
      const defaults = {
        files,
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        components: [container],
        content: null,
        embeds: [],
        withComponents: true,
      };
      const withFunc = (options: object) => {
        if ("flags" in options && Array.isArray(options.flags)) {
          options.flags = Array.from(
            new Set([MessageFlags.IsComponentsV2, ...options.flags])
          );
        }
        if ("files" in options && Array.isArray(options.files)) {
          options.files = [...files, ...options.files];
        }
        return { ...defaults, ...options };
      };
      return withProperties(defaults, { with: withFunc });
    },
  }),
  {} as Res
);
