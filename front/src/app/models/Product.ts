// Model for a product

export class Product {

    public RefSpec: string;
    public RefProd: string;
    public VIN: string;
    public Owner: string;
    public Facility: string;
    public Description: string;
    public Label: string;
    public SerialNum: string;
    public BatchNum: string;
    public Inputs: Inputs;


}

export enum Inputs {
    Action = 'INPUT_ACTION',
    Raw = 'INPUT_RAW',
    Product = 'INPUT_PRODUCT',
}
