import {spawn} from 'child_process';

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
export const sendfeedback=(req)=>{
  const {firstname,lastname,email,phone,message}=req.body;
  //send mail here to sensing bharat with details
  console.log(req.body);
}