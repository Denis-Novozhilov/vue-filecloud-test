import {ejectExtension} from "@src/helpers/getExtension.ts";

export const formatExtension = (name: string) => `.${ejectExtension(name).toLowerCase()} `