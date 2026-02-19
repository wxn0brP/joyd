export interface CommandBase {
    name: string;
    type: string;
}

export interface CommandPredefined extends CommandBase {
    type: "pre";
    url: string;
    body?: any;
}

export interface CommandOpenUrl extends CommandBase {
    type: "openUrl";
    url: string;
}

export interface CommandExecute extends CommandBase {
    type: "execute";
    command: string;
}

export interface CommandGo extends CommandBase {
    type: "go";
    to: string;
}

export type Command = CommandPredefined | CommandOpenUrl | CommandExecute | CommandGo;
export type Commands = readonly [Command, Command, Command, Command];

export interface MenuState {
    name: string;
    data: Commands;
}
