import express from 'express';
const app = express();
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import sql from './lib/CRUD.js';
import url from 'url';
import request from 'request';
import dotenv from 'dotenv';
import axios from 'axios';
// import Kakao from 'kakao-sdk';

// const KAKAO_API_KEY = 'yYAXcD_rmdtc4JHScR47xs4qZRNN0Lx_PRvRU5pECiolkQAAAYcDIBv0';
// const KAKAO_REST_API_KEY = '3dbb376e580cba18110e5b1ceb927d9a';


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

app.get('/kakao/:name', async function (req, res) {
    console.log('kakao', KAKAO_API_KEY)
    const { name } = req.params
    if (name === 'test') {
        const receiverNumber = '01099881400';
        const message = 'MESSAGE_CONTENT';
        const options = {
            url: '/v1/api/talk/friends/message/default/send',
            headers: {
                Authorization: `Bearer ${KAKAO_API_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: {
                receiver_uuids: receiverNumber,
                template_object: {
                    text: message
                }
            },
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log('메시지 전송 성공');
            } else {
                console.log('메시지 전송 실패');
            }
        });
    }



    if (name === 'token') {
        console.log('token')
        // https://kauth.kakao.com/oauth/authorize?client_id={REST API 키}&
        // redirect_uri=https://localhost:3000&response_type=code&scope=talk_message
        const options = {
            uri: 'https://kauth.kakao.com/oauth/token',
            method: 'POST',
            form: {
                grant_type: 'client_credentials',
                client_id: '3dbb376e580cba18110e5b1ceb927d9a',
            },
        };

        request(options, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const access_token = JSON.parse(body).access_token;
                console.log(`Access Token: ${access_token}`);
            } else {
                console.log('인증 실패');
            }
        });
    }


    if (name === 'send_me') {
        const options = {
            uri: 'https://kapi.kakao.com/v2/api/talk/memo/default/send',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${KAKAO_API_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: {
                template_object: JSON.stringify({
                    object_type: 'text',
                    text: 'Hello, world!',
                    link: {
                        web_url: 'https://developers.kakao.com',
                    },
                }),
            },
        };

        request(options, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log('메시지 전송 성공');
            } else {
                console.log('메시지 전송 실패');
            }
        });
    } else if (name === 'find') {
        console.log('find')

        const options = {
            uri: 'https://kapi.kakao.com/v1/api/talk/friends',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${KAKAO_API_KEY}`,
            }, params: {
                offset: 3,
                limit: 3,
                order: 'asc'
            }
        };

        request(options, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                const friends = JSON.parse(body).elements;
                friends.forEach((friend) => {
                    console.log(`${friend.profile_nickname}의 UUID: ${friend.uuid}`);
                });
            } else {
                console.log('친구 목록 조회 실패', response.body);
            }
        });
    }



})
app.get('/jbd/:name', async function (req, res) {
    const { name } = req.params
    let _url = req.url;
    let queryData = url.parse(_url, true).query;
    let renter = queryData.renter
    let title = queryData.title
    let year = queryData.year
    let month = queryData.month
    let keys = queryData.keyName
    let values = queryData.values
    if (keys !== undefined) {
        keys = keys.split(',')
        values = values.split(',')
    }
    if (name == 'searchRenter') {
        let sort = queryData.sort
        let getRenter = queryData.getRenter
        let where, field, from
        if (renter === 'undefined') {
            renter = ''
        }
        if (getRenter === 'All') {
            field = 'name'
            from = 'jbuildingmng '
        } else {
            field = 'b.name,a.finish'
            from = 'jbuildingrentbill a left join jbuildingmng b on a.comp_code=b.key_code'
            where = 'year="' + year + '" and month="' + month + '" and b.name like "%' + renter + '%" and b.dealYN="Y"'
            sort = 'group by b.name'
        }
        console.log('searchRenter', month)
        sql.readData(from, field, where, sort, (results) => {
            res.json(results)
        });

    } else if (name === 'updateData') {
        let table, data, where, comp_code
        const obj = {};
        keys.forEach((key, index) => { obj[key] = values[index] });
        console.log('updateDate', { obj: obj, keys: keys, values: values })
        if (title === '계약정보') {
            table = 'jbuildingmng'
            where = 'building_name="제이빌딩" and name="' + renter + '"'
            data = obj
        }
        if (title === '수납하기' || title === '청구서생성') {
            comp_code = await sql.getRenterCode(renter)
            let str = obj.date.split('.')
            let year = str[0]
            let month = str[1]
            table = 'jbuildingrentbill'
            where = 'comp_code="' + comp_code + '" and year="' + year + '"'
                + 'and month="' + month + '"'
            data = obj
        }
        console.log('updateDate', { data: data, where: where })
        sql.updateData(table, data, where, (rowsAffected) => {
            res.json(rowsAffected)
        })
    } else if (name === 'createData') {
        let keys = queryData.keyName
        let values = queryData.values
        keys = keys.split(',')
        values = values.split(',')
        console.log('obj', { values: values, keys: keys })
        let table, data, where, comp_code
        const obj = {};
        keys.forEach((key, index) => { obj[key] = values[index] });
        const newObj = { ...obj };
        let AddObj
        if (title === '청구서생성') {
            comp_code = await sql.getRenterCode(renter)
            let str = obj.date.split('.')
            let year = str[0]
            let month = str[1]
            AddObj = { comp_code: comp_code, year: year, month: month }
            table = 'jbuildingrentbill'
        } else if (title === '임차인추가') {
            AddObj = { dealYN: 'Y' }
            table = 'jbuildingmng'
        }
        Object.assign(newObj, AddObj);
        console.log('createData', { data: newObj, where: where })
        sql.createData(table, newObj, (rowsAffected) => {
            res.json(rowsAffected)
        })

    } else if (name === 'GetrentBill') {
        let str = queryData.date.split('.')
        console.log('GetrentBill', str)
        let year = str[0]
        let month = str[1]
        let table = 'jbuildingmng a ,jbuildingrentbill b '
        let field = queryData.field
        let where
        let checkRentBill = true
        if (title === '청구서생성') {
            let a = await sql.checkRentBill(renter, year, month)
            if (a.length > 0) {
                checkRentBill = false
                where = "a.name ='" + renter + "' and a.key_code=b.comp_code and a.dealYn='Y' and year='" + year + "' and month='" + month + "'"
            } else {
                where = "a.name ='" + renter + "' and a.key_code=b.comp_code and a.dealYn='Y' limit 1"
            }


        } else if (title === '수납하기') {
            where = "a.name ='" + renter + "' and a.key_code=b.comp_code and a.dealYn='Y' and year='" + year + "' and month='" + month + "'"
        }
        if (checkRentBill === true) {
            sql.readData(table, field, where, '', (results) => {
                res.json(results)
            })
        } else {
            sql.readData(table, field, where, '', (results) => {
                res.json({ result: `${year}년${month}월에 청구서가 이미 존재합니다'`, value: results })
            })
        }
    } else if (name === 'GetrentEr') {
        let table = 'jbuildingmng '
        let field = queryData.field
        let where = "name ='" + renter + "' and dealYN='Y'"
        let sort = ''
        if (renter === '선택') {
            where = ''
            sort = 'limit 1 '
        }
        sql.readData(table, field, where, sort, (results) => {
            res.json(results)
        })
    } else if (name === 'confirmPay') {
        const obj = {};
        keys.forEach((key, index) => { obj[key] = values[index] });
        let comp_code = await sql.getRenterCode(renter)
        let str = obj.date.split('.')
        let year = str[0]
        let month = str[1]
        let dealYN = queryData.dealYN
        let table = 'jbuildingrentbill'
        let where = 'comp_code="' + comp_code + '" and year="' + year + '"'
            + 'and month="' + month + '"'
        let data = { finish: dealYN }
        console.log('createData', { data: data, where: where })
        sql.updateData(table, data, where, (rowsAffected) => {
            res.json(rowsAffected)
        })
    } else if (name === 'getSunabMoney') {
        let str = queryData.date.split('-')
        console.log('getSunabMoney', str)
        let year = str[0]
        let month = str[1]
        let table = 'jbuildingrentbill'
        let where = 'year="' + year + '" and month="' + month + '"'
        let field = "sum(rent_bill)+sum(mng_bill)+sum(vat_bill)+sum(etc_bill) as tmoney" +
            ",(SELECT IFNull(sum(rent_bill)+sum(mng_bill)+sum(vat_bill)+sum(etc_bill),0) FROM `jbuildingrentbill` where year='" + year + "' and month='" + month + "' and Finish='Y') as minab"
        let sort = ""
        sql.readData(table, field, where, sort, (results) => {
            console.log(results)
            res.json(results)
        })
    } else if (name === 'getExcelData') {
        let field
        let str = queryData.date.split('.')
        let kind=queryData.kind 
        let year = str[0]
        let month = str[1]
        let table = 'jbuildingmng a , jbuildingrentbill b'
        let where = 'year="' + year + '" and month="' + month + '" and a.key_code=b.Comp_code'
        let taxbillresult=[]
        let sort = ""
        if(kind==='rentbilldown'){
        field = "b.date as '날짜' ,a.building_name  as '빌딩명',a.address as '주소',a.name as '이름',b.year as '년',b.month as '월' "
            + " ,b.rent_bill as '임대료',b.mng_bill  as '관리비',b.vat_bill as '부가세',b.etc_bill as '수도세',"
            + " (b.rent_bill)+(b.mng_bill)+(b.vat_bill)+(b.ETC_BILL)as '합계',"
            + " b.etc as '메모'"
        }else if(kind==='taxbilldown'){
        field = taxbillfiled
        sql.readData(table, field, where, sort, (results) => {
            taxbillresult.push(results)
          })
        field = freetaxbillfiled
        }
       
        sql.readData(table, field, where, sort, (results) => {
            console.log("results",results)
            if(kind==='taxbilldown'){
                taxbillresult.push(results)
                results=taxbillresult
            }
            res.json(results)
            
        })
    }
})

