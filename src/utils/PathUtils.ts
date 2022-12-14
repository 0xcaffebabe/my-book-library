import path from 'path'
import fs from 'fs'

const ensureDirectoryExistence = (filePath: string):void => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

const normalize = (path: string) => {
  return path.replaceAll("\\", "/")
}

export default {
  ensureDirectoryExistence,
  normalize
}
