import { Router } from 'express';
import { getExamples, createExample, updateExample, deleteExample } from '../controllers/exampleController';
import { protect } from '../middlewares/auth';

const router = Router();

router.use(protect); // All example routes are protected

router.route('/')
    .get(getExamples)
    .post(createExample);

router.route('/:id')
    .put(updateExample)
    .delete(deleteExample);

export default router;
