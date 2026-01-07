import fs from 'node:fs/promises';
import path from 'node:path';

const pwdPath = path.resolve(process.cwd());

export async function createFile(path: string, fileName: string, data: string) {
  console.log(pwdPath);

  //    fs.writeFile(, data)
}
