import { Commands } from "../types";

export const commandsData = {
    start: [
        {
            name: "Apps",
            type: "go",
            to: "apps"
        },
        {
            name: "Screen",
            type: "go",
            to: "screen"
        },
        {
            name: "Media",
            type: "go",
            to: "media"
        },
        {
            name: "Web",
            type: "go",
            to: "web"
        }
    ],

    // lvl 1
    apps: [
        {
            name: "Back",
            type: "go",
            to: "start"
        },
        {
            name: "Konsole",
            type: "execute",
            command: "konsole"
        },
        {
            name: "Back",
            type: "go",
            to: "start"
        },
        {
            name: "Back",
            type: "go",
            to: "start"
        },
    ],
    media: [
        {
            name: "Back",
            type: "go",
            to: "start"
        },
        {
            name: "Next",
            type: "pre",
            url: "media/next"
        },
        {
            name: "Play/Pause",
            type: "pre",
            url: "media/play-pause"
        },
        {
            name: "Prev",
            type: "pre",
            url: "media/prev"
        }
    ],
    screen: [
        {
            name: "Back",
            type: "go",
            to: "start"
        },
        {
            name: "Next",
            type: "pre",
            url: "screen/next"
        },
        {
            name: "Fullscreen",
            type: "execute",
            command: "spectacle -r"
        },
        {
            name: "Prev",
            type: "pre",
            url: "screen/prev"
        }
    ],
    web: [
        {
            name: "Back",
            type: "go",
            to: "start"
        },
        {
            name: "GitHub",
            type: "openUrl",
            url: "https://github.com/"
        },
        {
            name: "Perplexity",
            type: "openUrl",
            url: "https://perplexity.ai/"
        },
        {
            name: "Back",
            type: "go",
            to: "start"
        },
    ],
} as const satisfies Record<string, Commands>;

export const commands: Record<keyof typeof commandsData, typeof commandsData[keyof typeof commandsData]> = commandsData;
