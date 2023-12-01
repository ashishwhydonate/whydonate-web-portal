import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomBrandingRoutingModule } from './custom-branding-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomBrandingComponent } from './components/custom-branding/custom-branding.component';
import { BrandingComponent } from './components/custom-branding/branding/branding.component';
import { EmailComponent } from './components/custom-branding/email/email.component';

import { QuillModule } from 'ngx-quill';
import { QUILL_FORMATS } from 'src/app/shared/components/quill-editor/quill-editor.component';
import { DonationReceivedComponent } from './components/custom-branding/email/template/donation-received/donation-received.component';
import { ThankYouComponent } from './components/custom-branding/email/template/thank-you/thank-you.component';
import { RegistrationComponent } from './components/custom-branding/email/template/registration/registration.component';
import { FundraiserCreatedComponent } from './components/custom-branding/email/template/fundraiser-created/fundraiser-created.component';
import { FundraiserPublishedComponent } from './components/custom-branding/email/template/fundraiser-published/fundraiser-published.component';
import { FundraiserClosedComponent } from './components/custom-branding/email/template/fundraiser-closed/fundraiser-closed.component';
import { TemplateHeaderComponent } from './components/custom-branding/email/template/template-header/template-header.component';
import { TemplateFooterComponent } from './components/custom-branding/email/template/template-footer/template-footer.component';
import { TemplateBodyComponent } from './components/custom-branding/email/template/template-body/template-body.component';
import { FundraiserPreviewComponent } from './components/custom-branding/branding/template/fundraiser-preview.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ReceiptComponent } from './components/custom-branding/receipt/receipt.component';

/** *Custom Branding Module */
@NgModule({
	declarations: [
		CustomBrandingComponent,
		BrandingComponent,
		EmailComponent,
		DonationReceivedComponent,
		ThankYouComponent,
		RegistrationComponent,
		FundraiserCreatedComponent,
		FundraiserPublishedComponent,
		FundraiserClosedComponent,
		TemplateHeaderComponent,
		TemplateFooterComponent,
		TemplateBodyComponent,
		FundraiserPreviewComponent,
		ReceiptComponent,
	],
	imports: [
		CommonModule,
		CustomBrandingRoutingModule,
		SharedModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		ImageCropperModule,
		QuillModule.forRoot({
			formats: QUILL_FORMATS,
		}),
	],
})
export class CustomBrandingModule {}
