import { Pool, RowDataPacket } from "mysql2/promise";
import { User } from "../models/user.models";

interface IUserRepository {
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<User>;
    addRoleToUser(userId: number, roleName: string): Promise<void>
    removeRoleFromUser(userId: number, roleName: string): Promise<void>;
    getUserRoles(userId: number): Promise<Array<string>>
}

export class UserRepository implements IUserRepository {
    private database: Pool;

    constructor(database: Pool) {
        this.database = database;
    }

  async findById(id: number): Promise<User | null> {
    const [rows] = await this.database.execute<RowDataPacket[]>(
        "SELECT * FROM utilisateur WHERE user_id = ?",
        [id]
    );
    const row = rows[0];
    if (!row) return null;

    return {
        id: row.user_id,
        lastname: row.lastname,
        firstname: row.firstname,
        email: row.email,
        password: row.password,
        telephone: row.telephone,
        adress: row.adress,
        birthdate: row.birthdate,
        photo: row.photo,
        pseudo: row.pseudo,
       
    } as User;
}

    async create(user: User): Promise<User> {
       const [result] = await this.database.execute("INSERT INTO utilisateur(lastname,firstname, email,password,telephone,adress, birthdate,photo,pseudo) VALUES(?,?,?,?,?,?,?,?,?)",
       [user.lastname, user.firstname, user.email, user.password, user.telephone, user.adress, user.birthdate, user.photo, user.pseudo]);
       
    const id = (result as any).insertId;

     await this.database.execute(
        "INSERT INTO possede(user_id, role_id) VALUES(?, (SELECT role_id FROM role WHERE role_nom = 'passager'))",
        [id]
    );
    return {
        ...user,
        id, 
    };
    }


    async findByEmail(email: string): Promise<User | null> {
    const [rows] = await this.database.execute("SELECT * FROM utilisateur WHERE email = ?", [email]);
    console.log("Résultat de findByEmail :", rows);
    return (rows as User[])[0] || null;
}

async addRoleToUser(userId: number, roleName: string): Promise<void> {
    await this.database.execute(
        `INSERT INTO possede(user_id, role_id)
         SELECT ?, role_id FROM role WHERE role_nom= ?`,
        [userId, roleName]
    );
}

async removeRoleFromUser(userId: number, roleName: string): Promise<void> {
    await this.database.execute(
        `DELETE FROM possede
         WHERE user_id = ? AND role_id = (SELECT role_id FROM role WHERE role_nom = ?)`,
        [userId, roleName]
    );
}

async getUserRoles(userId: number): Promise<string[]> {
    const [rows] = await this.database.execute<RowDataPacket[]>(
        `SELECT r.role_nom
         FROM possede p
         JOIN role r ON p.role_id = r.role_id
         WHERE p.user_id = ?`,
        [userId]
    );

    return rows.map((row) => row.role_nom);
}
}