import { HttpErrorResponse } from '@angular/common/http';
import { initial, forEach } from 'lodash';

export default class Tools {

    public static handleError(error: any, callback: (err) => Promise<any>): Promise<any> {
        console.error('An error occurred: ', error);
        return callback(error);
      }

    public static handleResult(res: Response, callback: (res) => Promise<any>): Promise<any> {
      return callback(res);
    }

    public static uriBuilder(params: Object): String {
      let uri: String = '?';

      forEach(Object.keys(params), (key, val) => {
        uri += key + '=' + val + ',';
      });

      uri = uri.substring(0, uri.length - 1);
      return uri;
    }
}
