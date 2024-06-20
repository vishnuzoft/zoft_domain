import {
  PoolClient, QueryResult,
} from 'pg';

import {
  ProfileBody,
  ProfileResponse,
  registerBody,
  UpdatePassword,
  UpdateUser,
  User
} from '../models';

class AuthRepository {
  static async RegisterUser(
    client: PoolClient,
    user: registerBody,
    token: string,
  ): Promise<User> {
    try {
      const result = await client.query(
        "INSERT INTO tbl_user_account(email, password_hash, password_salt,token, country_code, mobile) VALUES($1, $2, $3, $4, $5,$6) RETURNING user_id, email, password_hash, password_salt, country_code, mobile",
        [user.email, user.password_hash, user.password_salt, token, user.country_code, user.mobile]
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
    user_id: string
  ): Promise<QueryResult> {
    try {
      const user = await client.query(
        "SELECT user_id,email FROM tbl_user_account WHERE user_id = $1",
        [user_id]
      );
      return user;
    } catch (error) {
      throw error;
    }
  }
  static async setUserProfile(client: PoolClient,user_id: string, profile: ProfileBody): Promise<ProfileResponse> {
    try {
      const result = await client.query(
        "INSERT INTO tbl_user_profile(user_id,first_name,last_name,company_name,email,address1,address2,city,state,post_code,country,country_code,mobile) VALUES($1, $2, $3, $4, $5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *",
        [user_id,
        profile.first_name,
        profile.last_name,
        profile.company_name,
        profile.email,
        profile.address1,
        profile.address2,
        profile.city,
        profile.state,
        profile.post_code,
        profile.country,
        profile.country_code,
        profile.mobile]
      );
      //console.log(result.rows);

      return result.rows[0];
    } catch (error) {
      throw error
    }
  }
  static async findUserProfileById(
    client: PoolClient,
    profileId: string
): Promise<QueryResult> {
    try {
        const userProfile = await client.query(
            "SELECT * FROM tbl_user_profile WHERE profile_id = $1",
            [profileId]
        );
        return userProfile;
    } catch (error) {
        throw error;
    }
}
static async updateUserPassword(client: PoolClient, dataLatest:UpdateUser):Promise<QueryResult> {
  try {
    const result = await client.query("UPDATE tbl_user_account SET password_hash = $1,password_salt = $2 WHERE user_id = $3 RETURNING user_id,email",[dataLatest.password_hash,dataLatest.password_salt,dataLatest.user_id])
    return result;
  } catch (error) {
    throw error
  }
}
}
export { AuthRepository };
