import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {BrowserStorageService} from './storageService';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from './product.service';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  isSearching$ = new Subject<boolean>();

  selectIdNum$ = new Subject<PartSelectionModel>();
  selectProduct$ = new Subject<ProductSelectionModel>();
  products$ = new Subject<LightProductModel[]>();

  private products: LightProductModel[];
  private selectedIdNum: string;
  private _selectedProduct: ProductSelectionModel;
  private searchResults;

  private currentQueryParams;
  readonly currentUser;
  readonly isRenault;

  constructor(
    private bsService: BrowserStorageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currentUser = this.bsService.getLocalStorage('current_user');
    this.isRenault = this.currentUser.company === 'Renault';
    if (this.currentUser === null) {
      this.router.navigate(['login']);
    }
    // this.isValidator = this.currentUser.roles[0] === 'Validator';
  }

  setSearchResults(value) {
    this.searchResults = value;
    this.products = this._processSidebarData(this.searchResults);
    this.products$.next(this.products);

    // Initialize if not specified
    if (!this.selectedIdNum && this.products.length) {
      this.selectedIdNum = this.products[0].details.idNum;
    }

    this.selectProductByIdNum(this.selectedIdNum);
  }

  // TODO refactor both
  pushSearchResults(value) {
    this.searchResults = this.searchResults.concat(value);
    this.products = this.products.concat(this._processSidebarData(value));

    this.products$.next(this.products);
  }

  get selectedProduct() {
    return this._selectedProduct;
  }

  set selectedProduct(value) {
    this.selectedIdNum = value.part.idNum;
    this._selectedProduct = value;
    this.selectProduct$.next(value);
  }

  setCurrentQueryParam(value) {
    this.currentQueryParams = value;
  }

  resetIdNum() {
    this.selectedIdNum = null;
  }

  selectProductByIdNum(idNum) {
    // Select nothing when they are no products
    if (!this.products.length) { return; }

    const product = this.products.find(p => p.details.idNum === idNum.toUpperCase());

    // Get the first product of the list
    if (product === undefined) {
      this.selectProductByIdNum(this.products[0].details.idNum);
      return;
    }

    this.selectProduct({
      idNum: product.details.idNum,
      car: this.isRenault ? product.name : null,
      partNumberF: this.isRenault ? null : product.name,
      parents: product.details.upperParents
    });
    this.selectIdNum$.next({ idNum: idNum.toUpperCase() });
  }

  selectProduct(part) {
    this.selectedIdNum = part.idNum;
    if (!part.parents) { return; }

    this.router.navigate(['/results'], {
      relativeTo: this.route,
      queryParams: { select: part.idNum },
      queryParamsHandling: 'merge' });

    const product = this._findProduct(part);

    this.selectedProduct = { product: product, part: part };
  }

  /* Helpers */

  private _findProduct(part) {
    // Renault
    if (part.car || part.car === '') {
      const prods = this.searchResults.find(element =>
        element.car.dapji === part.car
      );

      // Case where a part does not belong to any car
      if (prods instanceof Array) {
        return prods.find(e =>
          e.products.find(p => p.product.idNum === part.idNum)
        );
      }
      return prods;
    }

    // Other suppliers
    return this.searchResults.find(e =>
      e.products.find(p => p.product.idNum === part.idNum)
    );
  }

  // Prepare data for side bar
  private _processSidebarData(data) {
    if (data === undefined) { return []; }
    let result = (this.isRenault) ? this._setRenaultData(data) : this._setSupplierData(data);

    // Filter result for idNum searches
    if (this.currentQueryParams.idNum) {
      result = result.filter(prod =>
        prod.details.idNum === this.currentQueryParams.idNum.toUpperCase()
      );
    }

    // Filter result for part number R
    if (this.currentQueryParams.partNumberR) {
      result = result.filter(prod =>
        prod.details.partNumberR === this.currentQueryParams.partNumberR
      );
    }

    // Remove duplicates, if any
    return _.uniqBy(result, 'details.idNum');
  }

  // TODO: refactor code here
  private _setRenaultData(data) {
    const result = [];
    let prod;
    let isDefault = true;

    data.forEach(element => {
      isDefault = true;

      // Case where a product is created without a car
      if (!element.car.inputChilds.length) {
        element.products.forEach(p => {
          result.push({
            'name': '',
            'details': p.product
          });
        });
        return;
      }

      // Case where we look for a part number
      if (this.currentQueryParams.partNumberR) {
        isDefault = false;
        prod = element.products.filter(e =>
          e.product.partNumberR === this.currentQueryParams.partNumberR
        );
      }

      // Case where we look for a specific idNum
      if (this.currentQueryParams.idNum) {
        isDefault = false;
        prod = element.products.filter(e =>
          e.product.idNum === this.currentQueryParams.idNum.toUpperCase()
        );
      }

      if (!isDefault) {
        prod.forEach(p => {
          result.push({
            'name': element.car.dapji,
            'details': p.product
          });
        });
        return;
      }

      // Default case : only display car input children
      element.car.inputChilds.forEach(childId => {
        prod = element.products.find(e =>
          e.product.idNum === childId
        );

        if (prod !== undefined) {
          result.push({
            'name': element.car.dapji,
            'details': prod.product
          });
        }
      });
    });
    return result;
  }

  private _setSupplierData(data) {
    const result = [];
    if (!data.length || !data[0].products.length) { return result; }

    data.forEach(element => {
      element.products.forEach(prod => {
        result.push({
          'name': prod.product.partNumberF,
          'details': prod.product
        });
      });
    });
    return result;
  }
}

export interface PartSelectionModel {
  idNum: string;
  car?: string | null;
  partNumberF?: string | null;
  parents?: any[];
}

export interface ProductSelectionModel {
  part: any;
  product: ProductModel;
}

export interface ProductModel {
  products: any[];
  car?: any;
}

export interface LightProductModel {
  name: string;
  details: any;
}
