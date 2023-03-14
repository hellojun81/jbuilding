import express from 'express';
const app = express();
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import sql from './lib/CRUD.js';
import url from 'url';

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


app.post('/gy/:name', async function (req, res) {
    const { name } = req.params
    let _url = req.url;
    let queryData = url.parse(_url, true).query;
    let result = new Object();
})


app.get('/jbd/:name', async function (req, res) {
    const { name } = req.params
    let _url = req.url;
    let queryData = url.parse(_url, true).query;
    let renter=queryData.renter
    if (name == 'searchRenter') {
        let renter = queryData.renter
        let year = queryData.year
        let month = queryData.month
        let sort =queryData.sort
        let where
        if (renter === 'undefined') {
            renter = ''
        }
        // where = 'year="' + year + '" and month="' + month + '" and b.name like "%' + renter + '%"'
        where="b.dealYN='Y'"
        sort='group by b.name'
        let from='jbuildingrentbill a left join jbuildingmng b on a.comp_code=b.key_code'
        sql.readData(from, 'b.name', where, sort,(results) => {
            let a = results;
            console.log('searchRenter',a)
            res.json(a)
        });
    } else if (name === 'currentRentList') {
        sql = "select b.name  from  jbuildingrentbill a"
            + " left join jbuildingmng b on a.comp_code=b.key_code"
            + " where year='2023' and month='2'"
        sql.readData('jbuildingmng', 'name,name2', where, (results) => {
            let a = results;
            console.log(a)
            res.json(a)
        })
    }else if (name === 'GetrentBill') {
        // sql = "select deposit,rent_bill,mng_bill,etc_bill,  from  jbuildingmng a"
        let where ="name ='"+ renter +"'"
        let field=queryData.field

        sql.readData('jbuildingmng', field, where,'' ,(results) => {
            let a = results;
            console.log(a)
            res.json(a)
        })
    }
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