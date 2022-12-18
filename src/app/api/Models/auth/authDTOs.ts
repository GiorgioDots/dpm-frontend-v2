export interface loginDTO {
  login: string;
  password: string;
}

export interface authResponseDTO {
  Username: string;
  Token: string;
  TokenExpiration: number;
  RefreshToken: string;
  Message: string;
}

export interface signupDTO {
  username: string;
  email: string;
  password: string;
  gdprAgree: boolean;
}

export interface refreshTokenDTO {
  RefreshToken: string;
}
