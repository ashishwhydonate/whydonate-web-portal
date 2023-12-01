import { Component, Input, OnInit } from '@angular/core';
import { CustomBrandingService } from 'src/app/pages/user/custom-branding/services/custom-branding.service';

@Component({
	selector: 'app-donation-received',
	template: `  <div fxLayout="column"  fxLayoutAlign="center center" >
	<div   fxLayout="row" fxFlexAlign="start" fxFlexOffset="2px" >
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="79px" height="24px" viewBox="0 0 79 24" version="1.1">
			<title>Rectangle 3</title>
			<g id="Version-1-(Desktop-1280px)" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				<g id="13.2.2---Custom-emails-(Branding-Applied)" transform="translate(-801.000000, -250.000000)">
					<g id="Page"/>
					<g id="Group-155" transform="translate(785.000000, 234.000000)" fill="#EAEAF4">
						<rect id="Rectangle" x="16" y="16" width="79" height="24" rx="9"/>
					</g>
				</g>
			</g>
		</svg>
	</div>
	<div fxLayout="column" fxLayoutGap="18"   fxLayoutAlign="center center" >

	<div fxLayoutAlign="center center" fxLayout="column" fxLayoutGap="8" fxFlexOffset="15">
	
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="30px" viewBox="0 0 30 30" version="1.1">
			<title>Rectangle 4</title>
			<g id="Version-1-(Desktop-1280px)" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				<g id="13.2.2---Custom-emails-(Branding-Applied)" transform="translate(-1011.000000, -321.000000)">
					<g id="Page"/>
					<g id="Group-155" transform="translate(785.000000, 234.000000)" fill="#EAEAF4">
						<rect id="Rectangle" x="226" y="87" width="30" height="30" rx="15"/>
					</g>
				</g>
			</g>
		</svg>
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="113px" height="4px" viewBox="0 0 113 4" version="1.1">
			<title>Rectangle 2</title>
			<g id="Version-1-(Desktop-1280px)" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				<g id="13.2.2---Custom-emails-(Branding-Applied)" transform="translate(-970.000000, -481.000000)">
					<g id="Page"/>
					<g id="Group-155" transform="translate(785.000000, 234.000000)" fill="#D8D8D8">
						<g id="Group-2" transform="translate(119.000000, 247.000000)">
							<rect id="Rectangle" x="66" y="0" width="113" height="4" rx="2"/>
						</g>
					</g>
				</g>
			</g>
		</svg>
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="244px" height="4px" viewBox="0 0 244 4" version="1.1">
			<title>Rectangle Copy</title>
			<g id="Version-1-(Desktop-1280px)" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				<g id="13.2.2---Custom-emails-(Branding-Applied)" transform="translate(-904.000000, -493.000000)">
					<g id="Page"/>
					<g id="Group-155" transform="translate(785.000000, 234.000000)" fill="#D8D8D8">
						<g id="Group-2" transform="translate(119.000000, 247.000000)">
							<rect id="Rectangle-Copy" x="0" y="12" width="244" height="4" rx="2"/>
						</g>
					</g>
				</g>
			</g>
		</svg>
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="179px" height="4px" viewBox="0 0 179 4" version="1.1">
			<title>Rectangle Copy 2</title>
			<g id="Version-1-(Desktop-1280px)" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				<g id="13.2.2---Custom-emails-(Branding-Applied)" transform="translate(-937.000000, -505.000000)">
					<g id="Page"/>
					<g id="Group-155" transform="translate(785.000000, 234.000000)" fill="#D8D8D8">
						<g id="Group-2" transform="translate(119.000000, 247.000000)">
							<rect id="Rectangle-Copy-2" x="33" y="24" width="179" height="4" rx="2"/>
						</g>
					</g>
				</g>
			</g>
		</svg>
	  
	</div>
 
	<div fxLayout="row" fxLayoutAlign="center center"  >
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="122px" height="30px" viewBox="0 0 122 30" version="1.1">
			<title>Rectangle</title>
			<g id="Version-1-(Desktop-1280px)" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				<g id="13.2.1--Custom-emails" transform="translate(-965.000000, -450.000000)">
					<g id="Page"/>
					<g id="Group-9" transform="translate(785.000000, 280.000000)" 
					[attr.fill]="!applyCustomBranding ? '#363398' : secondaryColor?.toString()"
					fill="#363398">
						<rect id="Rectangle" x="180" y="170" width="122" height="30" rx="3"/>
					</g>
				</g>
			</g>
		</svg>
	</div>
	<div *ngIf="customText"  fxLayout="column" fxLayoutAlign="center center" > 
	<span i18n="@@thankyou_message_from_Fundraiser_owner">Message From the Fundraiser Owner</span> 
        <mat-chip fxLayout="row"    fxLayoutAlign="center center" fxLayoutGap="8" fxFlexOffset="3">
           <div  *ngIf="customText">
                <quill-view
                id="thank-you-preview"
                [content]="customText"
                [preserveWhitespace]="true"
                [sanitize]="true"
                format="html"
            >
            </quill-view>
            </div>
        </mat-chip>
    </div>
	<div
		[ngClass]="!applyCustomBranding ? 'whydonate' : ''"
		fxLayout="column"
		fxLayoutAlign="center center"
		fxLayoutGap="10" 
	>
	   
		<div fxLayoutAlign="center center" fxLayout="column" fxLayoutGap="8">
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="113px" height="4px" viewBox="0 0 113 4" version="1.1">
				<title>Rectangle 2</title>
				<g id="Version-1-(Desktop-1280px)" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
					<g id="13.2.2---Custom-emails-(Branding-Applied)" transform="translate(-970.000000, -481.000000)">
						<g id="Page"/>
						<g id="Group-155" transform="translate(785.000000, 234.000000)" fill="#D8D8D8">
							<g id="Group-2" transform="translate(119.000000, 247.000000)">
								<rect id="Rectangle" x="66" y="0" width="113" height="4" rx="2"/>
							</g>
						</g>
					</g>
				</g>
			</svg>
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="244px" height="4px" viewBox="0 0 244 4" version="1.1">
				<title>Rectangle Copy</title>
				<g id="Version-1-(Desktop-1280px)" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
					<g id="13.2.2---Custom-emails-(Branding-Applied)" transform="translate(-904.000000, -493.000000)">
						<g id="Page"/>
						<g id="Group-155" transform="translate(785.000000, 234.000000)" fill="#D8D8D8">
							<g id="Group-2" transform="translate(119.000000, 247.000000)">
								<rect id="Rectangle-Copy" x="0" y="12" width="244" height="4" rx="2"/>
							</g>
						</g>
					</g>
				</g>
			</svg>
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="179px" height="4px" viewBox="0 0 179 4" version="1.1">
				<title>Rectangle Copy 2</title>
				<g id="Version-1-(Desktop-1280px)" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
					<g id="13.2.2---Custom-emails-(Branding-Applied)" transform="translate(-937.000000, -505.000000)">
						<g id="Page"/>
						<g id="Group-155" transform="translate(785.000000, 234.000000)" fill="#D8D8D8">
							<g id="Group-2" transform="translate(119.000000, 247.000000)">
								<rect id="Rectangle-Copy-2" x="33" y="24" width="179" height="4" rx="2"/>
							</g>
						</g>
					</g>
				</g>
			</svg>
		</div>
	</div>
	<div fxLayout="row"  fxLayoutGap="12"  fxLayoutAlign="center center" >

		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32px" height="32px" viewBox="0 0 32 32" version="1.1">
			<title>Rectangle Copy 12</title>
			<g id="Version-1-(Desktop-1280px)" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				<g id="13.2.2---Custom-emails-(Branding-Applied)" transform="translate(-1080.000000, -522.000000)">
					<g id="Page"/>
					<g id="Group-155" transform="translate(785.000000, 234.000000)" fill="#363398" fill-opacity="0.1">
						<g id="Group-2" transform="translate(119.000000, 247.000000)">
							<g id="Group-4" transform="translate(36.000000, 41.000000)">
								<rect id="Rectangle-Copy-12" x="140" y="0" width="32" height="32" rx="3"/>
							</g>
						</g>
					</g>
				</g>
			</g>
		</svg>
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32px" height="32px" viewBox="0 0 32 32" version="1.1">
			<title>Rectangle Copy 12</title>
			<g id="Version-1-(Desktop-1280px)" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				<g id="13.2.2---Custom-emails-(Branding-Applied)" transform="translate(-1080.000000, -522.000000)">
					<g id="Page"/>
					<g id="Group-155" transform="translate(785.000000, 234.000000)" fill="#363398" fill-opacity="0.1">
						<g id="Group-2" transform="translate(119.000000, 247.000000)">
							<g id="Group-4" transform="translate(36.000000, 41.000000)">
								<rect id="Rectangle-Copy-12" x="140" y="0" width="32" height="32" rx="3"/>
							</g>
						</g>
					</g>
				</g>
			</g>
		</svg>
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32px" height="32px" viewBox="0 0 32 32" version="1.1">
			<title>Rectangle Copy 12</title>
			<g id="Version-1-(Desktop-1280px)" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				<g id="13.2.2---Custom-emails-(Branding-Applied)" transform="translate(-1080.000000, -522.000000)">
					<g id="Page"/>
					<g id="Group-155" transform="translate(785.000000, 234.000000)" fill="#363398" fill-opacity="0.1">
						<g id="Group-2" transform="translate(119.000000, 247.000000)">
							<g id="Group-4" transform="translate(36.000000, 41.000000)">
								<rect id="Rectangle-Copy-12" x="140" y="0" width="32" height="32" rx="3"/>
							</g>
						</g>
					</g>
				</g>
			</g>
		</svg>
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32px" height="32px" viewBox="0 0 32 32" version="1.1">
			<title>Rectangle Copy 12</title>
			<g id="Version-1-(Desktop-1280px)" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				<g id="13.2.2---Custom-emails-(Branding-Applied)" transform="translate(-1080.000000, -522.000000)">
					<g id="Page"/>
					<g id="Group-155" transform="translate(785.000000, 234.000000)" fill="#363398" fill-opacity="0.1">
						<g id="Group-2" transform="translate(119.000000, 247.000000)">
							<g id="Group-4" transform="translate(36.000000, 41.000000)">
								<rect id="Rectangle-Copy-12" x="140" y="0" width="32" height="32" rx="3"/>
							</g>
						</g>
					</g>
				</g>
			</g>
		</svg>

	</div>
</div>
<div  fxLayout="row wrap"  fxFlexOffset="4" fxLayoutAlign="space-between stretch"  [fxFlex] >
<img
        width="370"
        src="https://res.cloudinary.com/whydonate/image/upload/v1681829776/whydonate-production/platform/svg-icons/footerNew.svg" />
</div>
</div>  `,
})
/** *Donation Received Component */
export class DonationReceivedComponent implements OnInit {
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






// <p
// 			i18n="@@donation-received-custom-email-donation-received-connected-title"
// 		>
// 			Donation received connected fundraiser
// 		</p>
// 		<mat-divider> </mat-divider><br />

// 		<div>
// 			<img
// 				[src]="applyCustomBranding ? customLogo : defaultLogo"
// 				alt="Profile Image"
// 				[style.max-height.px]="25"
// 				[style.max-width.px]="92"
// 			/>
// 		</div>

// 		<div *ngIf="customLogo" [style.margin]="'auto'" [style.width.px]="'180'">
// 			<!-- <img [src]="customLogo" alt="Profile Image" /> -->
// 		</div>

// 		<p
// 			[style.margin-top.px]="20"
// 			fxLayoutAlign="center center"
// 			i18n="@@donation-received-custom-email-fundraiser-received-title"
// 		>
// 			Fundraiser Received!
// 		</p>
// 		<div fxLayoutAlign="center center">
// 			<quill-view
// 				id="fundraiser-received-preview"
// 				[content]="customText"
// 				[preserveWhitespace]="true"
// 				[sanitize]="true"
// 				format="text"
// 			>
// 			</quill-view>
// 		</div>
// 		<app-template-footer></app-template-footer>