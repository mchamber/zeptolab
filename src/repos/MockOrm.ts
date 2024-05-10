

import jsonfile from 'jsonfile';

import { IUser } from '@src/models/User';
import { IFile } from '@src/models/File';


const DB_FILE_NAME = 'database.json';


const DB_FILE = __dirname + '/' + 'file_database.json';


// **** Types **** //

interface IDb {
  users: IUser[];
}

interface IFileDb {
  files: { [hash: string]: IFile };
}


function openDb(): Promise<IDb> {
  return jsonfile.readFile(__dirname + '/' + DB_FILE_NAME) as Promise<IDb>;
}


function saveDb(db: IDb): Promise<void> {
  return jsonfile.writeFile((__dirname + '/' + DB_FILE_NAME), db);
}


function openFileDb(): Promise<IFileDb> {
  return jsonfile.readFile(DB_FILE) as Promise<IFileDb>;
}

function saveFileDb(db: IFileDb): Promise<void> {
  return jsonfile.writeFile(DB_FILE, db);
}

function cleanFileDb(): Promise<void> {
  return jsonfile.writeFile(DB_FILE, { files: {} });
}




export default {
  openDb,
  saveDb,
  openFileDb,
  saveFileDb,
  cleanFileDb,
} as const;
