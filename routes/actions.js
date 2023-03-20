import express from 'express';
import { createPdf,sendfeedback } from '../controllers/actions.js';

const router=express.Router();

router.post('/createPdf',createPdf);
router.post('/sendfeedback',sendfeedback);

export default router;