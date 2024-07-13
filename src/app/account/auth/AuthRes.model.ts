export interface LoginUserResponse {
  message: string;
  user: {
    _id: string;
    __v: number;
    userName: string;
    emailAddress: string;
    password: string;
  };
  token: string;
  expiresIn: number;
}

export interface SignUpUserResponse {
  message: string;
  user: {
    _id: string;
    __v: number;
    userName: string;
    emailAddress: string;
  };
}
