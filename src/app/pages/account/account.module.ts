import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { AccountRoutingModule } from './account-routing.module';
import { MaterialModule } from 'src/app/material.module';
import { RegistrationFormComponent } from './components/registration/registration-form/registration-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HttpClientModule } from '@angular/common/http';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DeactivatedAccountComponent } from './components/deactivated-account/deactivated-account.component';
import { RegistrationCompleteComponent } from './components/registration/registration-complete/registration-complete.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
/** *Account Module */
@NgModule({
	declarations: [
		LoginComponent,
		RegistrationFormComponent,
		ForgotPasswordComponent,
		ResetPasswordComponent,
		DeactivatedAccountComponent,
		RegistrationCompleteComponent,
		EmailVerificationComponent,
	],
	imports: [
		CommonModule,
		AccountRoutingModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		HttpClientModule,
		ImageCropperModule,
	],
})
export class AccountModule {}
