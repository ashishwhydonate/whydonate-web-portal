import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';

@Component({
	selector: 'app-template-footer',
	template: `
		<mat-card class="mat-elevation-z0">
			<p
				i18n="
					@@custom_branding_email_template_footer_forQuestionsFeedback_label"
			>
				For questions, feedback or complaints, please contact our Helpdesk.
			</p>
			<p i18n="@@custom_branding_email_template_footer_bestRegards_label">
				Best regards,
			</p>
			<p i18n="@@custom_branding_email_template_footer_yourName_label">
				Your Name
			</p>
		</mat-card>

		<mat-card class="mat-elevation-z0" class="pale-grey-bg">
			<div fxLayout="row" fxLayoutAlign="space-between center">
				<div i18n="@@footer_label_downloadApp">Download App</div>
				<div i18n="@@templateFooter_unSubscribe_label">UnSubscribe</div>
			</div>

			<div
				fxLayout="row wrap"
				fxLayout.xs="column"
				fxLayoutGap="2%"
				fxLayoutGap.xs="1%"
			>
				<span><img src="https://res.cloudinary.com/whydonate/image/upload/v1666173323/whydonate-production/platform/svg-icons/app-store.svg" /></span>
				<span><img src="https://res.cloudinary.com/whydonate/image/upload/v1666173339/whydonate-production/platform/svg-icons/google-play.svg" /></span>
			</div>

			<div class="m-t-l" i18n="@@templateFooter_follow_label">Follow</div>
			<div fxLayout="row wrap" fxLayoutAlign="space-between center">
				<div>
					<span><img src="https://res.cloudinary.com/whydonate/image/upload/v1666173343/whydonate-production/platform/svg-icons/insta.svg" /></span>
					<span class="m-l-xs"><img src="https://res.cloudinary.com/whydonate/image/upload/v1698663566/whydonate-production/platform/svg-icons/x.svg"/></span>
					<span class="m-l-xs"><img src="https://res.cloudinary.com/whydonate/image/upload/v1666173337/whydonate-production/platform/svg-icons/fb.svg"/></span>
					<span class="m-l-xs"><img src="https://res.cloudinary.com/whydonate/image/upload/v1666173331/whydonate-production/platform/svg-icons/linkedin.svg"/></span>
				</div>
				<div fxLayoutAlign="center center">
					<span i18n="@@templateFooter_poweredBy_label">Powered by</span>&nbsp;
					<span><img [height]="25" src="https://res.cloudinary.com/whydonate/image/upload/dpr_auto,q_auto/whydonate-staging/platform/visuals/new_design_logo.svg" /></span>
				</div>
			</div>
		</mat-card>
	`,
	styles: [],
})
/** *Template Footer Component */
export class TemplateFooterComponent implements OnInit {
	constructor(public media: MediaObserver) {}
	ngOnInit(): void {}
}
