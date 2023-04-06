import mysql from 'mysql2';
import jsonfile from 'jsonfile';
import path from 'path';
import fs from 'fs';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const json = jsonfile.readFileSync(__dirname + '/database.json');


// MySQL 연결 설정
const connection = mysql.createConnection({
    host: json.mysql.host,
    user: json.mysql.user,
    password: json.mysql.password,
    database: json.mysql.database
});

// console.log({connection:connection.host ,__dirname:__dirname})

// CREATE 함수
async function getRenterCode(renter) {
    return new Promise((resolve, reject) => {
        readData('jbuildingmng', 'key_code', 'name="' + renter + '"', '', (results) => {
            resolve(results[0].key_code);
        });
    });
}
async function checkRentBill(renter,year,month) {
    return new Promise((resolve, reject) => {
        let table='jbuildingmng a ,jbuildingrentbill b'
        let where="a.name ='"+renter+"' and a.key_code=b.comp_code and year='"+year+"' and month='"+month+"'"
        let field='a.name'
        readData(table, field, where, '', (results) => {
            resolve(results);
        });
    });
}

function createData(table, data, callback) {
    const fields = Object.keys(data).join(',');
    const values = Object.values(data);
    const placeholders = new Array(values.length).fill('?').join(',');
    const sql = `INSERT INTO ${table} (${fields}) VALUES (${placeholders})`;
    connection.query(sql, values, (error, results, fields) => {
        if (error) throw error;
        console.log('createDate', results)
        callback(results.affectedRows);
    });
}

// READ 함수
function readData(table, field, whereClause, sort, callback) {
    let sql = `SELECT ${field} FROM ${table}`;
    if (whereClause) sql += ` WHERE ${whereClause}`;
    if (sort) sql += `  ${sort}`;
    console.log('ReadData sql : ', sql)
    connection.query(sql, (error, results, fields) => {
        if (error) throw error;
        let newJsonObj = {};
        let obj = []
        for (let i = 0; i < results.length; i++) {
            let keys = Object.keys(results[i]);
            newJsonObj = {}
            keys.map((key) => {
                newJsonObj[key] = '' + results[i][key]
            });
            obj.push(newJsonObj)
        }
        callback(obj);
    });
}

// UPDATE 함수
function updateData(table, data, whereClause, callback) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = Object.keys(data)
        .map((key) => `${key} = '${data[key]}'`)
        .join(', ');
    let sql = `UPDATE ${table} SET ${placeholders}`;
    if (whereClause) sql += ` WHERE ${whereClause}`;
    console.log('upDate sql : ', sql)
    connection.query(sql, values, (error, results, fields) => {
        if (error) throw error;
        callback(results.affectedRows);
    });
}

// DELETE 함수
function deleteData(table, whereClause, callback) {
    let sql = `DELETE FROM ${table}`;
    if (whereClause) sql += ` WHERE ${whereClause}`;
    connection.query(sql, (error, results, fields) => {
        if (error) throw error;
        callback(results.affectedRows);
    });
}

export default {
    createData,
    readData,
    updateData,
    deleteData,
    getRenterCode,
    checkRentBill
}