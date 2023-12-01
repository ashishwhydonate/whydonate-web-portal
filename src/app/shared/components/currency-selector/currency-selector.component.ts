import { Component, OnInit } from '@angular/core';
import { CurrencySelectorService } from '../../services/currency-selector.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
	selector: 'app-currency-selector',
	templateUrl: './currency-selector.component.html',
	styleUrls: ['./currency-selector.component.scss'],
})
export class CurrencySelectorComponent implements OnInit {
	currencies: any[] = [];
	defaultCurrency: string = '';
	isShowCurrency: boolean = true;

	constructor(
		public currencyService: CurrencySelectorService,
		public router: Router
	) {}

	ngOnInit(): void {
		this.getUserCurrencyList();
	}

	getUserCurrencyList() {
		this.currencyService.getUserCurrencyList()?.subscribe((res: any) => {
			console.log('SEHBAN res', res);
			if (res?.data?.length > 0) {
				this.currencies = res?.data;
				// SET DEFAULT CURRENCY
				this.defaultCurrency = this.currencies[0];
				this.currencyService.setSelectedCurrency(this.defaultCurrency);
			}
		});
	}

	switchCurrency(value: any) {
		this.currencyService.setSelectedCurrency(value);
	}
}
