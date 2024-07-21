export interface loginDTO {
  login: string;
  password: string;
}

export interface authResponseDTO {
  message: string;
  userId: string;
  username: string;
  token: string;
  refreshToken: string;
}

export interface signupDTO {
  username: string;
  email: string;
  password: string;
  gdprAgree: boolean;
}

export interface refreshTokenDTO {
  refreshToken: string;
}
