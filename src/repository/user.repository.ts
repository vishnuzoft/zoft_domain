import {
  PoolClient, QueryResult,
} from 'pg';

import {
  registerBody,
  User
} from '../models';

class UserRepository {
  static async createUser(
    client: PoolClient,
    user: registerBody,
    token:string,
  ): Promise<User> {
    try {
      const result = await client.query(
          "INSERT INTO tbl_user_account(email, password_hash, password_salt,token, country_code, mobile) VALUES($1, $2, $3, $4, $5,$6) RETURNING user_id, email, password_hash, password_salt, country_code, mobile",
          [user.email, user.password_hash, user.password_salt, token,user.country_code, user.mobile]
        );
    console.log(result.rows);
    
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
  static async findUserByEmail(
    client: PoolClient,
    email: string
  ): Promise<QueryResult> {
    try {
      const existUser = await client.query(
        "SELECT user_id,email,password_hash,password_salt FROM tbl_user_account WHERE email = $1",
        [email]
      );
      return existUser;
    } catch (error) {
      throw error;
    }
  }
  static async findUserById(
    client: PoolClient,
    userId: number
  ): Promise<QueryResult> {
    try {
      const user = await client.query(
        "SELECT user_id,email,password_hash,password_salt FROM tbl_user_account WHERE user_id = $1",
        [userId]
      );
      return user;
    } catch (error) {
      throw error;
    }
  }
}
export { UserRepository };
