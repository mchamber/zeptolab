import jsonfile from 'jsonfile';
import lockfile from 'proper-lockfile';
import { IFile } from '@src/models/File';


const DB_FILE = __dirname + '/' + 'database.json';

const RETRY_OPTIONS = {
  retries: {
    retries: 5,
    factor: 3,
    minTimeout: 1 * 1000,
    maxTimeout: 60 * 1000,
    randomize: true,
  }
};


interface IFileDb {
  files: { [hash: string]: IFile };
}


async function openFileDb(): Promise<IFileDb> {
  const isLocked = await lockfile.check(DB_FILE);
  if (isLocked) {
    throw new Error('Databse is locked for writing. Try again after the lock is released.');
  }
  const db = await jsonfile.readFile(DB_FILE) as IFileDb;
  return db;
}



async function saveFileDb(db: IFileDb): Promise<void> {
  try {
    await lockfile.lock(DB_FILE, RETRY_OPTIONS);
    await jsonfile.writeFile(DB_FILE, db);
  } finally {
    // Ensure the lock is always released, even if an error occurs
    await lockfile.unlock(DB_FILE);
  }
}

function cleanFileDb(): Promise<void> {
  return jsonfile.writeFile(DB_FILE, { files: {} });
}


export default {
  openFileDb,
  saveFileDb,
  cleanFileDb,
} as const;
