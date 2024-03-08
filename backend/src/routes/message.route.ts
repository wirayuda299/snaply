import { Router } from 'express';

import MessageService from '../services/message.service';
import messageModel from '../models/message.model';
import MessageController from '../controllers/message.controller';

const router = Router();

const service = new MessageService(messageModel);
const controller = new MessageController(service);

router.post('/send', (req, res) => controller.send(req, res));
router.get('/all-conversation', (req, res) =>
	controller.allConverstation(req, res)
);
router.get('/chat', (req, res) => controller.chat(req, res));
router.post('/create', (req, res) => controller.create(req, res));

export default router;
