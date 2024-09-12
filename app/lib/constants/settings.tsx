import {
  BellDot,
  MonitorCog,
  PackageOpen,
  Pickaxe,
  Rocket,
} from "lucide-react";
import { z } from "zod";
import { SettingsTab } from "~/lib/providers/settings-provider";

export type Settings = z.infer<typeof settingsSchema> &
  Partial<Record<keyof z.infer<typeof settingsSchema>, unknown>>;

export const settingsTabs: {
  title: string;
  icon: JSX.Element;
  value: SettingsTab;
}[] = [
  {
    title: "Preferences",
    icon: <MonitorCog size={18} />,
    value: "preferences",
  },
  {
    title: "Launcher",
    icon: <Rocket size={16} />,
    value: "launcher",
  },
  {
    title: "Notifications",
    icon: <BellDot size={16} />,
    value: "notifications",
  },
  {
    title: "Advanced",
    icon: <Pickaxe size={16} />,
    value: "advanced",
  },
  {
    title: "Resources",
    icon: <PackageOpen size={16} />,
    value: "resources",
  },
];

export const settingsSchema = z.object({
  preferences: z.object({
    ram: z
      .number()
      .min(2048, { message: "We recommend you allocate a minimum of 2048 MB." })
      .default(4096),
    afterLaunch: z.string().default("hide"),
    resolution: z.object({
      width: z
        .preprocess(
          (val) =>
            val === "" ? "auto" : Number.isNaN(Number(val)) ? val : Number(val),
          z.union([
            z.literal("auto", {
              errorMap: () => ({
                message: 'Width must be a number or "auto".',
              }),
            }),
            z
              .number({ message: "Width must be a number." })
              .positive({ message: "Width must be a positive number." }),
          ]),
        )
        .default("auto"),
      height: z
        .preprocess(
          (val) =>
            val === "" ? "auto" : Number.isNaN(Number(val)) ? val : Number(val),
          z.union([
            z.literal("auto", {
              errorMap: () => ({
                message: 'Height must be a number or "auto".',
              }),
            }),
            z
              .number({ message: "Height must be a number." })
              .positive({ message: "Height must be a positive number." }),
          ]),
        )
        .default("auto"),
    }),
  }),
  launcher: z.object({
    language: z.string().default("en-us"),
    autoBoot: z.boolean().default(true),
    exitToDock: z.boolean().default(true),
  }),
  notifications: z.object({}),
  advanced: z.object({
    gameDirectory: z.string(),
    javaPath: z.string(),
    branch: z.string(),
    updatePreferences: z.string(),
    JVMArguments: z
      .string()
      .refine(
        (value) => value === "" || /^-[\w\d]+(\s+-[\w\d]+)*$/.test(value),
        {
          message: "Invalid JVM arguments format.",
        },
      ),
    hardwareAcceleration: z.boolean().default(true),
    reducedAnimations: z.boolean().default(false),
    displayTooltips: z.boolean().default(true),
  }),
});

export const initialSettings: Settings = {
  preferences: {
    ram: 4096,
    afterLaunch: "hide",
    resolution: {
      width: "auto",
      height: "auto",
    },
  },
  launcher: { language: "en-us", autoBoot: true, exitToDock: true },
  notifications: {},
  advanced: {
    gameDirectory: "",
    javaPath: "",
    branch: "master",
    updatePreferences: "normal",
    JVMArguments: "",
    hardwareAcceleration: true,
    reducedAnimations: false,
    displayTooltips: true,
  },
};
