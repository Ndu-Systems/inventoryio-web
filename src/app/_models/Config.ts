export interface Config {
    ConfigId: string;
    CompanyId: string;
    Name: string;
    Type?: string;
    GroupKey: string;
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
            ConfigId: '',
            CompanyId: companyId,
            Name: 'bankname',
            Label: 'BANK NAME',
            Type: 'bank',
            GroupKey: '',
            Value: ' ',
            IsRequired: true,
            FieldType: 'string',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        },
        {
            ConfigId: '',
            CompanyId: companyId,
            Name: 'accountnumber',
            Label: 'account number',
            Type: 'bank',
            GroupKey: '',
            Value: ' ',
            IsRequired: true,
            FieldType: 'string',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        },
        {
            ConfigId: '',
            CompanyId: companyId,
            Name: 'branchname',
            Label: 'branch name',
            Type: 'bank',
            GroupKey: '',
            Value: ' ',
            IsRequired: true,
            FieldType: 'string',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        },
        {
            ConfigId: '',
            CompanyId: companyId,
            Name: 'acountholder',
            Label: 'Account Holder',
            Type: 'bank',
            GroupKey: '',
            Value: ' ',
            IsRequired: true,
            FieldType: 'string',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        }

    ];
}
// init new bank

export function newAddressArray(companyId: string): Config[] {
    return [
        {
            ConfigId: '',
            CompanyId: companyId,
            Name: 'addressline1',
            Label: 'address line1',
            Type: 'address',
            GroupKey: '',
            Value: ' ',
            IsRequired: true,
            FieldType: 'string',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        },
        {
            ConfigId: '',
            CompanyId: companyId,
            Name: 'addressline2',
            Label: 'address line2',
            Type: 'address',
            GroupKey: '',
            Value: ' ',
            IsRequired: true,
            FieldType: 'string',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        },
        {
            ConfigId: '',
            CompanyId: companyId,
            Name: 'addressline3',
            Label: 'addressline3',
            Type: 'address',
            GroupKey: '',
            Value: ' ',
            IsRequired: false,
            FieldType: 'string',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        },
        {
            ConfigId: '',
            CompanyId: companyId,
            Name: 'email',
            Label: 'Email Address',
            Type: 'address',
            GroupKey: '',
            Value: ' ',
            IsRequired: true,
            FieldType: 'string',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        },
        {
            ConfigId: '',
            CompanyId: companyId,
            Name: 'phone',
            Label: 'Contact Number',
            Type: 'address',
            GroupKey: '',
            Value: ' ',
            IsRequired: true,
            FieldType: 'string',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        }

    ];
}



// init colors

export function newColorsArray(companyId: string): Config[] {
    return [
        {
            ConfigId: '',
            CompanyId: companyId,
            Name: 'bgcolor',
            Label: 'Background Color',
            Type: 'logocolors',
            GroupKey: '',
            Value: ' ',
            IsRequired: true,
            FieldType: 'string',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        },
        {
            ConfigId: '',
            CompanyId: companyId,
            Name: 'fontcolor',
            Label: 'Font Color',
            Type: 'logocolors',
            GroupKey: '',
            Value: ' ',
            IsRequired: true,
            FieldType: 'string',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        }

    ];
}


// init colors

export function newShippingArray(companyId: string): Config[] {
    return [
        {
            ConfigId: '',
            CompanyId: companyId,
            Name: 'name',
            Label: 'Shipping Method Name',
            Type: 'shipping',
            GroupKey: 'shipping1',
            Value: ' ',
            IsRequired: true,
            FieldType: 'string',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        },
        {
            ConfigId: '',
            CompanyId: companyId,
            Name: 'amount',
            Label: 'Shipping Amount',
            Type: 'shipping',
            GroupKey: 'shipping1',
            Value: ' ',
            IsRequired: true,
            FieldType: 'string',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        },
        {
            ConfigId: '',
            CompanyId: companyId,
            Name: 'notes',
            Label: 'Shipping Notes',
            Type: 'shipping',
            GroupKey: 'shipping1',
            Value: ' ',
            IsRequired: true,
            FieldType: 'string',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        },
        {
            ConfigId: '',
            CompanyId: companyId,
            Name: 'notes',
            Label: 'Shipping Notes',
            Type: 'shipping',
            GroupKey: 'shipping1',
            Value: ' ',
            IsRequired: true,
            FieldType: 'action',
            CreateUserId: 'system',
            ModifyUserId: 'system',
            StatusId: 1
        }
    ];
}


