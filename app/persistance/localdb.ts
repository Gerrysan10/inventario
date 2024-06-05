import SQLite from 'react-native-sqlite-storage';

export default class localDB {
  static connect() {
    return SQLite.openDatabase({ name: 'inventario' });
  }

  static async init() {
    const db = await localDB.connect();
    db.transaction(tx => {
        // Crear tabla productos
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre VARCHAR(64) NOT NULL,
            precio DECIMAL(10,2) NOT NULL DEFAULT 0.0,
            minStock INTEGER NOT NULL DEFAULT 0,
            currentStock INTEGER NOT NULL DEFAULT 0,
            maxStock INTEGER NOT NULL DEFAULT 0
            );`,
            [],
            () => console.log('CREATED TABLE productos'),
            error => console.error('Error creating table productos', error)
        );
        // Crear tabla movimientos
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS movimientos (
            idmovimiento INTEGER PRIMARY KEY AUTOINCREMENT,
            idproducto INTEGER NOT NULL,
            fecha_hora DATETIME NOT NULL DEFAULT (datetime('now', 'localtime')),
            cantidad INTEGER NOT NULL,
            tipomovimiento VARCHAR(10) NOT NULL
            );`,
            [],
            () => console.log('CREATED TABLE movimientos'),
            error => console.error('Error creating table movimientos', error)
        );
    });
}

}
