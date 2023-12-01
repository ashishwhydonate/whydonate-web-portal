import { getLocaleId } from '@angular/common';
import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { url } from 'inspector';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { categories } from 'src/app/pages/search/components/search/category-data';
import { Category } from 'src/app/shared/interfaces/category-interface';

@Component({
	selector: 'app-fundraiser-category',
	templateUrl: './fundraiser-category.component.html',
	styleUrls: ['./fundraiser-category.component.scss'],
})
/** *Fundraiser Category Component */
export class FundraiserCategoryComponent implements OnInit, OnChanges {
	@Input() category: any = {};
	//* static category data
	readonly _categories = categories;
	selectedCategories!: Category;
	titleCategory: any;
	currentLocale: any;

	constructor(private _accountservice: AccountService) {}

	ngOnChanges(changes: SimpleChanges): void {}

	ngOnInit(): void {
		console.log('CAtegroy', this.category);
		console.log('CAtegroy NAme', this.category.name);

		this.currentLocale = this._accountservice.getLocaleId().toLowerCase();
		console.log('local NAme', this.currentLocale);

		switch (this.currentLocale) {
			case 'es':
				this.titleCategory = this.category.name_es;
				break;
			case 'de':
				this.titleCategory = this.category.name_de;
				break;
			case 'fr':
				this.titleCategory = this.category.name_fr;
				break;
			case 'nl':
				this.titleCategory = this.category.name_nl;
				break;
			case 'en':
				this.titleCategory = this.category.name_en;
				break;
			default:
				this.titleCategory = this.category.name_nl;
				break;
		}
	}
}
