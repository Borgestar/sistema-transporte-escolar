import AdminJS from 'adminjs';
import { buildRouter } from '@adminjs/express';
import { Database, Resource } from '@adminjs/mongoose'; // Importação nomeada
import Cadastro from './models/Cadastro.js';

AdminJS.registerAdapter({ Database, Resource });

const adminJs = new AdminJS({
  resources: [Cadastro],
  rootPath: '/admin',
});

const adminRouter = buildRouter(adminJs);  // Correção aqui também

export { adminJs, adminRouter };
