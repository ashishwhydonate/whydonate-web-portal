import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { AccountComponent } from './components/profile/account/account.component';
import {
	BankAccountType,
	BankComponent,
	VerifyBankPasswordDialog,
} from './components/profile/bank/bank.component';
import { ApiKeyComponent } from './components/profile/api-key/api-key.component';
import { EmailComponent } from './components/profile/email/email.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HeadNavigationComponent } from './components/head-navigation/head-navigation.component';
import { ResetPasswordDialog } from './components/profile/account/reset-password-dialog/resetpassworddialog.component';
import { VerifyPasswordDialog } from './components/profile/account/verify-password-dialog/verifypassworddialog.component';
import { VerifyEmailComponent } from './components/profile/account/verify-email/verify-email.component';
import { PersonalVerificationComponent } from './components/profile/personal-verification/personal-verification.component';
import { VerifiedPopupComponent } from './components/profile/account/verified-popup/verified-popup.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { VerificationBannerComponent } from './components/profile/bank/verification-banner/verification-banner.component';
import { PayoutSettingsComponent } from './components/profile/payout/payout-settings/payout-settings.component';
/** *Profile Module */
@NgModule({
	declarations: [
		ProfileComponent,
		AccountComponent,
		BankComponent,
		ApiKeyComponent,
		EmailComponent,
		ResetPasswordDialog,
		VerifyPasswordDialog,
		VerifyBankPasswordDialog,
		HeadNavigationComponent,
		VerifyEmailComponent,
		PersonalVerificationComponent,
		VerifiedPopupComponent,
		BankAccountType,
		VerificationBannerComponent,
		PayoutSettingsComponent,
	],
	imports: [
		CommonModule,
		ProfileRoutingModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		MatDialogModule,
		ImageCropperModule,
		SharedModule,
	],
})
export class ProfileModule {}
