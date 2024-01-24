import { Router } from 'express';
import Multer from 'multer';

import FileUploadService from '../services/fileUpload.service';

const router = Router();

const storage = Multer.memoryStorage();
const upload = Multer({ storage });

const uploader = new FileUploadService();
router.post('/', upload.single('file'), (req, res) =>
	uploader.upload(req, res)
);

export default router;
