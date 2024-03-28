const ICONS_EXTENSIONS: Record<string, string > = {
    DOCX: 'DOCX',
    MP4: 'MP4',
    PNG: 'PNG',
    XLS: 'XLS',
};
const DEFAULT_FILE_NAME = 'default.file';
const DEFAULT_EXTENSION = 'DEFAULT';

export const ejectExtension = (fileName = 'default.file') => fileName?.split(".").at(-1).toUpperCase();

export const getExtensionIconURL = (fileName: string = DEFAULT_FILE_NAME): string => {
    const currentExtension = ejectExtension(fileName);
    const res = ICONS_EXTENSIONS[currentExtension] || DEFAULT_EXTENSION;
    return `./src/assets/icons/${res}.svg`;
}