import { MongoClient } from 'mongodb'; // MongoDB 클라이언트 인스턴스 생성과 서버 연결

const uri = process.env.MONGODB_URI; // MongoDB 연결 URI
const options = {}; // MongoDB 클라이언트 추가 옵션 설정 객체

let client; // MongoDB 클라이언트 인스턴스 저장 변수
let clientPromise; // MongoDB 클라이언트와의 연결 완료 후 반환되는 프로미스 저장 (데이터베이스 작업 수행)

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') { // 개발 중 코드가 변경될 때마다 서버가 재시작되어 클라이언트 인스턴스가 계속 생성하는 것을 방지
  if (!global._mongoClientPromise) { // 클라이언트 인스턴스를 전역으로 캐싱
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else { // 생산 환경에서는 서버가 한 번만 시작되고 인스턴스가 변경되지 않으므로 
  client = new MongoClient(uri, options); // 새로운 인스턴스 생성
  clientPromise = client.connect(); // 인스턴스 저장
}

export default clientPromise;
