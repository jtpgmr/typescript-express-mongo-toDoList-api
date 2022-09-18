import { Router } from 'express';
import * as TodoControllers from './todos.controllers';

const router = Router();

router.get('/', TodoControllers.findAllTodos);
router.post('/', TodoControllers.createTodo);

export default router;