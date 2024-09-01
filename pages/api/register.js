import bcrypt from 'bcryptjs'; // 비밀번호 검증 : 사용자가 로그인할 때 입력한 비밀번호를 동일한 해시 함수로 변환하고, 데이터베이스에 저장된 해시된 비밀번호와 비교
import clientPromise from '../../lib/mongodb'; // MongoDB와의 연결 관리

export default async function handler(req, res) {
  if (req.method === 'POST') { // '/api/register'로 POST 요청을 보낼 때 이 함수가 호출
    try {
      
      const { email, password } = req.body; // 클라이언트에서 보낸 데이터인 회원가입 폼에서 보낸 email과 password 값을 추출
      
      // 비밀번호 해싱
      const salt = bcrypt.genSaltSync(10); // 해시 연산의 더 복잡도와 안전도를 나타내는 솔트를 생성하는 함수
      const hashedPassword = bcrypt.hashSync(password, salt); // 비밀번호를 솔트와 함께 해싱
      
      // MongoDB에 사용자 저장
      const client = await clientPromise; // MongoDB와 연결
      const db = client.db('todo-app'); // db 객체를 통해 데이터베이스에 접근
      
      const existingUser = await db.collection('users').findOne({ email }); // users 컬렉션에서 주어진 이메일을 가진 사용자를 찾기
      if (existingUser) { // 중복 검사 후 처리
        return res.status(400).json({ message: 'User already exists' });
      }
      
      const newUser = { // 새 사용자 객체 생성
        email,
        password: hashedPassword, // 해시된 비밀번호를 저장
      };
      
      await db.collection('users').insertOne(newUser); // users 컬렉션에 새 사용자를 저장
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    } finally {
      res.status(201).json({ message: 'User created successfully' });
    };
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}