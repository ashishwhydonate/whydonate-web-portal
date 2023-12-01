import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartFundraiserButtonComponent } from './components/start-fundraiser-button/start-fundraiser-button.component';
import { FreeSignUpButtonComponent } from './components/free-sign-up-button/free-sign-up-button.component';
import { MaterialModule } from '../material.module';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DialogConfirmationComponent } from './components/dialog-confirmation/dialog-confirmation.component';
import { VideoUploadComponent } from './components/video-upload/video-upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageDisplayComponent } from './components/image-display/image-display.component';
import { FundraiserCardComponent } from './components/fundraiser-card/fundraiser-card.component';
import { QuillModule } from 'ngx-quill';
import {
	QuillEditorComponent,
	QUILL_FORMATS,
} from './components/quill-editor/quill-editor.component';
import { QuillViewComponent } from './components/quill-view/quill-view.component';
import { ShareModule } from 'ngx-sharebuttons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SocialShareButtonsComponent } from './components/social-share-buttons/social-share-buttons.component';
import { ConnectFundraiserButtonComponent } from './components/connect-fundraiser-button/connect-fundraiser-button.component';
import { PromoteCauseButtonComponent } from './components/promote-cause-button/promote-cause-button.component';
import { PopupStartFundraiserComponent } from './components/popup-start-fundraiser/popup-start-fundraiser.component';
import { PageLoaderComponent } from './components/page-loader/page-loader.component';
import { LanguageChooserComponent } from './components/language-chooser/language-chooser.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { DialogAuthorisationComponent } from './components/dialog-authorisation/dialog-authorisation.component';
import { StepsToDoComponent } from './components/steps-to-do/steps-to-do.component';
import { ThankDonarComponent } from './components/thank-donar/thank-donar.component';
import { QrCodeComponent } from './components/qr-code/qr-code.component';
import { QRCodeModule } from 'angularx-qrcode';
import { NotificationBannerComponent } from './components/notification-banner/notification-banner.component';
import { AmountViewComponent } from './components/fundraiser-card/shared/amount-view/amount-view.component';
import { DaysLeftViewComponent } from './components/fundraiser-card/shared/days-left-view/days-left-view.component';
import { DonationProgressBarComponent } from './components/fundraiser-card/shared/donation-progress-bar/donation-progress-bar.component';
import { DonationProgressPercentageComponent } from './components/fundraiser-card/shared/donation-progress-percentage/donation-progress-percentage.component';
import { StripeNotificationBannerComponent } from './components/stripe-notification-banner/stripe-notification-banner.component';
import { StripePromptComponent } from './components/stripe-prompt/stripe-prompt.component';
import { BalanceSummaryComponent } from './components/balance-summary/balance-summary.component';
import { CurrencySelectorComponent } from './components/currency-selector/currency-selector.component';
import { HttpClientModule } from '@angular/common/http';

//** *Shared Module */
@NgModule({
	//** *Shared Module Declarations */

	declarations: [
		StartFundraiserButtonComponent,
		FreeSignUpButtonComponent,
		ImageUploadComponent,
		DialogConfirmationComponent,
		VideoUploadComponent,
		ImageDisplayComponent,
		FundraiserCardComponent,
		QuillViewComponent,
		QuillEditorComponent,
		SocialShareButtonsComponent,
		ConnectFundraiserButtonComponent,
		PromoteCauseButtonComponent,
		PopupStartFundraiserComponent,
		PageLoaderComponent,
		LanguageChooserComponent,
		DialogAuthorisationComponent,
		StepsToDoComponent,
		ThankDonarComponent,
		QrCodeComponent,
		NotificationBannerComponent,
		AmountViewComponent,
		DaysLeftViewComponent,
		DonationProgressBarComponent,
		DonationProgressPercentageComponent,
		StripeNotificationBannerComponent,
		StripePromptComponent,
		BalanceSummaryComponent,
		CurrencySelectorComponent,
	],
	//** *Shared Module Imports */

	imports: [
		CommonModule,
		MaterialModule,
		ImageCropperModule,
		FormsModule,
		ReactiveFormsModule,
		QuillModule.forRoot({
			formats: QUILL_FORMATS,
		}),
		ShareModule,
		FontAwesomeModule,
		MatTableModule,
		MatTabsModule,
		MatCardModule,
		QRCodeModule,
		HttpClientModule,
	],
	//** *Shared Exports*/

	exports: [
		StartFundraiserButtonComponent,
		FreeSignUpButtonComponent,
		ImageUploadComponent,
		DialogConfirmationComponent,
		VideoUploadComponent,
		ImageDisplayComponent,
		FundraiserCardComponent,
		QuillViewComponent,
		QuillEditorComponent,
		SocialShareButtonsComponent,
		ConnectFundraiserButtonComponent,
		PromoteCauseButtonComponent,
		PopupStartFundraiserComponent,
		PageLoaderComponent,
		LanguageChooserComponent,
		StepsToDoComponent,
		NotificationBannerComponent,
		AmountViewComponent,
		DaysLeftViewComponent,
		DonationProgressBarComponent,
		DonationProgressPercentageComponent,
		StripeNotificationBannerComponent,
		BalanceSummaryComponent,
		CurrencySelectorComponent,
	],
})
export class SharedModule {}
