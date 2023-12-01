import { NgModule, ErrorHandler, Injectable } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { MaterialModule } from './material.module';
import { HomeModule } from './pages/home/home.module';
import { AccountModule } from './pages/account/account.module';
import { FundraiserModule } from './pages/fundraiser/fundraiser.module';
import { SearchModule } from './pages/search/search.module';
import { ProfileModule } from './pages/user/profile/profile.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';

/** *Footer Components------------------------------------------------------------------------------------------ */
import { FooterComponent } from './global/components/footer/footer.component';
import { LogoAppLinksComponent } from './global/components/footer/logo-app-links/logo-app-links.component';
import { FundraiserForComponent } from './global/components/footer/fundraiser-for/fundraiser-for.component';
import { ProductsComponent } from './global/components/footer/products/products.component';
import { FeaturesComponent } from './global/components/footer/features/features.component';
import { SupportComponent } from './global/components/footer/support/support.component';
import { RatingsComponent } from './global/components/footer/ratings/ratings.component';
import { CopyrightComponent } from './global/components/footer/copyright/copyright.component';
import { HttpClientModule } from '@angular/common/http';

/** *SENTRY INITIALIZATION------------------------------------------------------- */
import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';

/** *GLOBAL COMPONENTS----------------------------------------------------------- */
import { HeaderComponent } from './global/components/header/header.component';
import { SidenavComponent } from './global/components/sidenav/sidenav.component';
import { PageNotFoundComponent } from './global/components/page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconRegistry } from '@angular/material/icon';
import { MatLegacyPaginatorIntl as MatPaginatorIntl } from '@angular/material/legacy-paginator';
import { MyPaginatorIntl } from 'src/utilities/my_paginator_intl';
import { SharedModule } from './shared/shared.module';

/** *SENTRY CONFIGURATION---------------------------------------------------------------*/
Sentry.init({
	dsn: 'https://0fa2f497fca84f649148e2265d8d4785@sentry.io/1539961',
	// This sets the sample rate to be 10%. You may want this to be sample at this rate in production
	replaysSessionSampleRate: 0.1,

	// If the entire session is not sampled, use the below sample rate to sample
	// sessions when an error occurs.
	replaysOnErrorSampleRate: 1.0,
	environment: environment.production ? 'production' : 'development',
	integrations: [
		new Sentry.Replay({
			// Additional SDK configuration goes in here, for example:
			maskAllText: false,
			maskAllInputs: true,
			blockAllMedia: false,
		}),
		new Integrations.BrowserTracing({
			tracingOrigins: [
				'https://whydonate.in/',
				'https://whydonate.com/',
				'localhost',
			],
		}),
	],
	tracesSampleRate: 1.0,
	ignoreErrors: [
		'Non-Error exception captured',
		"Couldn't load script",
		"Failed to read the 'localStorage' property from 'Window'",
		'No error message',
		'Blocked a frame with origin',
		'The operation is insecure',
		'ResizeObserver loop completed',
		"reading 'getItem'",
		"evaluating 'localStorage.getItem'",
		"evaluating 'a.j'",
		"null (reading '_rawValidators')",
		"(reading 'operator_privacy')",
		'Loading chunk',
		'Large Render Blocking Asset',
		"Cannot read property 'getItem' of null",
		"(reading 'hasOwnProperty')",
		"(reading 'nativeElement')",
	],
	//All these errors are explained inside a 'Sentry Errors' thread in dev channel.
	debug: false,
	attachStacktrace: true,
});
/**  *END OF SENTRY CONFIGURATION---------------------------------------------------------------*/

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
	constructor() {}

	handleError(error: any) {
		const chunkFailedMessage = /Loading chunk [\d]+ failed/;
		if (
			chunkFailedMessage.test(error.message) ||
			chunkFailedMessage.test(error.error) ||
			chunkFailedMessage.test(error) ||
			chunkFailedMessage.test(error.originalError)
		) {
			//window.location.reload();
		} else {
			Sentry.captureException(
				error.originalError || error || error.error || error.message
			);
			throw error;
		}
	}
}

/** *END OF SENTRY ------------------------------------------------------------- */

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		SidenavComponent,
		FooterComponent,
		PageNotFoundComponent,
		LogoAppLinksComponent,
		FundraiserForComponent,
		ProductsComponent,
		FeaturesComponent,
		SupportComponent,
		RatingsComponent,
		CopyrightComponent,
	],
	imports: [
		AppRoutingModule,
		MaterialModule,
		BrowserAnimationsModule,
		HomeModule,
		AccountModule,
		FundraiserModule,
		SearchModule,
		ProfileModule,
		ImageCropperModule,
		SharedModule,
		MatNativeDateModule,
		HttpClientModule,
	],
	providers: [
		{
			provide: ErrorHandler,
			useClass: SentryErrorHandler,
		},
		{
			provide: MAT_DATE_LOCALE,
			useValue: 'nl',
		},
		{
			provide: MatPaginatorIntl,
			useValue: MyPaginatorIntl(),
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {
	constructor(iconRegistry: MatIconRegistry) {
		iconRegistry.setDefaultFontSetClass('material-icons-outlined');
	}
}
