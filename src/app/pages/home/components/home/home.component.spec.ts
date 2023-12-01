import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { FeaturesAndWhyWhydonateComponent } from './common/features-and-why-whydonate/features-and-why-whydonate.component';
import { PlatformFeeComponent } from './common/platform-fee/platform-fee.component';
import { SubFooterStartAFundraiserComponent } from './common/sub-footer-start-afundraiser/sub-footer-start-afundraiser.component';
import { HomeComponent } from './home.component';
import { DigitalCollectionBoxComponent } from './organisation/digital-collection-box/digital-collection-box.component';
import { DonationPluginComponent } from './organisation/donation-plugin/donation-plugin.component';
import { OnlineFundraisingFeaturesComponent } from './organisation/online-fundraising-features/online-fundraising-features.component';
import { OrganisationBannerComponent } from './organisation/organisation-banner/organisation-banner.component';
import { FeaturedFundraisersComponent } from './personal-fundraising/featured-fundraisers/featured-fundraisers.component';
import { FundraisingSiteComponent } from './personal-fundraising/fundraising-site/fundraising-site.component';
import { MakingADifferenceComponent } from './personal-fundraising/making-a-difference/making-a-difference.component';
import { PersonalFundraisingDividedBannerComponent } from './personal-fundraising/personal-fundraising-divided-banner/personal-fundraising-divided-banner.component';
import { StartingAFundraiserComponent } from './personal-fundraising/starting-a-fundraiser/starting-a-fundraiser.component';

describe('HomeComponent', () => {
	let component: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;
	let router: Router;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule, MaterialModule, SharedModule],
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
				DigitalCollectionBoxComponent,
				OnlineFundraisingFeaturesComponent,
			],
		}).compileComponents();
	});

	beforeEach(() => {
		router = TestBed.inject(Router);
		fixture = TestBed.createComponent(HomeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	// CHECK IF PARENT HOME COMPONENT IS CREATED
	it('should create', () => {
		expect(component).toBeTruthy();
	});

	//------------------------------------------------------------------------COMMON TESTS--------------------------------------------------------------------------------//

	//CHECK IF FUNDRAISING SITE COMPONENT IS LOADED
	it('should create fundraising site component', () => {
		let fixture = TestBed.createComponent(FundraisingSiteComponent);
		let component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	//CHECK IF PLATFORM FEE COMPONENT IS LOADED
	it('should create Platform fee component', () => {
		let fixture = TestBed.createComponent(PlatformFeeComponent);
		let component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	//CHECK IF FEATURES COMPONENT IS LOADED
	it('should create features and why whydonate component', () => {
		let fixture = TestBed.createComponent(FeaturesAndWhyWhydonateComponent);
		let component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	//CHECK IF SUBFOOTER COMPONENT IS LOADED
	it('should create subfooter component', () => {
		let fixture = TestBed.createComponent(SubFooterStartAFundraiserComponent);
		let component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	//------------------------------------------------------------------------PERSONAL TESTS--------------------------------------------------------------------------------//

	//CHECK IF BANNER IS LOADED
	it('should create banner component', () => {
		let fixture = TestBed.createComponent(
			PersonalFundraisingDividedBannerComponent
		);
		let component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	//CHECK IF TRENDING FUNDRAISERS COMPONENT IS LOADED
	it('should create trending fundraisers component', () => {
		let fixture = TestBed.createComponent(FeaturedFundraisersComponent);
		let component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	// CHECK IF STARTING A FUNDRAISER COMPONENT IS LOADED
	it('should create start a fundraiser component', () => {
		let fixture = TestBed.createComponent(StartingAFundraiserComponent);
		let component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	// CHECK IF MAKING A DIFFERENCE COMPONENT IS LOADED
	it('should create start a fundraiser component', () => {
		let fixture = TestBed.createComponent(MakingADifferenceComponent);
		let component = fixture.componentInstance;

		expect(component).toBeTruthy();
	});

	//------------------------------------------------------------------------ORGANISATION TESTS--------------------------------------------------------------------------------//

	// APPLICATION MUST ROUTE TO ORGANISATION BEFORE RUNNING ANY OF ORGANISATION RELATED TESTS
	function routeToOrganisation() {
		router.navigate(['/organisation']);
	}

	//CHECK IF ORGANISATION BANNER IS LOADED
	it('should create organisation banner component', () => {
		routeToOrganisation();

		let fixture = TestBed.createComponent(OrganisationBannerComponent);
		let component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	//CHECK IF DONATION PLUGIN IS LOADED
	it('should create donation plugin component', () => {
		routeToOrganisation();

		let fixture = TestBed.createComponent(DonationPluginComponent);
		let component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	//CHECK IF DIGITAL COLLECTION BOX COMPONENT IS LOADED
	it('should create Digital Collection Box component', () => {
		routeToOrganisation();

		let fixture = TestBed.createComponent(DigitalCollectionBoxComponent);
		let component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	//CHECK IF Online Fundraising Features Component IS LOADED
	it('should create Online Fundraising Features Component', () => {
		routeToOrganisation();

		let fixture = TestBed.createComponent(OnlineFundraisingFeaturesComponent);
		let component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});
});
