import { IFile } from '@src/models/File';
import FileRepo from '@src/repos/FileRepo';
import crypto from 'crypto';


async function saveToDatabase(
  type: string,
  version: string,
  input_hash: string | null,
): Promise<IFile> {
  const filePath = `${type}/${version}.json`;
  const found_content = await FileRepo.readFile(filePath);
  const hash = _calculateHash(found_content);
  const content = _compareFileHashes(input_hash, hash)
    ? found_content
    : null;
  const file: IFile = {
    type,
    version,
    hash,
    content,
  };
  await FileRepo.persists(file);
  return file;
}


function _compareFileHashes(
  hash_input: string | null,
  found_hash: string,
): boolean {
  return hash_input === found_hash;
}


function _calculateHash(content: string | Buffer): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

export default { saveToDatabase } as const;