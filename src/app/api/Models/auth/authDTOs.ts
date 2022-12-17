export interface loginDTO {
  login: string;
  password: string;
}

export interface authResponseDTO {
  Username: string,
  Token: string,
  TokenExpiration: number,
  RefreshToken: string,
  Message: string
}