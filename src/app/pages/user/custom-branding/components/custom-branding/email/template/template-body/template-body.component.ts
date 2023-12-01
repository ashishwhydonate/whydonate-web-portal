import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { CustomBrandingService } from 'src/app/pages/user/custom-branding/services/custom-branding.service';

@Component({
	selector: 'app-template-body',
	templateUrl: './template-body.component.html',
	styles: [],
})
/** *Template Body Component */
export class TemplateBodyComponent implements OnInit, OnChanges {
	@Input() customBranding!: boolean;

	_primarColor: string = '#32bf55';
	_secondaryColor: string = '#363396';
	customPrimaryColor: string;
	customSecondaryColor: string;

	constructor(private _customBrandingService: CustomBrandingService) {
		this.customPrimaryColor = this._primarColor;
		this.customSecondaryColor = this._secondaryColor;
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('changes is : ', changes);
		console.log('customBranding is : ' + this.customBranding);
		if (changes.customBranding.currentValue) {
		}
	}

	ngOnInit(): void {
		let customColorObj = this._customBrandingService.getEmailCustomBrandingObj;
		if (customColorObj) {
			this.customPrimaryColor = customColorObj.primaryColor;
			this.customSecondaryColor = customColorObj.secondaryColor;
		}
	}
}
