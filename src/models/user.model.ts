export interface user {
  email: string;
  password:string;
  confirm_password:string;
  password_hash: string;
  password_salt: string;
  country_code:string;
  mobile:string;
}

export interface User{
    user_id: number;
    email: string;
    country_code:string;
    mobile:string;
    password_hash: string;
    password_salt: string; 
}