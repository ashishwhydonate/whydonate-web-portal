import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class CurrencySelectorService {
	selectedCurrency: BehaviorSubject<any> = new BehaviorSubject<any>({
		currency: '',
		symbol: '',
	});

	constructor(
		public httpClient: HttpClient,
		public accountService: AccountService
	) {}

	getUserCurrencyList() {
		if (this.accountService.checkHeaders()) {
			let path = 'account/stripe/wallet';
			let headers = this.accountService.getHeaders();
			return this.httpClient.get(environment.ACCOUNT_API_V2 + path, {
				headers: headers,
			});
		}
	}
	getUserCurrencyListForMyFundraisers() {
		if (this.accountService.checkHeaders()) {
			let path = 'fundraiser/user/currencies';
			let headers = this.accountService.getHeaders();
			return this.httpClient.get(environment.FUNDRAISER_API_V2 + path, {
				headers: headers,
			});
		}
	}

	setSelectedCurrency(currency: any) {
		this.selectedCurrency.next(currency);
	}

	getSelectedCurrency() {
		return this.selectedCurrency.getValue();
	}
}
