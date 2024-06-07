import { QueryResult } from 'pg';
import {
  begin,
  client,
  commit,
  environment,
  release,
  rollback,
  transporter,
} from '../config';
import {
  AuthenticatedRequest,
  loginRequest,
  loginResponse,
  PasswordReq,
  ProfileBody,
  ProfileReq,
  ProfileRequest,
  ProfileResponse,
  registerReq,
  RegistrationResponse,
  User,
  user,
  userLoginData,
} from '../models';
import {
  TokenRepository,
  AuthRepository,
} from '../repository';
import {
  customError,
  validation,
  hashPassword,
  generateSalt,
  comparePasswords,
  generateToken,
  createResetPasswordToken,
  sendResetPasswordEmail,
  emailSenderTemplate
} from '../utility';
import { sendSms } from '../utility/smsSender';

const jwt = require('jsonwebtoken');

class AuthService {
  static async registerUser(req: registerReq): Promise<RegistrationResponse> {
    const dbClient = await client();
    try {
      const { email, country_code, mobile, password, confirm_password } = req.body;
      
      console.log('Received data:', req.body);

      // const mobileInt = parseInt(mobile, 10);
      // if (isNaN(mobileInt)) {
      //   throw new customError("Invalid mobile number format", 400);
      // }

      const valid = validation("register", req.body);

      if (password !== confirm_password) {
        throw new customError("Passwords do not match", 400);
      }

      const passwordSalt = generateSalt();
      const passwordHash = hashPassword(password, passwordSalt);

      await begin(dbClient);
      const existingUser = await AuthRepository.findUserByEmail(dbClient, email);
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


      const result = await AuthRepository.RegisterUser(dbClient, user, token);
      const emailData = {};
      const content = "Successfully Registered";
      const mailOptions = emailSenderTemplate(
        result.email,
        content,
        "registrationEmail.ejs",
        emailData
      );
      await transporter.sendMail(mailOptions);

      const currentDatetime = new Date();
      const formattedDatetime = currentDatetime
        .toISOString()
        .replace('T', ' ')
        .replace(/\.\d+Z$/, '');
      const smsTo = `${result.country_code}${result.mobile}`;
      const smsText = `Welcome to Zoftdomain,Registration successful.`;
      await sendSms(smsTo, smsText, formattedDatetime);
      console.log("sms", smsTo);
      console.log(formattedDatetime);

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
      const userResult: any = await AuthRepository.findUserByEmail(
        dbClient,
        payload.email
      );
      if (userResult.rows.length === 0) {
        throw new customError(`User not found`, 400);
      }
      const userData: User = userResult.rows[0];
      const userDetailsResult = await AuthRepository.findUserById(
        dbClient,
        userData.user_id
      );
      const userDetails: userLoginData = userDetailsResult.rows[0];
console.log("sdfsfdsf",userDetails.user_id);

      if (
        !comparePasswords(
          payload.password,
          userData.password_hash,
          userData.password_salt
        )
      ) {
        throw new customError("Password incorrect", 400);
      }
      const token_secret = environment.JWT_SECRET;
      const accessToken = jwt.sign(
        { user_id: userDetails.user_id },
        token_secret,
        { expiresIn: "24h" }
      );
//console.log(accessToken);

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
  static async setUserProfile(req: AuthenticatedRequest): Promise<ProfileResponse> {
    
    const dbClient = await client();
    try {
      const { first_name,
        last_name,
        company_name,
        email,
        address1,
        address2,
        city,
        state,
        post_code,
        country,
        country_code,
        mobile } = req.body;

        const user_id: string = req.user_id as string;
      const valid = validation("profile", req.body);
      console.log("dsdsadsads",user_id);
      
      await begin(dbClient);

      const profile: ProfileBody = {
        first_name,
        last_name,
        company_name,
        address1,
        address2,
        city,
        state,
        post_code,
        country,
        email,
        country_code,
        mobile,
      };
      console.log(profile);

      const result = await AuthRepository.setUserProfile(dbClient,user_id,profile);

      await commit(dbClient);

      return {
        message: "Profile Created successfully!",
        user_id:user_id,
        profile_id: result.profile_id,
        first_name: result.first_name,
        last_name: result.last_name,
        company_name: result.company_name,
        address1: result.address1,
        address2: result.address2,
        email: result.email,
        status: 200,
        country: country,
        country_code: result.country_code,
        mobile: result.mobile,
        city: result.city,
        state: result.state,
        post_code: result.post_code
      };
    } catch (error) {
      throw error
    } finally {
      release(dbClient)
    }
  }
  static async getUserProfileById(req: ProfileReq): Promise<ProfileResponse> {
    const dbClient = await client();
    try {
      const profileId = req.params.profile_id as string;
      console.log(profileId);
      const userProfileResult = await AuthRepository.findUserProfileById(dbClient, profileId);
      const userProfile = userProfileResult.rows[0];
      if (!userProfile) {
        throw new customError("User profile not found", 404);
      }
      return userProfile;
    } catch (error) {
      throw error;
    } finally {
      release(dbClient);
    }
  }
  static async forgotPassword(req: PasswordReq): Promise<any> {
    const dbClient = await client();
    try {
      const email = req.body.email;
      const user = await AuthRepository.findUserByEmail(dbClient, email);
      if (!user) {
        throw new customError("User Not Found With Given Email", 404);
      }

      const user_id = user.rows[0].user_id;
      const resetToken = createResetPasswordToken();
      const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
  
      await TokenRepository.createResetPasswordToken(dbClient, user_id, resetToken, expiresAt);
  
      const resetUrl = `${environment.FRONTEND_URL}/reset-password/${resetToken}`;
      console.log(resetUrl);
      
      await sendResetPasswordEmail(user.rows[0].email, resetUrl);
  
      return { message: "Reset password link sent to your email" };
    } catch (error) {
      throw error;
    } finally {
      release(dbClient);
    }
  }
}
export { AuthService }
