export interface Config {
    ConfigId?: number;
    CompanyId: string;
    Name: string;
    Type?: string;
    Label: string;
    Value: string;
    IsRequired: boolean;
    FieldType: string;
    CreateDate?: string;
    CreateUserId: string;
    ModifyDate?: string;
    ModifyUserId: string;
    StatusId: number;
}


// init new bank

export function newBankArray(companyId: string): Config[] {
    return [
        {
            CompanyId: companyId,
            Name: 'bankname',
            Label: 'BANK NAME',
            Type: 'bank',
            Value: ' ',
            IsRequired: true,
            FieldType: 'string',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        },
        {
            CompanyId: companyId,
            Name: 'accountnumber',
            Label: 'account number',
            Type: 'bank',
            Value: ' ',
            IsRequired: true,
            FieldType: 'string',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        },
        {
            CompanyId: companyId,
            Name: 'branchname',
            Label: 'branch name',
            Type: 'bank',
            Value: ' ',
            IsRequired: true,
            FieldType: 'string',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        },
        {
            CompanyId: companyId,
            Name: 'acountholder',
            Label: 'Account Holder',
            Type: 'bank',
            Value: ' ',
            IsRequired: true,
            FieldType: 'string',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        },
        {
            CompanyId: companyId,
            Name: 'reference',
            Label: 'reference',
            Type: 'bank',
            Value: ' ',
            IsRequired: true,
            FieldType: 'string',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        }
    ];
}