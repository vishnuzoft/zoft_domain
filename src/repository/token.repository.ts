import { PoolClient } from "pg";
import { ResetPasswordToken } from "../models";

class TokenRepository{
    static async createResetPasswordToken(client: PoolClient, user_id: string, token: string, expiresAt: Date): Promise<void> {
        try {
          const result = await client.query(
            "UPDATE tbl_user_account SET password_recovery_token = $1, recovery_token_time = $2 WHERE user_id = $3",
        [token, expiresAt, user_id]
            // "INSERT INTO tbl_reset_password_tokens (user_id, token, created_at, expires_at) VALUES ($1, $2, $3, $4) RETURNING *",
            // [user_id, token, new Date(), expiresAt]
          );
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
}

export {TokenRepository};