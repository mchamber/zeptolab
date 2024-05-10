import { contract } from './contracts';
import { initServer } from '@ts-rest/express';
import FileService from '@src/services/FileService';

const s = initServer();
const rpcRouter = s.router(contract, {
  saveFileRpc: async ({ body: { hash, type, version } }) => {
    try {
      const file = await FileService.saveToDatabase(type, version, hash);
      return {
        status: 200,
        body: file,
      };
    } catch (error) {
      return {
        status: 400,
        body: { error: (error as Error)?.message },  
      };
    }
  },
});
export default rpcRouter;
