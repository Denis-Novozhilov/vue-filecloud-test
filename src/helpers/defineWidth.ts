import {ejectName} from "@src/helpers/ejectName.ts";

export const defineWidth = (name: string) => `width: ${ejectName(name).length * 17.5 + 8}px`

export const updateWidth = (event, { id }, _this) => {
    const value = event.target.value;
    const inputRef = _this.$refs[`fileName${id}`];
    inputRef[0].style.width = `${value.length * 17.5 + 8}px`;
}