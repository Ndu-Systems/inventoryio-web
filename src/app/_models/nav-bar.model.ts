
export interface NavModel {
  Icon?: any;
  Name: string;
  SecondaryName?: string;
  Link: string;
  showItem?: boolean;
  AddUrl?: string;
  ActiveIcon?: string;
  Active?: boolean;
  Style?: any;
  ShowModal?: boolean;
  More?: More[];
}

export interface More {
  Name: string;
  Link: string;
}