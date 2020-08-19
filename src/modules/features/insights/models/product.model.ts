export class ProductModel {
  productId: string;
  category: string;
  subCategory: string;
  productName: string;
  price: number;
  quantity: number;

  constructor() {
    this.price = 0;
    this.quantity = 0;
  }
}