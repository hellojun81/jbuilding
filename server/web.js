import express from 'express';
const app = express();
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import sql from './lib/CRUD.js';

const httpServer = http.createServer(app);
export const io = new Server(httpServer, {
    cors: {
        origin: "*",
        credentials: true
    }
});
app.use(cors({
    origin: true,
    credentials: true, // 크로스 도메인 허용
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
}));

app.get('/', (req, res) => {
    res.header("Access-Control-Allow-Credentials", 'true')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // 모든 HTTP 메서드 허용
    res.header('Content-Type', "application/json")
    res.json('welcome')
})





//  sql.readData('usertable', '', (results) => {
//   let a= results;
//   console.log(a)
// });

//  sql.readData('usertable', '', (results) => {
//     console.log(results);
// });
// // sql.updateData('usertable', { username: 'John Doe', password: 30 }, '', (rowsAffected) => {
// //     console.log(`${rowsAffected} rows updated`);
// // });
// sql.createData('usertable', { id:'gyulwang',username: '김완준', password: '2023jeju@' },  (rowsAffected) => {
//     console.log(`${rowsAffected} rows updated`);
// });

httpServer.listen(9000, function (req, res) {
    console.log('server start')
})