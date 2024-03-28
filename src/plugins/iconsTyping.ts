// import { Plugin } from 'vite';
// import path, { resolve } from 'node:path';
// import { readdirSync, statSync, writeFileSync } from 'node:fs';
// import { fileURLToPath } from 'node:url';
//
// const currentDir = resolve(path.dirname(fileURLToPath(import.meta.url)));
//
// const iconsDir = resolve(currentDir, '../src/assets/icons');
// const typesFilePath = resolve(currentDir, '../src/types/icons.d.ts');
//
// const generateIconTypeDeclarations = (dir: string, prefix = ''): string => {
//     const files = readdirSync(dir);
//     let declarations = '';
//
//     for (const file of files) {
//         const filePath = resolve(dir, file);
//         const fileStat = statSync(filePath);
//
//         if (fileStat.isDirectory()) {
//             const subDir = resolve(dir, file);
//             const subPrefix = `${prefix}${file}/`;
//             declarations += generateIconTypeDeclarations(subDir, subPrefix);
//         } else {
//             const fileName = file.replace(/\.[^./]+$/, '');
//             if (`${prefix}${fileName}`.length > 0) {
//                 declarations += `'${prefix}${fileName}'|`;
//             }
//         }
//     }
//
//     return declarations;
// };
//
// const generateFile = () => {
//     let declarations = generateIconTypeDeclarations(iconsDir);
//     if (declarations.length > 0) {
//         // Remove the trailing '|' and add type definition
//         declarations = `export type Icons = ${declarations.slice(0, -1)};`;
//         writeFileSync(typesFilePath, declarations);
//     }
// }
//
//
// const iconsPlugin = (): Plugin => {
//     return {
//         name: 'icons-plugin',
//         buildStart() {
//             generateFile();
//         },
//         configureServer(server) {
//             server.watcher.add(iconsDir);
//
//             server.watcher.on('change', (filePath) => {
//                 if (filePath.startsWith(iconsDir)) {
//                     generateFile();
//                 }
//             });
//         },
//     };
// };
//
// export default iconsPlugin;
