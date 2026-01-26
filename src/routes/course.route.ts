import express from "express";
import {
  createNewCourse,
  searchCourses,
  getPublishedCourses,
  getMyCreatedCourses,
  updateCourseDetails,
  getCourseDetails,
  addLectureToCourse,
  getCourseLectures,
} from "../controllers/course.controller.js";
import upload from "../utils/multer.js";
import {
  authenticateUserMiddleware,
  restrictToInstructor,
} from "../middlewares/auth.middleware.js";
import { validator, SourceType } from "../middlewares/validator.middleware.js";
import { courseValidator } from "../validator/course.zod.js";

const router = express.Router();

// Public routes
router.get("/published", getPublishedCourses);
router.get("/search", searchCourses);

// Protected routes
router.use(authenticateUserMiddleware);

// Course management
router
  .route("/")
  .post(
    upload.single("thumbnail"),
    validator(SourceType.BODY, courseValidator),
    createNewCourse,
  )
  .get(getMyCreatedCourses);

// Course details and updates
router
  .route("/c/:courseId")
  .get(getCourseDetails)
  .patch(
    restrictToInstructor(),
    upload.single("thumbnail"),
    updateCourseDetails,
  );

// Lecture management
router
  .route("/c/:courseId/lectures")
  .get(getCourseLectures)
  .post(restrictToInstructor(), upload.single("video"), addLectureToCourse);

export default router;
