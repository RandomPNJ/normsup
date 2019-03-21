import { Injectable } from '@angular/core';

@Injectable()
export class BrowserStorageService {

      // Get requested localstorage data
      getLocalStorage(key: any) {
        return JSON.parse(localStorage.getItem(key));
      }

      // Set requested localstorage data
      setLocalStorage(key: any, object: any) {
        localStorage.setItem(key, JSON.stringify(object));
      }

      // Clear all data stored in localStorage
      clearLocalStorage() {
        localStorage.clear();
      }

      // Remove an item from localStorage for the given key
      removeItem(key: any) {
        localStorage.removeItem(key);
      }
}
