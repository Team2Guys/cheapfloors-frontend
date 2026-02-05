export interface IUSER {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface LOGGEDIN_USER extends IUSER {
  userImageUrl?: ProductImage;
}
