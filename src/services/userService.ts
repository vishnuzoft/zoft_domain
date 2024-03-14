import {
  begin,
  client,
  commit,
  environment,
  release,
  rollback,
} from '../config';
import {
  loginRequest,
  loginResponse,
  registerReq,
  RegistrationResponse,
  User,
  user,
  userLoginData,
} from '../models';
import {
  UserRepository,
} from '../repository';
import {
  customError,
  validation,
  hashPassword,
  generateSalt,
  comparePasswords,
  generateToken
} from '../utility';

const jwt =require('jsonwebtoken');

class UserService {
  static async registerUser(req: registerReq): Promise<RegistrationResponse> {
    const dbClient = await client();
    try {
      const { email, country_code, mobile, password, confirm_password } = req.body;
      const valid = validation("register", req.body);

      if (password !== confirm_password) {
        throw new customError("Passwords do not match", 400);
      }

      const passwordSalt = generateSalt();
      const passwordHash = hashPassword(password, passwordSalt);

      await begin(dbClient);
      const existingUser = await UserRepository.findUserByEmail(dbClient, email);
      if (existingUser.rows.length > 0) {
        throw new customError(`Email '${email}' is already registered.`, 400);
      }

      const user: user = {
        email,
        country_code,
        mobile,
        password,
        confirm_password,
        password_salt: passwordSalt,
        password_hash: passwordHash,
      };

      const token = generateToken(32);

      
      const result = await UserRepository.createUser(dbClient, user,token);
      
      await commit(dbClient);
      return {
        message: "Successfully Registered",
        id: result.user_id,
        email: result.email,
        status: 200,
        country_code: result.country_code,
        mobile: result.mobile,
      };
    } catch (error) {
      await rollback(dbClient);
      throw error;
    } finally {
      release(dbClient);
    }
  }
  static async loginUser(req: loginRequest): Promise<loginResponse> {
    const dbClient = await client();
    const payload = {
      email: req.body.email,
      password: req.body.password,
    };

    try {
      const valid = validation("login", req.body);
      const userResult: any = await UserRepository.findUserByEmail(
        dbClient,
        payload.email
      );
      if (userResult.rows.length === 0) {
        throw new customError(`User not found`, 400);
      }
      const userData: User = userResult.rows[0];
      const userDetailsResult = await UserRepository.findUserById(
        dbClient,
        userData.user_id
      );
      const userDetails: userLoginData = userDetailsResult.rows[0];
      
      if (
        !comparePasswords(
          payload.password,
          userData.password_hash,
          userData.password_salt
        )
      ) {
        throw new customError("Password incorrect", 400);
      }
      const token_secret = process.env.jwt_secret;
      const accessToken = jwt.sign(
        { userId: userDetails.id },
        token_secret,
        { expiresIn: "24h" }
      );

      return {
        message: "Successfully logged in",
        status: 200,
        id: userData.user_id,
        email: userData.email,
        token: accessToken,
      };
    } catch (error) {
      throw error;
    } finally {
      release(dbClient);
    }
}
}
export {UserService}