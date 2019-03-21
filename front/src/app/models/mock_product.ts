import { Product, Inputs } from './Product';

export const Mock_Product: Product[] = [
    {
        RefSpec: 'AAA',
        RefProd: 'BBB',
        VIN: 'CCC',
        Owner: 'Yassin',
        Facility: 'Douay',
        Description: 'A ramdom mock',
        Label: 'Label ZZ',
        SerialNum: 'ABCDEFG',
        BatchNum: '1213V21',
        Inputs: Inputs.Action
    },
    {
        RefSpec: 'ZEA',
        RefProd: 'BEA',
        VIN: 'ded',
        Owner: 'Jordan',
        Facility: 'Douay',
        Description: 'A ramdom mock two',
        Label: 'Label DEZ',
        SerialNum: 'EDEE',
        BatchNum: '2DEED1DZA',
        Inputs: Inputs.Raw
    },
    {
        RefSpec: 'EAZO',
        RefProd: 'FEZZ',
        VIN: 'FEEZ',
        Owner: 'Hamza',
        Facility: 'Douay',
        Description: 'A ramdom mock three',
        Label: 'Label DEDEZ',
        SerialNum: 'EDEZ',
        BatchNum: '23EF22E',
        Inputs: Inputs.Action
    },
];
