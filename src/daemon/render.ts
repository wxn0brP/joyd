import { note } from "./note";
import { MenuState } from "./types";

export function renderMenu(menu: MenuState) {
    const [top, right, bottom, left] = menu.data.map((cmd) => cmd.name);

    function leftSpace(data: string) {
        const dataLen = Math.floor(data.length / 2);
        const menuLen = Math.floor(menu.name.length / 2);
        const len = Math.max(0, left.length - dataLen) + menuLen + 3;
        return " ".repeat(Math.max(0, len)) + data;
    }

    const string = `
    ${leftSpace(top)}
    ${leftSpace("|")}
    ${left} < ${menu.name} > ${right}
    ${leftSpace("|")}
    ${leftSpace(bottom)}
`;
    console.log(string);
    note(string);
}
