import { PoolClient } from "pg";
import { ResetPasswordToken } from "../models";

class TokenRepository{
    static async createResetPasswordToken(client: PoolClient, user_id: string, token: string, expiresAt: Date): Promise<void> {
        try {
          const result = await client.query(
            "UPDATE tbl_user_account SET password_recovery_token = $1, recovery_token_time = $2 WHERE user_id = $3 RETURNING *",
        [token, expiresAt, user_id]
          );
          console.log(result.rows[0],'dbresult');
          
          return result.rows[0];
        } catch (error) {
          throw error;
        }
      }
      static async findResetPasswordToken(client: PoolClient, token: string) {
        try {
          const result= await client.query("SELECT * FROM tbl_user_account WHERE password_recovery_token = $1 LIMIT 1",
        [token])
          return result.rows[0]
        } catch (error) {
          throw error
        }
      }
      static async invalidateResetPasswordToken(client: PoolClient, user_id: string): Promise<void> {
        try {
            await client.query(
                "UPDATE tbl_user_account SET password_recovery_token = NULL, recovery_token_time = NULL WHERE user_id = $1",
                [user_id]
            );
        } catch (error) {
            throw error;
        }
    }
}

export {TokenRepository};