const taxbillfiled = ' "01"as `전자(세금)계산서 종류\n(01:일반, 02:영세율)`,'+
'"20230323" as "작성일자",'+
'"2048197203" as `공급자 등록번호\n(" - "없이 입력)` , '+
' "" as `공급자\n종사업자번호`,'+
'"(주)제이쿨"as "공급자 상호",'+
'"김완준"as "공급자 성명",'+
'"서울동대문구 장한로53" as "공급자 사업장주소",'+
'""as "공급자 업태",'+
'""as "공급자 종목",'+
'""as "공급자 이메일",'+
'replace(a.Licensenum,"-","")  as `공급받는자 등록번호\n("" - ""없이 입력)"`,'+
'""as `공급자\n종사업장번호`,'+
'a.name as "공급받는자 상호",'+
'a.name2 as "공급받는자 성명",'+
'CONCAT("서울동대문구 장한로53 " , a.address)  as "공급받는자 사업장주소",'+
'""as "공급받는자 업태",'+
'""as "공급받는자 종목",'+
'a.email as "공급받는자 이메일1",'+
'""as "공급받는자 이메일2",'+
'b.rent_bill+b.mng_bill as "공급가액",'+
'((b.rent_bill+b.mng_bill)*0.1) as "세액",'+
'""as "비고",'+
'"일자"as `"일자1\n(2자리, 작성년월 제외)"`,'+
'"임대료"as "품목1",'+
'""as "규격1",'+
'""as "수량1",'+
'""as "단가1",'+
'b.rent_bill as "공급가액1",'+
'b.rent_bill*0.1 as "세액1",'+
'""as "품목비고1",'+
'"일자" as `일자2\n(2자리, 작성년월 제외)`,'+
'"관리비" as "품목2",'+
'""as "규격2",'+
'""as "수량2",'+
'""as "단가2",'+
'b.mng_bill as "공급가액2",'+
'b.mng_bill*0.1 as "세액2",'+
'""as "품목비고2",'+
'""as `일자3\n(2자리, 작성년월 제외)`,'+
'"" as "품목3",'+
'"" as "규격3",'+
'"" as "수량3",'+
'"" as "단가3",'+
'"" as "공급가액3",'+
'"" as "세액3",'+
'"" as "품목비고3",'+
'"" as `일자4\n(2자리, 작성년월 제외)`,'+
'"" as "품목4",'+
'"" as "규격4",'+
'"" as "수량4",'+
'"" as "단가4",'+
'"" as "공급가액4",'+
'"" as "세액4",'+
'"" as "품목비고4",'+
'"" as "현금",'+
'"" as "수표",'+
'"" as "어음",'+
'"" as "외상미수금",'+
'"01" as `영수(01),\n청구(02)`'

