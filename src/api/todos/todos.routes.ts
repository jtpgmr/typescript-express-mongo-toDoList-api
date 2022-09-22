import { Router } from 'express';

import * as TodoControllers from './todos.controllers';
import { validateRequest } from '../../middlewares';
import { Todo } from './todos.model';
import { IdParams } from '../../interfaces/IdParams';

const router = Router();

router.get('/', TodoControllers.findAllTodos);

router.get('/:id', validateRequest({ params: IdParams }), TodoControllers.findOneTodo);

router.post('/', validateRequest({ body: Todo }), TodoControllers.createTodo);

router.put('/:id', validateRequest({ params: IdParams, body: Todo }), TodoControllers.updateTodo);

router.delete('/:id', validateRequest({ params: IdParams }), TodoControllers.deleteTodo);

export default router;