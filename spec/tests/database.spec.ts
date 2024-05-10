import orm from '@src/repos/MockOrm';
import logger from 'jet-logger';
import FileRepo from '@src/repos/FileRepo';
import fs, { promises as fsPromises } from 'fs';
import { Readable } from 'stream';

describe('FileRepo persists function', () => {

    let openFileDbSpy: jasmine.Spy;
    let saveFileDbSpy: jasmine.Spy;
    let errSpy: jasmine.Spy;
    beforeEach(() => {
        openFileDbSpy = spyOn(orm, 'openFileDb').and.returnValue(Promise.resolve({ files: {} }));
        saveFileDbSpy = spyOn(orm, 'saveFileDb');
        errSpy = spyOn(logger, 'err');
    });

    it('should persist the file and return true', async () => {
        const mockFile = { type: "", version: "", hash: 'mockHash', content: 'mockContent' };

        const result = await FileRepo.persists(mockFile);

        expect(result).toBe(true);
        expect(openFileDbSpy).toHaveBeenCalled();
        expect(saveFileDbSpy).toHaveBeenCalledWith({ files: { [mockFile.hash]: mockFile } });
        expect(errSpy).not.toHaveBeenCalled();
    });

    it('should return false and log error if an error occurs during persistence', async () => {
        const mockFile = { type: "", version: "", hash: 'mockHash', content: 'mockContent' };
        const mockError = new Error('Mock error');

        openFileDbSpy.and.returnValue(Promise.reject(mockError));

        const result = await FileRepo.persists(mockFile);

        expect(result).toBe(false);
        expect(openFileDbSpy).toHaveBeenCalled();
        expect(saveFileDbSpy).not.toHaveBeenCalled();
        expect(errSpy).toHaveBeenCalledWith(`Error saving file ${mockFile.hash}: ${mockError.message}`);
    });

    it('should read a file correctly', async () => {
        const filePath = 'path/to/file.txt';
        const content = 'Test file content';
        const fileContent = Buffer.from(content) as Buffer & Error & number;
        spyOn(fsPromises, 'access');
        spyOn(fsPromises, 'stat').and.returnValue({ isFile: () => true } as any)
        async function* mockAsyncIterator(): AsyncGenerator<Buffer> {
            yield fileContent;
        }
        spyOn(fs, 'createReadStream').and.returnValue(Readable.from(mockAsyncIterator()) as any);

        const found_content = await FileRepo.readFile(filePath);
        expect(found_content).toEqual(content);
    });

    it('should handle error when reading a file', async () => {
        const filePath = 'path/to/file.txt';
        const fileContent = Buffer.from('Test file content') as Buffer & Error & number;
        spyOn(fsPromises, 'access');
        spyOn(fsPromises, 'stat').and.returnValue({ isFile: () => true } as any)
        async function* mockAsyncIterator(): AsyncGenerator<Buffer> {
            throw new Error('Error reading file');
        }
        spyOn(fs, 'createReadStream').and.returnValue(Readable.from(mockAsyncIterator()) as any);

        try {
            await FileRepo.readFile(filePath);
        } catch (error) {
            expect(error.message).toEqual('Error reading file');
        }
    });

    it('should handle error when opening a file', async () => {
        const filePath = 'path/to/nonexistent/file.txt';

        spyOn(fsPromises, 'access').and.throwError(new Error('File not found'));

        try {
            await FileRepo.readFile(filePath);
        } catch (error) {
            expect(error.message).toEqual(`File can't be read: ${filePath}`);
        }
    });
});