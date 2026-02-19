import { note } from "./note";
import { MenuState } from "./types";

const invert = process.env.INVERT_MENU === "true";

export function renderMenu(menu: MenuState) {
    const [top, right, bottom, left] = menu.data.map((cmd) => cmd.name);

    function leftSpace(data: string) {
        const dataLen = Math.floor(data.length / 2);
        const menuLen = Math.floor(menu.name.length / 2);
        const len = Math.max(0, left.length - dataLen) + menuLen + 3;
        return " ".repeat(Math.max(0, len)) + data;
    }

    const string = `
    ${leftSpace(invert ? top : bottom)}
    ${leftSpace("|")}
    ${left} < ${menu.name} > ${right}
    ${leftSpace("|")}
    ${leftSpace(invert ? bottom : top)}
`;
    console.log(string);
    note(string);
}
