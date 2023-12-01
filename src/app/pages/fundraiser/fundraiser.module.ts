import {
	CUSTOM_ELEMENTS_SCHEMA,
	NgModule,
	NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FundraiserRoutingModule } from './fundraiser-routing.module';

import { MaterialModule } from 'src/app/material.module';
import { MatNativeDateModule } from '@angular/material/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QuillModule } from 'ngx-quill';
import { NgImageSliderModule } from 'ng-image-slider';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ImageCropperModule } from 'ngx-image-cropper';

import { QUILL_FORMATS } from 'src/app/shared/components/quill-editor/quill-editor.component';

// SHARED (View + Edit)
import { OwnerSocialShareComponent } from './components/shared/owner-social-share/owner-social-share.component';
import { ConnectFundComponent } from './components/shared/connect-fund/connect-fund.component';
import { FundraiserLocationComponent } from './components/shared/fundraiser-location/fundraiser-location.component';
import { CreatedByComponent } from './components/shared/created-by/created-by.component';
import { FundraiserDonationComponent } from './components/shared/fundraiser-donation/fundraiser-donation.component';
import { FundraiserCategoryComponent } from './components/shared/fundraiser-category/fundraiser-category.component';
import { FundraiserMediaViewComponent } from './components/shared/fundraiser-media-view/fundraiser-media-view.component';
import { FundraiserMediaEditComponent } from './components/shared/fundraiser-media-edit/fundraiser-media-edit.component';
import { FundraiserUpdateViewComponent } from './components/shared/fundraiser-update-view/fundraiser-update-view.component';
import { FundraiserUpdateEditComponent } from './components/shared/fundraiser-update-edit/fundraiser-update-edit.component';
import { FundraiserStatusComponent } from './components/shared/fundraiser-status/fundraiser-status.component';
import { BackgroundImageEditComponent } from './components/shared/background-image-edit/background-image-edit.component';
import { FundraiserAboutComponent } from './components/shared/fundraiser-about/fundraiser-about.component';
import { DonationsZeroComponent } from './components/shared/donations-zero/donations-zero.component';
import { DonorListShortComponent } from './components/shared/donor-list-short/donor-list-short.component';
import { DonorListFullComponent } from './components/shared/donor-list-full/donor-list-full.component';

// DIALOGS
import { ShareFundraiserPageComponent } from './components/dialogs/share-dialog/share-fundraiser-page/share-fundraiser-page.component';
import { ShareDialogComponent } from './components/dialogs/share-dialog/share-dialog.component';
import { EmbedComponent } from './components/dialogs/share-dialog/embed/embed.component';
import { PaymentRequestComponent } from './components/dialogs/share-dialog/payment-request/payment-request.component';
import { EditCreatedByComponent } from './components/dialogs/edit-created-by/edit-created-by.component';
import { EditFundraiserLocationComponent } from './components/dialogs/edit-fundraiser-location/edit-fundraiser-location.component';
import { TranslateAboutComponent } from './components/dialogs/about/translate-about/translate-about.component';
import { TranslateUpdatesComponent } from './components/dialogs/updates/translate-updates/translate-updates.component';
import { EditAboutComponent } from './components/dialogs/about/edit-about/edit-about.component';
import { EditUpdateComponent } from './components/dialogs/updates/edit-update/edit-update.component';
import { CreateUpdateComponent } from './components/dialogs/updates/create-update/create-update.component';
import { EditAppealComponent } from './components/dialogs/appeal/edit-appeal/edit-appeal.component';
import { TranslateAppealComponent } from './components/dialogs/appeal/translate-appeal/translate-appeal.component';
import { CreateAboutComponent } from './components/dialogs/about/create-about/create-about.component';
import { DeleteFundraiserComponent } from './components/dialogs/delete-fundraiser/delete-fundraiser.component';

// Pages
import { CreateFundraiserComponent } from './components/pages/create-fundraiser/create-fundraiser.component';
import { AddBackgroundDialogComponent } from './components/pages/create-fundraiser/add-background-dialog/add-background-dialog.component';

import { ConnectFundraiserComponent } from './components/pages/connect-fundraiser/connect-fundraiser.component';