const freetaxbillfiled = ' "05"as `전자(세금)계산서 종류\n(01:일반, 02:영세율)`,'+
'"20230331" as "작성일자",'+
'"2048197203" as `공급자 등록번호\n(" - "없이 입력)` , '+
' "" as `공급자\n종사업자번호`,'+
'"(주)제이쿨"as "공급자 상호",'+
'"김완준"as "공급자 성명",'+
'"서울동대문구 장한로53" as "공급자 사업장주소",'+
'""as "공급자 업태",'+
'""as "공급자 종목",'+
'""as "공급자 이메일",'+
'replace(replace(a.Licensenum,"-","")," ","") as `공급받는자 등록번호\n("" - ""없이 입력)"`,'+
'""as `공급자\n종사업장번호`,'+
'a.name as "공급받는자 상호",'+
'a.name2 as "공급받는자 성명",'+
'CONCAT("서울동대문구 장한로53 " , a.address)  as "공급받는자 사업장주소",'+
'""as "공급받는자 업태",'+
'""as "공급받는자 종목",'+
'a.email as "공급받는자 이메일1",'+
'""as "공급받는자 이메일2",'+
'b.etc_bill as "공급가액",'+
'""as "비고",'+
'"일자"as `"일자1\n(2자리, 작성년월 제외)"`,'+
'"수도료"as "품목1",'+
'""as "규격1",'+
'""as "수량1",'+
'""as "단가1",'+
'b.etc_bill as "공급가액1",'+
'""as "품목비고1",'+
'"일자" as `일자2\n(2자리, 작성년월 제외)`,'+
'"" as "품목2",'+
'"" as "규격2",'+
'"" as "수량2",'+
'"" as "단가2",'+
'"" as "공급가액2",'+
'"" as "품목비고2",'+
'"" as `일자3\n(2자리, 작성년월 제외)`,'+
'"" as "품목3",'+
'"" as "규격3",'+
'"" as "수량3",'+
'"" as "단가3",'+
'"" as "공급가액3",'+
'"" as "품목비고3",'+
'"" as `일자4\n(2자리, 작성년월 제외)`,'+
'"" as "품목4",'+
'"" as "규격4",'+
'"" as "수량4",'+
'"" as "단가4",'+
'"" as "공급가액4",'+
'"" as "품목비고4",'+
'"" as "현금",'+
'"" as "수표",'+
'"" as "어음",'+
'"" as "외상미수금",'+
'"01" as `영수(01),\n청구(02)`'
httpServer.listen(9000, function (req, res) {
    console.log('server start')
})



// sql.updateData('usertable', { username: 'John Doe', password: 30 }, '', (rowsAffected) => {
//     console.log(`${rowsAffected} rows updated`);
// });
