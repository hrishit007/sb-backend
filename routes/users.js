import express from 'express';

import { signin,signup,verifyCredentials,checkIfUserExists,validateOtpForSignup,resendOTP } from '../controllers/users.js';

const router= express.Router();

router.post('/signin',signin);
router.post('/signup',signup);
router.post('/otpverify',verifyCredentials);
router.post('/userexistscheck',checkIfUserExists);
router.post('/validateotp',validateOtpForSignup);
router.post('/resendotp',resendOTP);

export default router;