import { CustomDonationFormComponent } from './components/pages/custom-donation-form/custom-donation-form.component';
import { fundraiserNotfoundhandlerComponent } from './components/pages/fundraiser-not-found-handler/fundraiser-not-found-handler.component';
import { fundraiserIsDraftComponent } from './components/pages/fundraiser-is-draft/fundraiser-is-draft.component';

import { TargetAmountComponent } from './components/pages/custom-donation-form/target-amount/target-amount.component';

// Main component - NEW
import { FundraiserComponent } from './components/fundraiser.component';
import { EditFundraiserCategoryComponent } from './components/dialogs/edit-fundraiser-category/edit-fundraiser-category.component';
import { OppOwnerComponent } from './components/shared/opp-owner/opp-owner.component';
import { EditAboutDescriptionComponent } from './components/dialogs/about/edit-about-description/edit-about-description.component';
import { TranslateAboutDescriptionComponent } from './components/dialogs/about/translate-about-description/translate-about-description.component';
import { EditAppealDescriptionComponent } from './components/dialogs/appeal/edit-appeal-description/edit-appeal-description.component';
import { TranslateAppealDescriptionComponent } from './components/dialogs/appeal/translate-appeal-description/translate-appeal-description.component';
import { FundraiserContactComponent } from './components/shared/fundraiser-contact/fundraiser-contact.component';
import { add } from 'cypress/types/lodash';
import { AddVideoBackgroundDialogComponent } from './components/pages/create-fundraiser/add-video-background-dialog/add-video-background-dialog.component';
import { BackgroundMediaComponent } from './components/shared/background-image-edit/dialog/background-media/background-media.component';
import { BackgroundImageEditDialogComponent } from './components/shared/background-image-edit/dialog/background-media/dialog/background-image-edit-dialog/background-image-edit-dialog/background-image-edit-dialog.component';
import { UploadImageVideoPopUpComponent } from './components/pages/create-fundraiser/upload-image-video-pop-up/upload-image-video-pop-up.component';
import { FundraiserNotificationComponent } from 'src/app/shared/components/fundraiser-notification/fundraiser-notification.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	declarations: [
		CreatedByComponent,
		FundraiserLocationComponent,
		FundraiserCategoryComponent,
		FundraiserDonationComponent,
		FundraiserMediaViewComponent,
		DonorListShortComponent,
		DonorListFullComponent,
		FundraiserUpdateViewComponent,
		FundraiserUpdateEditComponent,
		EditUpdateComponent,
		CreateUpdateComponent,
		CustomDonationFormComponent,
		fundraiserNotfoundhandlerComponent,
		fundraiserIsDraftComponent,
		FundraiserStatusComponent,
		ConnectFundraiserComponent,
		ShareFundraiserPageComponent,
		DeleteFundraiserComponent,
		BackgroundImageEditComponent,
		FundraiserMediaEditComponent,
		ShareDialogComponent,
		EmbedComponent,
		PaymentRequestComponent,
		CreateFundraiserComponent,
		ConnectFundComponent,
		OwnerSocialShareComponent,
		AddBackgroundDialogComponent,
		EditCreatedByComponent,
		EditFundraiserLocationComponent,
		FundraiserAboutComponent,
		TranslateAboutComponent,
		TranslateUpdatesComponent,
		EditAboutComponent,
		EditAppealComponent,
		TranslateAppealComponent,
		CreateAboutComponent,
		DonationsZeroComponent,
		TargetAmountComponent,
		FundraiserComponent,
		EditFundraiserCategoryComponent,
		OppOwnerComponent,
		EditAboutDescriptionComponent,
		TranslateAboutDescriptionComponent,
		EditAppealDescriptionComponent,
		TranslateAppealDescriptionComponent,
		FundraiserContactComponent,
		AddVideoBackgroundDialogComponent,
		BackgroundMediaComponent,
		BackgroundImageEditDialogComponent,
		UploadImageVideoPopUpComponent,
		FundraiserNotificationComponent,
	],
	imports: [
		MatNativeDateModule,
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		FundraiserRoutingModule,
		MaterialModule,
		SharedModule,
		NgImageSliderModule,
		ClipboardModule,
		ImageCropperModule,
		FontAwesomeModule,
		QuillModule.forRoot({
			formats: QUILL_FORMATS,
		}),
	],
	providers: [DatePipe],
	schemas: [NO_ERRORS_SCHEMA],
})
export class FundraiserModule {}
