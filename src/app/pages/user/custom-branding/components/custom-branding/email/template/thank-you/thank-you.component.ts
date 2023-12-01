import { Component, Input, OnInit } from '@angular/core';
import { CustomBrandingService } from 'src/app/pages/user/custom-branding/services/custom-branding.service';

@Component({
	selector: 'app-thank-you',
	templateUrl: './thank-you.component.html',
	styles: [],
})
/** *Thank You Component */
export class ThankYouComponent implements OnInit {
	@Input() customText!: string;
	@Input() applyCustomBranding!: boolean;
	@Input() customLogo?: string;
	@Input() primaryColor?: string;
	@Input() secondaryColor?: string;
	defaultLogo =
		'https://res.cloudinary.com/whydonate/image/upload/w_92,h_25,dpr_auto,q_auto/whydonate-staging/platform/visuals/new_design_logo.svg';

	constructor(private _customBrandingService: CustomBrandingService) {}

	ngOnInit(): void {}
}
