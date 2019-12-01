export interface BulkSmsModel  {
  from: From;
  to: Array<string>;
  routingGroup: string;
  encoding: string;
  longMessageMaxParts: number;
  body: string;
  userSuppliedId?: string;
  protocolId: string;
  messageClass: string;
  deliveryReports: string;
}

export interface From {
  type: string;
  address: string;
}

