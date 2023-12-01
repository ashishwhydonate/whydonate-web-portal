import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
	providedIn: 'root',
})
/** *Home Service */
export class HomeService {
	API_URL: string = environment.project_url;
	API_URL_V2: string = this.API_URL.replace('/v1', '/v2');

	constructor(private httpClient: HttpClient) {}

	getFacts() {
		let API_URL: string = environment.fundraiser_url;
		let path = 'fundraiser/stats';
		return this.httpClient.get(API_URL + path);
	}
}
