import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { MaterialModule } from '../../material.module';
import { PlatformFeeComponent } from './components/home/common/platform-fee/platform-fee.component';
import { SharedModule } from './../../shared/shared.module';
import { FeaturesAndWhyWhydonateComponent } from './components/home/common/features-and-why-whydonate/features-and-why-whydonate.component';
import { SubFooterStartAFundraiserComponent } from './components/home/common/sub-footer-start-afundraiser/sub-footer-start-afundraiser.component';
import { PersonalFundraisingDividedBannerComponent } from './components/home/personal-fundraising/personal-fundraising-divided-banner/personal-fundraising-divided-banner.component';
import { FeaturedFundraisersComponent } from './components/home/personal-fundraising/featured-fundraisers/featured-fundraisers.component';
import { StartingAFundraiserComponent } from './components/home/personal-fundraising/starting-a-fundraiser/starting-a-fundraiser.component';
import { MakingADifferenceComponent } from './components/home/personal-fundraising/making-a-difference/making-a-difference.component';
import { FundraisingSiteComponent } from './components/home/personal-fundraising/fundraising-site/fundraising-site.component';
import { OrganisationBannerComponent } from './components/home/organisation/organisation-banner/organisation-banner.component';
import { DonationPluginComponent } from './components/home/organisation/donation-plugin/donation-plugin.component';
// import { DigitalCollectionBoxComponent } from './components/home/organisation/digital-collection-box/digital-collection-box.component';
import { OnlineFundraisingFeaturesComponent } from './components/home/organisation/online-fundraising-features/online-fundraising-features.component';
/** *Home Module */
@NgModule({
	declarations: [
		HomeComponent,
		PlatformFeeComponent,
		FeaturesAndWhyWhydonateComponent,
		SubFooterStartAFundraiserComponent,
		PersonalFundraisingDividedBannerComponent,
		FeaturedFundraisersComponent,
		StartingAFundraiserComponent,
		MakingADifferenceComponent,
		FundraisingSiteComponent,
		OrganisationBannerComponent,
		DonationPluginComponent,
		// DigitalCollectionBoxComponent,
		OnlineFundraisingFeaturesComponent,
	],
	imports: [CommonModule, HomeRoutingModule, MaterialModule, SharedModule],
})
export class HomeModule {}
