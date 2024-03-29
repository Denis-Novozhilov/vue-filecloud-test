export const ejectName = (fileName = 'default.file') => fileName.split(".").slice(0, -1).join('.');
