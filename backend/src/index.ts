import 'reflect-metadata';

import AppService from './services/app.service';

const app = new AppService(3002);

app.listen();
