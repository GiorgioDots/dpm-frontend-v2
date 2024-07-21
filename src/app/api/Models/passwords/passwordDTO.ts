import { messageDTO } from '../messageDTO';

export interface passwordDTO {
  _id?: string;
  url?: string;
  login?: string;
  secondLogin?: string;
  notes?: string;
  name?: string;
  password?: string;
  preferred?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface createPasswordResponseDTO extends messageDTO {
  id?: string;
}

export interface exportPasswordDTO {
  domain: string;
  login: string;
  secondLogin: string;
  note: string;
  title: string;
  password: string;
}

export interface exportPasswordsDTO {
  AUTHENTIFIANT: exportPasswordDTO[];
}
