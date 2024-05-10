import jsonfile from 'jsonfile';
import { IFile } from '@src/models/File';


const DB_FILE = __dirname + '/' + 'file_database.json';


interface IFileDb {
  files: { [hash: string]: IFile };
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
  openFileDb,
  saveFileDb,
  cleanFileDb,
} as const;
