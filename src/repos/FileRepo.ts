import { IFile } from '@src/models/File';
import orm from './MockOrm';
import { constants, createReadStream, promises as fsPromises } from 'fs';
import logger from 'jet-logger';

const BATCH_SIZE = 512 * 1024; // 512KB


async function persists(file: IFile): Promise<boolean> {
  const db = await orm.openFileDb();
  db.files[file.hash] = file;
  try {
    orm.saveFileDb(db);
    return true;
  } catch (err) {
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
  return new Promise((resolve, reject) => {
    const readStream = createReadStream(filePath, { encoding: 'utf8' });
    let fileContent = '';

    readStream.on('data', (chunk) => {
      fileContent += String(chunk);
      if (fileContent.length >= BATCH_SIZE) {
        readStream.pause();
        const content = fileContent;
        fileContent = '';
        resolve(content);
      }
    });

    readStream.on('end', () => {
      if (fileContent.length > 0) {
        resolve(fileContent);
      }
    });

    readStream.on('error', (error) => {
      logger.err(`Error reading file ${filePath}: ${error.message}`);
      reject(error);
    });
  });
}

export default {
  persists,
  readFile,
};