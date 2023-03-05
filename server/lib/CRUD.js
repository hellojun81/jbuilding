import mysql from 'mysql2';
import jsonfile from 'jsonfile';
import path from 'path';
import fs from 'fs';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const json = jsonfile.readFileSync(__dirname+'/database.json');


// MySQL 연결 설정
const connection = mysql.createConnection({
    host: json.mysql.host,
    user: json.mysql.user,
    password: json.mysql.password,
    database: json.mysql.database
});

// console.log({connection:connection.host ,__dirname:__dirname})

// CREATE 함수
function createData(table, data, callback) {
    const fields = Object.keys(data).join(',');
    const values = Object.values(data);
    const placeholders = new Array(values.length).fill('?').join(',');
    const sql = `INSERT INTO ${table} (${fields}) VALUES (${placeholders})`;
    connection.query(sql, values, (error, results, fields) => {
        if (error) throw error;
        callback(results.affectedRows);
    });
}

// READ 함수
function readData(table, whereClause, callback) {
    let sql = `SELECT * FROM ${table}`;
    if (whereClause) sql += ` WHERE ${whereClause}`;
    connection.query(sql, (error, results, fields) => {
        if (error) throw error;
        let newJsonObj = {};
        let obj=[]
        for (let i = 0; i < results.length; i++) {
            let keys = Object.keys(results[i]);
            newJsonObj={}
            keys.map((key) => {
                newJsonObj[key] = ''+results[i][key]
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
    const placeholders = fields.map(field => `${field}=?`).join(',');
    let sql = `UPDATE ${table} SET ${placeholders}`;
    if (whereClause) sql += ` WHERE ${whereClause}`;
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
    deleteData
}