import { Injectable } from '@angular/core';

import { tableCsvData } from '../interfaces/table-csv-interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
//** *CSV File Format */
export class TableCSVService {
	public _tableCsvData: tableCsvData;
	private _http!: HttpClient;

	constructor() {
		this._tableCsvData = {
			created_at: '2021-10-06T10:30:18.064600',
			description: 'fundraiser',
			name: 'Hydrogen',
			full_name: 'vinay',
			last_name: 'prabhu',
			email: 'vinay335@outlook.com',
			status: 'Paid',
			is_anonymous: false,
			amount: 0.2,
		};
	}

	getDonorOrders(params: any) {
		console.log('DONOR service', params);
		let API = environment.apiUrl;
		return this._http.get(API + `/donation/order/donor/`, {
			params,
			headers: {
				Authorization:
					'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1MzUsInVzZXJuYW1lIjoiYmF3Z3o1bmNxdWJqOGp0YSIsImV4cCI6MTYzNTg4MTQwOCwiZW1haWwiOiJ2aW5heTMzNUBvdXRsb29rLmNvbSIsIm9yaWdfaWF0IjoxNjM1ODc0MjA4fQ.cccN_U-VMyQJJH1DLL6SJkmI8jEP1OgwZS3qhN-Y4-Q',
			},
		});
	}
}
