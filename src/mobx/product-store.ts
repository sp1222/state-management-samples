import { Product } from "@/types/cart-and-products";
import { toggleProductDisabled, initProductList } from "@/utils/product-actions";
import { makeObservable, observable, computed, action } from "mobx";

class ProductStore {
  loading: boolean = true;
  productList: Product[] = [];

  constructor() {
    makeObservable(this, {
      loading: observable,
      productList: observable,
      toggleDisabled: computed,
      initializeProducts: action,
    });
    this.initializeProducts();
  }

  get toggleDisabled(): (id: number, disabled: boolean) => void {
    return (id, disabled) => {
      this.productList = toggleProductDisabled(this.productList, id, disabled);
    };
  }

  async initializeProducts() {
    this.loading = true;
    const products = await initProductList();
    this.productList = products as Product[];
    this.loading = false;
  }
}

export const productStore = new ProductStore();