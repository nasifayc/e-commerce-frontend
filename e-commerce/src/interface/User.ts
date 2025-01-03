export interface User {
  _id: string;
  username: string;
  email: string;
  profile_picture: string | null;
}

export interface ValidationError {
  type: string;
  value: string | undefined | null;
  msg: string;
  path: string;
  location: string;
}
