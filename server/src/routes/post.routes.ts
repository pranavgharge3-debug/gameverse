import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createPostSchema, commentSchema } from '../validators/post.validator';

const router = Router();

router.get('/', requireAuth, PostController.getFeed);
router.post('/', requireAuth, validate(createPostSchema), PostController.createPost);
router.post('/:postId/comments', requireAuth, validate(commentSchema), PostController.createComment);
router.post('/:postId/like', requireAuth, PostController.likePost);

export { router as postRoutes };
