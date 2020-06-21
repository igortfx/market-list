import Model from "./Model";

export default class Items extends Model {
    static table = 'items';
    static columns = ['name','quantity','amount','in_cart'];

    static sumInCart() {
        return new Promise((resolve, reject) => {
            const statement = `SELECT SUM(quantity * amount) as total FROM ${this.table} WHERE in_cart = ?`;
            this.database.transaction(tx => {
                tx.executeSql(statement, [1], function (stmt, result) {
                    resolve(result.rows.item(0).total);
                }, function (stmt, error) {
                    reject(error.message);
                });
            });
        });
    }

    static sumTotal() {
        return new Promise((resolve, reject) => {
            const statement = `SELECT SUM(quantity * amount) as total FROM ${this.table}`;
            this.database.transaction(tx => {
                tx.executeSql(statement, [], function (stmt, result) {
                    resolve(result.rows.item(0).total);
                }, function (stmt, error) {
                    reject(error.message);
                });
            });
        });
    }
}