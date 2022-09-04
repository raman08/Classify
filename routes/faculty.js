const express = require('express');
const router = express.Router();

const { multerUpload } = require('../utils/multer');
const facultyController = require('../controllers/faculty');

router.get('/dashboard', facultyController.getDashboard);
router.get('/show-class/:classId', facultyController.showClass);
router.get(
	'/:classId/create-assignment',
	facultyController.GETcreateAssignment
);
router.post(
	'/:classId/create-assignment',
	multerUpload,
	facultyController.POSTcreateAssignment
);
router.get('/show-class/:classId/classwork', facultyController.showClasswork);
router.get(
	'/show-class/:classId/classwork/:assignmentId',
	facultyController.showAssignment
);
router.post(
	'/show-class/:classId/classwork/:assignmentId/submissions/:homeworkId/update-marks/:studentId',
	facultyController.updateMarks
);

router.get('/show-class/:classId/members', facultyController.showMembers);
router.get(
	'/class/:classId/report-student/:studentId/',
	facultyController.reportStudent
);
router.post(
	'/show-class/:classId/disccusion/new/',
	multerUpload,
	facultyController.POSTDiscussion
);

router.get('/members', facultyController.showInstMembers);

module.exports = router;
