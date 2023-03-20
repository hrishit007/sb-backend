import {spawn} from 'child_process';
import nodemailer from 'nodemailer';
import {google} from 'googleapis';

export const createPdf=()=>{
// Define the arguments for the Python script
const args = ['./pythonCodes/generate_pdf.py'];

// Spawn a new Python process
const pythonProcess = spawn('python', args);

// Listen for data events from the Python process
pythonProcess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

// Listen for error events from the Python process
pythonProcess.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

// Listen for close events from the Python process
pythonProcess.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
}
export const sendfeedback= async (req)=>{
  const {firstName,lastName,email,phoneNumber,message,userName}=req.body;
  //send mail here to sensing bharat with details
  try{
        const CLIENT_ID = process.env.CLIENT_ID_FOR_EMAIL;
        const CLIENT_SECRET = process.env.CLIENT_SECRET_FOR_EMAIL;
        const REDIRECT_URI = process.env.REDIRECT_URI;
        const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
        const FROM_EMAIL = 'sensingbharat@gmail.com';
        const TO_EMAIL = 'sensingbharat@gmail.com';
        const SUBJECT = 'Customer Feedback/Contacted Us';
        const TEXT = `FirstName: ${firstName}\nLast Name: ${lastName}\nEmail Provided: ${email}\nUserName: ${userName}\nPhone Number: ${phoneNumber}\nMessage: ${message}`;
        const oAuth2Client = new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            REDIRECT_URI
          );
          
        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: FROM_EMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });
        

        const mailOptions = {
            from:FROM_EMAIL,
            to:TO_EMAIL,
            subject:SUBJECT,
            text: TEXT,
        };

        const result = await transport.sendMail(mailOptions);
        res.status(200).json({message:"Feedback sent successfully"});
  }
  catch(error){
    console.log(error);
  }
}