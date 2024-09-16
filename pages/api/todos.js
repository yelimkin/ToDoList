// import { useSession } from 'next-auth/react'; // 현재 요청과 연결된 사용자의 세션 정보를 가져오기
import { getServerSession } from 'next-auth'; // 서버 사이드에서 세션 정보를 가져오는 함수
import { authOptions } from './auth/[...nextauth]'; // NextAuth 설정 가져오기
import clientPromise from '../../lib/mongodb'; // MongoDB와의 연결을 관리하는 객체
import { ObjectId } from 'mongodb';

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions); // 현재 요청에 대한 세션 정보 가져오기

  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // 데이터베이스 연결
  const client = await clientPromise;
  const db = client.db('todo-app');

  if (req.method === 'GET') { // 할 일 목록 조회
    const todos = await db.collection('todos').find({ user: session.user.email }).toArray(); // todos 컬렉션에서 사용자의 이메일과 일치하는 할 일을 모두 조회
  
    res.json(todos); // 조회된 할 일 목록을 JSON 형식으로 클라이언트에 반환

  } else if (req.method === 'POST') { // 새 할 일 추가
    const { text } = req.body;

    const todo = { // 할 일 객체 생성
      text,
      user: session.user.email,
      completed: false,
    };

    await db.collection('todos').insertOne(todo); // todos 컬렉션에 새 할 일을 저장
    res.status(201).json(todo);

  } else if (req.method === 'PUT') { // 할 일 상태 업데이트
    const { id, completed } = req.body;

    await db.collection('todos').updateOne({ _id: new ObjectId(id) }, { $set: { completed } }); // _id가 일치하는 할 일의 completed 필드를 업데이트
    res.status(200).json({ message: 'Todo updated' });

  } else if (req.method === 'DELETE') { // 할 일 삭제
    const { id } = req.body;

    if (!id) {
      res.status(400).json({ message: '할 일 ID가 필요합니다.' });
      return;
    }

    try {
      const result = await db
        .collection('todos')
        .deleteOne({ _id: new ObjectId(id), userId: session.user.id }); // _id가 일치하는 할 일을 삭제
    
      if (result.deletedCount === 1) {
        res.status(200).json({ message: '할 일이 삭제되었습니다.' });
      } else {
        res.status(404).json({ message: '해당 할 일을 찾을 수 없습니다.' });
      }
    } catch(error) {
      console.error('할 일 삭제 중 에러 발생:', error);
      res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }    
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
