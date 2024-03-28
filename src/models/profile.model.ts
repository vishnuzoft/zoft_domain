export interface ProfileBody{
    first_name:string,
    last_name:string,
    company_name:string,
    email:string,
    address1:string,
    address2:string,
    city:string,
    state:string,
    post_code:string,
    country:string,
    country_code:string,
    mobile:string
}

export interface ProfileRequest  {
  params: {
    userId: string;
};
    body: ProfileBody;
  }
  export interface ProfileResponse {
    message: string;
    id: number;
    email: string;
    status: number;
    country_code:string;
    mobile:string;
    first_name:string,
    last_name:string,
    company_name:string,
    address1:string,
    address2:string,
    city:string,
    state:string,
    post_code:string,
    country:string,
  }