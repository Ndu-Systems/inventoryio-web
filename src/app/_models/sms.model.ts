import { From } from './bulk-sms.model';

export interface SmsModel {
  from: From;
  to: Array<string>;
  body: string;
}

