import { Component, Input, OnInit } from '@angular/core';
import { DonationService } from '../../services/donation.service';

@Component({
	selector: 'app-currency-list',
	templateUrl: './currency-list.component.html',
	styleUrls: ['./currency-list.component.scss'],
})
export class CurrencyListComponent {
	@Input() defaultCurrency: any;
	selectedCurrency: any;
	currencies: any = [];
	currencyTooltip: string = 'This is currency';

	constructor(public donationService: DonationService) {}

	ngOnInit() {
		//SET SELECTED CURRENCY IN DONATION SERVICE
		this.donationService.setSelectedCurrency(this.defaultCurrency);

		this.donationService.getAllCurrenciesList().subscribe((response: any) => {
			this.currencies = response?.data?.list_of_currencies;
			this.selectedCurrency =
				this.currencies[
					this.findDefaultCurrencyIndex(this.currencies, this.defaultCurrency)
				];

			// SET CUREENCY IN SERVICE
			//this.donationService.setSelectedCurrency(this.selectedCurrency);
		});
	}

	findDefaultCurrencyIndex(arrayOfCurrencies: any[], defaultCurrency: any) {
		var foundIndex: number = 0;
		arrayOfCurrencies.forEach((currency, index) => {
			if (currency?.currency == defaultCurrency?.currency) {
				foundIndex = index;
			}
		});
		return foundIndex;
	}

	switchCurrency(value: any) {
		this.selectedCurrency = value;
		this.donationService.setSelectedCurrency(this.selectedCurrency);
	}
}
