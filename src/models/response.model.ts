export interface Response {
  message: string;
  status: number;
  data?: any;
}
export interface PasswordRes{
  message: string;
  status: number;
  token?: string;
}