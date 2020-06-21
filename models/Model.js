import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('db.db');

const exceptionMessages = {
    tableIsNull: 'Model Exception: table property cannot be null.',
    propertyIsNull: 'Model Exception: {prop} property cannot be null.',
    argumentIsNUll: 'Model Exception: "{arg}" argument cannot be null or undefined.',
    argumentMustBeObject: 'Model Exception: "{arg}" must be type of object'
};

export default class Model {
    static database = db;
    static table = null;
    static columns = [];

    static async find(id) {
        if(this.table === null){ throw exceptionMessages.tableIsNull }
        const statement = `SELECT * FROM ${this.table} WHERE id=? LIMIT 1`;
        return new Promise((resolve, reject) => {
            this.database.transaction(function(tx) {
                tx.executeSql(statement,[id], function (stmt, result) {
                    if(result.rows.length){
                        resolve(result.rows.item(0));
                    }else{
                        resolve(null);
                    }
                }, function (stmt, error) {
                    reject(error.message);
                });
            });
        });
    }

    static create(data) {
        return new Promise((resolve, reject) => {
            let filled = {};

            this.columns.forEach(column => {
                filled[column] = data[column];
            });

            const keys = Object.keys(filled);
            const values = Object.values(filled);
            const slots = keys.map(column => {
                return '?';
            }).join(',')

            let statement = `INSERT INTO ${this.table}(${keys.join(',')}) VALUES (${slots})`;

            this.database.transaction(tx => {
                tx.executeSql(statement, values, function (stmt, result) {
                    resolve(result.insertId);
                }, function (stmt, error) {
                    reject(error.message);
                })
            });
        });
    }

    static update(id, data) {
        if(data === null || data === undefined) {
            throw exceptionMessages.argumentIsNUll.replace('{arg}', 'data');
        } else if(typeof data != "object"){
            throw exceptionMessages.argumentMustBeObject.replace('{arg}', 'data');
        }

        return new Promise((resolve, reject) => {
            let filled = {};
            this.columns.forEach(column => {
                if(column in data){
                    filled[column] = data[column];
                }
            });
            const keys = Object.keys(filled);
            const values = Object.values(filled);
            values.push(id);
            let statement = `UPDATE ${this.table} SET ${keys.map(key => key+'=?').join(', ')} WHERE id=?`;
            this.database.transaction(tx => {
                tx.executeSql(statement, values, function (stmt, result) {
                    resolve(result.rowsAffected);
                }, function (stmt, error) {
                    reject(error.message);
                })
            })
        });
    }

    static delete(id) {
        if( ! id) {
            throw exceptionMessages.argumentIsNUll.replace('{arg}', 'id')
        }

        return new Promise((resolve, reject) => {
            const statement = `DELETE FROM ${this.table} WHERE id=?`;
            this.database.transaction(tx => {
                tx.executeSql(statement, [id], function (stmt, result) {
                    resolve(result.rowsAffected);
                }, function (stmt, error) {
                    reject(error.message);
                })
            })
        });
    }

    static all() {
        if(this.table === null){ throw exceptionMessages.tableIsNull; }
        return new Promise(resolve => {
            this.database.transaction(tx => {
                tx.executeSql(`SELECT * FROM ${this.table}`, [], function (tx, result) {
                    resolve(result.rows._array);
                })
            });
        });
    }
}