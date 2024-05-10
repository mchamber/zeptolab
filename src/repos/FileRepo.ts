import { IFile } from '@src/models/File';
import orm from './MockOrm';
import { constants, createReadStream, promises as fsPromises } from 'fs';
import logger from 'jet-logger';

const BATCH_SIZE = 512 * 1024; // 512KB


async function persists(file: IFile): Promise<boolean> {
  try {
    const db = await orm.openFileDb();
    db.files[file.hash] = file;
    await orm.saveFileDb(db);
    return true;
  } catch (err) {
    logger.err(`Error saving file ${file.hash}: ${err.message}`);
    return false;
  }
}

async function existsFileInFileSystem(filePath: string): Promise<boolean> {
  try {
    await fsPromises.access(filePath, constants.F_OK | constants.R_OK);
    const stats = await fsPromises.stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}

async function readFile(filePath: string): Promise<string> {
  if (!await existsFileInFileSystem(filePath)) {
    throw new Error(`File can't be read: ${filePath}`);
  }
  const readStream = createReadStream(filePath, { encoding: 'utf8' , highWaterMark: BATCH_SIZE});
  let fileContent = '';
  try {
    for await (const chunk of readStream) {
      fileContent += String(chunk);
    }
  } catch (err) {
    logger.err(`Error reading file ${filePath}: ${err.message}`);
    throw err;
  }
  return fileContent;
}

export default {
  persists,
  readFile,
};