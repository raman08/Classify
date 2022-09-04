const express = require('express');
const router = express.Router();

const { multerUpload } = require('../utils/multer');

const studentController = require('../controllers/student');

router.get('/dashboard', studentController.getDashboard);
router.get('/show-class/:classId', studentController.showClass);
router.get('/join-class/:token', studentController.joinClass);
router.get('/show-class/:classId/classwork', studentController.showClasswork);
router.get(
	'/show-class/:classId/classwork/:assignmentId',
	studentController.showAssignment
);
router.post(
	'/show-class/:classId/disccusion/new/',
	multerUpload,
	studentController.POSTDiscussion
);
router.get('/show-class/:classId/members', studentController.showMembers);
router.get('/members', studentController.showInstMembers);
router.post(
	'/:classId/submit-assignment/:assignmentId',
	multerUpload,
	studentController.submitAssignment
);

module.exports = router;
