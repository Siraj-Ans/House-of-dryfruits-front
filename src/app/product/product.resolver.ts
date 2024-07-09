import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductDataStorageService } from './product-dataStorage.service';

export const productResolver: ResolveFn<Object> = (route, state) => {
  const productId = route.paramMap.get('id');
  return inject(ProductDataStorageService).fetchProduct(productId!);
};
