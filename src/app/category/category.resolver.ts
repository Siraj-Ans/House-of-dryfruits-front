import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CategoryDataStorageService } from './category-dataStorage.service';

export const categoryResolver: ResolveFn<Object> = (route, state) => {
  const categoryId = route.paramMap.get('id');
  return inject(CategoryDataStorageService).fetchCategory(categoryId!);
};
