import { Router } from "express";
import { authenticateUser } from "../controllers/user.controller.js";
import {
  getComments,
  getLectureDetails,
} from "../controllers/lecture.controller.js";
const router = Router();

router.use(authenticateUser);

router.route("/:lectureId").get(getLectureDetails);
router.route("/:lectureId/comments").get(getComments);

export default router;
