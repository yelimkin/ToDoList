import { db } from '../../../firebaseConfig';

function handler(req, res) {
  const data = req.body;

  const { email, password } = data;

  if(
    !email || 
    !email.includes('@') ||
    !password ||
    password.trim().length() < 7
  ) {
    res
      .status(422)
      .json({ 
        message: 'Invalid input - password should also be at least 7 characters long.' 
      });
    return;
  }

  
}

export default handler;