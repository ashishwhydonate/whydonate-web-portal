import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders,
	HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { environment } from 'src/environments/environment';

/**
 * This class takes care of API requests, responses and errors.
 */

@Injectable({
	providedIn: 'root',
})
export class APIService {
	API_URL: string = environment.apiUrl;
	ACCOUNT_API_V2: string = environment.ACCOUNT_API_V2;
	Search_API: string = environment.search_url;
	fundraiser_url : string = environment.fundraiser_url;
	constructor(
		public http: HttpClient,
		public _notificationService: NotificationService
	) {
		this.handleError = this.handleError.bind(this);
	}

	/**
	 * Function For GET API requests
	 * @param path
	 * @param params
	 * @returns
	 */
	get(path: string, body: Object = {}, headers?: HttpHeaders): Observable<any> {
		if (headers != undefined) {
			let params = new HttpParams();
			params = params.append('slug', body.toString());
			return this.http.get(this.API_URL + path, {
				headers: headers,
				params: params,
			});
		} else {
			return this.http.get(this.API_URL + path, body);
		}
	}
	tempGet(
		path: string,
		body: Object = {},
		headers?: HttpHeaders
	): Observable<any> {
		if (headers != undefined) {
			let params = new HttpParams();
			params = params.append('slug', body.toString());
			return this.http.get(this.ACCOUNT_API_V2 + path, {
				headers: headers,
				params: params,
			});
		} else {
			return this.http.get(this.ACCOUNT_API_V2 + path, body);
		}
	}
	/**
	 * Function For GET API requests for fundraiser url
	 * @param path
	 * @param params
	 * @returns
	 */
	tempGetNew(
		path: string,
		body: Object = {},
		headers?: HttpHeaders
	): Observable<any> {
		if (headers != undefined) {
			let params = new HttpParams();
			params = params.append('slug', body.toString());
			return this.http.get(this.fundraiser_url + path, {
				headers: headers,
				params: params,
			});
		} else {
			return this.http.get(this.fundraiser_url + path, body);
		}
	}

	searchGet(
		path: string,
		body: Object = {},
		headers?: HttpHeaders
	): Observable<any> {
		if (headers != undefined) {
			let params = new HttpParams();
			params = params.append('slug', body.toString());
			return this.http.get(this.Search_API + path, {
				headers: headers,
				params: params,
			});
		} else {
			return this.http.get(this.Search_API + path, body);
		}
	}
	/**
	 * Function For POST API requests
	 * @param path
	 * @param body
	 * @returns
	 */
	post(
		path: string,
		body: Object = {},
		headers?: HttpHeaders
	): Observable<any> {
		if (headers != undefined) {
			return this.http.post(this.API_URL + path, JSON.stringify(body), {
				headers: headers,
			});
		} else {
			return this.http.post(
				this.API_URL + path,
				JSON.parse(JSON.stringify(body))
			);
		}
	}

	/**
	 * Function For POST API requests for V2 API
	 * @param path
	 * @param body
	 * @returns
	 */
	tempPost(path: string, body: Object = {}): Observable<any> {
		let headers = new HttpHeaders({
			'content-type': 'text/plain',
		});
		// return this.http.post(path, body, { headers: headers });
		if (headers != undefined) {
			return this.http.post(path, JSON.stringify(body), {
				headers: headers,
			});
		} else {
			return this.http.post(path, JSON.parse(JSON.stringify(body)));
		}
	}

	/**
	 * New Function For POST API requests for V2 API (No need to provide full uri)
	 * @param path
	 * @param body
	 * @returns
	 */
	tempPostNew(
		path: string,
		body: Object = {},
		headers?: HttpHeaders
	): Observable<any> {
		if (headers != undefined) {
			return this.http.post(this.fundraiser_url + path, JSON.stringify(body), {
				headers: headers,
			});
		} else {
			return this.http.post(
				this.ACCOUNT_API_V2 + path,
				JSON.parse(JSON.stringify(body))
			);
		}
	}

	/**
	 * Function for PUT API requests
	 * @param path
	 * @param body
	 * @returns
	 */
	put(path: string, body: Object = {}, headers?: HttpHeaders): Observable<any> {
		if (headers != undefined) {
			return this.http.put(this.API_URL + path, JSON.stringify(body), {
				headers: headers,
			});
		} else {
			return this.http.put(this.API_URL + path, JSON.stringify(body));
		}
	}

	/**
	 * Function for PUT API V2 requests
	 * @param path
	 * @param body
	 * @returns
	 */
	tempPut(path: string, body: any, headers?: HttpHeaders): Observable<any> {
		if (headers != undefined) {
			return this.http.put(this.ACCOUNT_API_V2 + path, JSON.stringify(body), {
				headers: headers,
			});
		} else {
			return this.http.put(this.ACCOUNT_API_V2 + path, JSON.stringify(body));
		}
	}
	
	/**
	* Function for PUT API V2 requests
	* @param path
	* @param body
	* @returns
	*/
   	tempPutNew(path: string, body: any, headers?: HttpHeaders): Observable<any> {
	   if (headers != undefined) {
		   return this.http.put(this.fundraiser_url + path, JSON.stringify(body), {
			   headers: headers,
		   });
	   } else {
		   return this.http.put(this.fundraiser_url + path, JSON.stringify(body));
	   }
   }

	/**
	 * Function for DELETE API request
	 * @param path
	 * @returns
	 */
	delete(path: string, body: FormData, headers?: HttpHeaders): Observable<any> {
		let jwt = headers?.get('Authorization') || '';
		/**
		 * NOTE: Sending blob with formData also requires to set "boundary" on content-type,
		 * so that backend can read the payload properly. Since boundary value is dynamic,
		 * avoid setting content-type for this and browser will automatically set it for you.
		 * EXAMPLE: 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryPM0yMOPJKezkwGhC'
		 **/
		let options = {
			headers: new HttpHeaders().set('Authorization', jwt),
			body,
		};
		return this.http.delete(this.API_URL + path, options);
	}

	/**
	 * Function to Handle HTTP errors
	 * @param error
	 * @returns
	 */
	public handleError(error: HttpErrorResponse) {
		if (error.status === 0) {
			this._notificationService.openNotification(
				$localize`:@@api_service_errorOcurred:An error occurred.`,
				'',
				'error'
			);
		} else {
			this._notificationService.openNotification(
				$localize`:@@api_service_errorOcurred:An error occurred.`,
				'',
				'error'
			);
		}
		return throwError('Something bad happened; please try again later.');
	}
}
