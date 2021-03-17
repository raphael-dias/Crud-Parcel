import { Database } from 'sqlite3';
 
import { open } from 'sqlite';
 
export async function init() {
    const db = await open({
        filename: './database.db',
        driver: Database,
    });
 
    // CRIA A TABELA PESSOA CASO ELA NÃO EXISTA.
    await db.exec(`
        CREATE TABLE IF NOT EXISTS pessoa (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            nome      TEXT NOT NULL,
            sobrenome TEXT NOT NULL,
            apelido   TEXT NOT NULL UNIQUE
        )
    `);
 
    // A FUNÇÃO INIT() RETORNA O OBJETO DE CONEXÃO COM O BANCO DE DADOS.
    return db;
}