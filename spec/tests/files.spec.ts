import supertest from 'supertest';

import app from '@src/server';


import FileRepo from '@src/repos/FileRepo';
import orm from '@src/repos/MockOrm';


const superTestApp = supertest(app);


describe('FileRouter', () => {

  describe('Unit test saveFile', () => {

    it('should save a file to the database', async () => {
      const readSpy = spyOn(FileRepo, 'readFile').and.resolveTo('{}');
      const persistSpy = spyOn(FileRepo, 'persists').and.resolveTo();
      const request = { hash: 'sampleHash', type: 'sampleType', version: 'sampleVersion' };
      const response = await superTestApp.post('/api/saveFileRpc').send(request);

      expect(readSpy).toHaveBeenCalledWith('sampleType/sampleVersion.json');
      expect(persistSpy).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ type: 'sampleType', version: 'sampleVersion', hash: jasmine.any(String), content: null });
    });

    it('should handle errors when saving a file', async () => {
      const request = { hash: 'invalidHash', type: 'invalidType', version: 'invalidVersion' };
      const response = await superTestApp.post('/api/saveFileRpc').send(request);
      expect(response.status).toBe(400);
      const responseMessage = (response.body as { error: string }).error;
      expect(responseMessage).toContain('File can\'t be read: invalidType/invalidVersion.json');
    });
  });

  describe('Integration test saveFile', () => {
    beforeEach(async () => {
      await orm.cleanFileDb();
    });

    afterEach(async () => {
      await orm.cleanFileDb();
    });

    it('should return content null when invalid hash', async () => {
      const type = `${__dirname}/fixture`;
      const version = '1.0.1';
      const request = { hash: 'invalidHash', type, version };
      const response = await superTestApp.post('/api/saveFileRpc').send(request);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        { type, version, hash: jasmine.any(String), content: null });
    });

    it('should return content of the file when valid hash', async () => {
      const type = `${__dirname}/fixture`;
      const version = '1.0.1';
      const hash = '44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a';
      const request = { hash: hash, type, version };
      const response = await superTestApp.post('/api/saveFileRpc').send(request);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ type, version, hash: hash, content: '{}' });
    });
  });
});
