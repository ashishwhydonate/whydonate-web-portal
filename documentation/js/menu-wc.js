'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">whydonate-web-portal documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AccountModule.html" data-type="entity-link" >AccountModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AccountModule-5ad250db2ea05a5811938750f2353882acc565ec4a4fdb9eeec27c7c1239e2503fc8a5eac7e6701bab442365f3afa762e4e8df42df61c1dda55c869735c70a34"' : 'data-target="#xs-components-links-module-AccountModule-5ad250db2ea05a5811938750f2353882acc565ec4a4fdb9eeec27c7c1239e2503fc8a5eac7e6701bab442365f3afa762e4e8df42df61c1dda55c869735c70a34"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AccountModule-5ad250db2ea05a5811938750f2353882acc565ec4a4fdb9eeec27c7c1239e2503fc8a5eac7e6701bab442365f3afa762e4e8df42df61c1dda55c869735c70a34"' :
                                            'id="xs-components-links-module-AccountModule-5ad250db2ea05a5811938750f2353882acc565ec4a4fdb9eeec27c7c1239e2503fc8a5eac7e6701bab442365f3afa762e4e8df42df61c1dda55c869735c70a34"' }>
                                            <li class="link">
                                                <a href="components/DeactivatedAccountComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeactivatedAccountComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmailVerificationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailVerificationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ForgotPasswordComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ForgotPasswordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistrationCompleteComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistrationCompleteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistrationFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistrationFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResetPasswordComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResetPasswordComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AccountRoutingModule.html" data-type="entity-link" >AccountRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-d1a60c74b9e8a467ed80ab464ccfd0342dffe98710e602d734d675935bfa23c311b2312ef3329f0c9fa46bfe52a5b6835e8b81acaa6eaf8c3247c41cc8fbaf06"' : 'data-target="#xs-components-links-module-AppModule-d1a60c74b9e8a467ed80ab464ccfd0342dffe98710e602d734d675935bfa23c311b2312ef3329f0c9fa46bfe52a5b6835e8b81acaa6eaf8c3247c41cc8fbaf06"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-d1a60c74b9e8a467ed80ab464ccfd0342dffe98710e602d734d675935bfa23c311b2312ef3329f0c9fa46bfe52a5b6835e8b81acaa6eaf8c3247c41cc8fbaf06"' :
                                            'id="xs-components-links-module-AppModule-d1a60c74b9e8a467ed80ab464ccfd0342dffe98710e602d734d675935bfa23c311b2312ef3329f0c9fa46bfe52a5b6835e8b81acaa6eaf8c3247c41cc8fbaf06"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CopyrightComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CopyrightComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FeaturesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FeaturesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FundraiserForComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundraiserForComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LogoAppLinksComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LogoAppLinksComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PageNotFoundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PageNotFoundComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProductsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RatingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RatingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SidenavComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SidenavComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SupportComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SupportComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BalanceModule.html" data-type="entity-link" >BalanceModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-BalanceModule-a6e60bbf96b0606596d8dcf3636baf139679404786ba92e9bb6a439cc2d728a5e6b3787b27b3332674f4b58c3f44c741002a9bdc3fe6b4e0c7528f06e7958f86"' : 'data-target="#xs-components-links-module-BalanceModule-a6e60bbf96b0606596d8dcf3636baf139679404786ba92e9bb6a439cc2d728a5e6b3787b27b3332674f4b58c3f44c741002a9bdc3fe6b4e0c7528f06e7958f86"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-BalanceModule-a6e60bbf96b0606596d8dcf3636baf139679404786ba92e9bb6a439cc2d728a5e6b3787b27b3332674f4b58c3f44c741002a9bdc3fe6b4e0c7528f06e7958f86"' :
                                            'id="xs-components-links-module-BalanceModule-a6e60bbf96b0606596d8dcf3636baf139679404786ba92e9bb6a439cc2d728a5e6b3787b27b3332674f4b58c3f44c741002a9bdc3fe6b4e0c7528f06e7958f86"' }>
                                            <li class="link">
                                                <a href="components/BalanceComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BalanceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PayoutPopupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PayoutPopupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PayoutStripeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PayoutStripeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PayoutTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PayoutTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PayoutTableMollieComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PayoutTableMollieComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/BalanceRoutingModule.html" data-type="entity-link" >BalanceRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CustomBrandingModule.html" data-type="entity-link" >CustomBrandingModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CustomBrandingModule-5954fc2c2ee128fe8897cf45859bef6fc1a564c9267d69f863bb5ccaaea159cb07e1d926c2f565d6e0c68ecc2df342abae42c0a7ebdc054431e1d1b17f35d293"' : 'data-target="#xs-components-links-module-CustomBrandingModule-5954fc2c2ee128fe8897cf45859bef6fc1a564c9267d69f863bb5ccaaea159cb07e1d926c2f565d6e0c68ecc2df342abae42c0a7ebdc054431e1d1b17f35d293"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CustomBrandingModule-5954fc2c2ee128fe8897cf45859bef6fc1a564c9267d69f863bb5ccaaea159cb07e1d926c2f565d6e0c68ecc2df342abae42c0a7ebdc054431e1d1b17f35d293"' :
                                            'id="xs-components-links-module-CustomBrandingModule-5954fc2c2ee128fe8897cf45859bef6fc1a564c9267d69f863bb5ccaaea159cb07e1d926c2f565d6e0c68ecc2df342abae42c0a7ebdc054431e1d1b17f35d293"' }>
                                            <li class="link">
                                                <a href="components/BrandingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BrandingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CustomBrandingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomBrandingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DonationReceivedComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DonationReceivedComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FundraiserClosedComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundraiserClosedComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FundraiserCreatedComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundraiserCreatedComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FundraiserPreviewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundraiserPreviewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FundraiserPublishedComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundraiserPublishedComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReceiptComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReceiptComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistrationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistrationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TemplateBodyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TemplateBodyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TemplateFooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TemplateFooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TemplateHeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TemplateHeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ThankYouComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ThankYouComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CustomBrandingRoutingModule.html" data-type="entity-link" >CustomBrandingRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardModule.html" data-type="entity-link" >DashboardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DashboardModule-a062be750f922a52f84f32999ea5cf8fa06bce530cd5fe38bc83e70b034776016326b341e87da7aeafaf054628d99a75eaeea81d2463ac493929cf12681d0aad"' : 'data-target="#xs-components-links-module-DashboardModule-a062be750f922a52f84f32999ea5cf8fa06bce530cd5fe38bc83e70b034776016326b341e87da7aeafaf054628d99a75eaeea81d2463ac493929cf12681d0aad"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DashboardModule-a062be750f922a52f84f32999ea5cf8fa06bce530cd5fe38bc83e70b034776016326b341e87da7aeafaf054628d99a75eaeea81d2463ac493929cf12681d0aad"' :
                                            'id="xs-components-links-module-DashboardModule-a062be750f922a52f84f32999ea5cf8fa06bce530cd5fe38bc83e70b034776016326b341e87da7aeafaf054628d99a75eaeea81d2463ac493929cf12681d0aad"' }>
                                            <li class="link">
                                                <a href="components/AccountViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccountViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DashboardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DonationSummaryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DonationSummaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GivenDonationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GivenDonationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MyFundraisersViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MyFundraisersViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PayoutSummaryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PayoutSummaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReceivedDonationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReceivedDonationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RecurringGivenDonationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RecurringGivenDonationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RecurringReceivedDonationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RecurringReceivedDonationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StopRecurringDonationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StopRecurringDonationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SummariesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SummariesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UsermessageCancelComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsermessageCancelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UsermessageStopComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsermessageStopComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardRoutingModule.html" data-type="entity-link" >DashboardRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DonationModule.html" data-type="entity-link" >DonationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DonationModule-d245fcf83a44f47b716258835890f1e4189db84ecc84e643a44af4fe18c62c149b1adf4dd7cbbd74ce43628be700f73c591ef8750f2dbb8d99df2f2ff6b0896c"' : 'data-target="#xs-components-links-module-DonationModule-d245fcf83a44f47b716258835890f1e4189db84ecc84e643a44af4fe18c62c149b1adf4dd7cbbd74ce43628be700f73c591ef8750f2dbb8d99df2f2ff6b0896c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DonationModule-d245fcf83a44f47b716258835890f1e4189db84ecc84e643a44af4fe18c62c149b1adf4dd7cbbd74ce43628be700f73c591ef8750f2dbb8d99df2f2ff6b0896c"' :
                                            'id="xs-components-links-module-DonationModule-d245fcf83a44f47b716258835890f1e4189db84ecc84e643a44af4fe18c62c149b1adf4dd7cbbd74ce43628be700f73c591ef8750f2dbb8d99df2f2ff6b0896c"' }>
                                            <li class="link">
                                                <a href="components/DonationFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DonationFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DonationPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DonationPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DonationReceiptComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DonationReceiptComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DonationSuccessfulComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DonationSuccessfulComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DonationSuccessfulFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DonationSuccessfulFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ShareContributionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ShareContributionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StripeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StripeComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-DonationModule-d245fcf83a44f47b716258835890f1e4189db84ecc84e643a44af4fe18c62c149b1adf4dd7cbbd74ce43628be700f73c591ef8750f2dbb8d99df2f2ff6b0896c"' : 'data-target="#xs-directives-links-module-DonationModule-d245fcf83a44f47b716258835890f1e4189db84ecc84e643a44af4fe18c62c149b1adf4dd7cbbd74ce43628be700f73c591ef8750f2dbb8d99df2f2ff6b0896c"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-DonationModule-d245fcf83a44f47b716258835890f1e4189db84ecc84e643a44af4fe18c62c149b1adf4dd7cbbd74ce43628be700f73c591ef8750f2dbb8d99df2f2ff6b0896c"' :
                                        'id="xs-directives-links-module-DonationModule-d245fcf83a44f47b716258835890f1e4189db84ecc84e643a44af4fe18c62c149b1adf4dd7cbbd74ce43628be700f73c591ef8750f2dbb8d99df2f2ff6b0896c"' }>
                                        <li class="link">
                                            <a href="directives/NumbersOnlyDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NumbersOnlyDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/TwoDigitDecimaNumberDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TwoDigitDecimaNumberDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DonationRoutingModule.html" data-type="entity-link" >DonationRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/FundraiserModule.html" data-type="entity-link" >FundraiserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FundraiserModule-bc96e6dab65eec4fdfafbeb43a86612869ab61a72b7332a973fcfa5ad6326f4fb49cd715d2b9b75b82cf9d2cdbafe6d10aa6c2acf0354e1444d2d61c2323ae6f"' : 'data-target="#xs-components-links-module-FundraiserModule-bc96e6dab65eec4fdfafbeb43a86612869ab61a72b7332a973fcfa5ad6326f4fb49cd715d2b9b75b82cf9d2cdbafe6d10aa6c2acf0354e1444d2d61c2323ae6f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FundraiserModule-bc96e6dab65eec4fdfafbeb43a86612869ab61a72b7332a973fcfa5ad6326f4fb49cd715d2b9b75b82cf9d2cdbafe6d10aa6c2acf0354e1444d2d61c2323ae6f"' :
                                            'id="xs-components-links-module-FundraiserModule-bc96e6dab65eec4fdfafbeb43a86612869ab61a72b7332a973fcfa5ad6326f4fb49cd715d2b9b75b82cf9d2cdbafe6d10aa6c2acf0354e1444d2d61c2323ae6f"' }>
                                            <li class="link">
                                                <a href="components/AddBackgroundDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddBackgroundDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddVideoBackgroundDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddVideoBackgroundDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BackgroundImageEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BackgroundImageEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BackgroundImageEditDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BackgroundImageEditDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BackgroundMediaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BackgroundMediaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConnectFundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConnectFundComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConnectFundraiserComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConnectFundraiserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateAboutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateAboutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateFundraiserComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateFundraiserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateUpdateComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateUpdateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreatedByComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreatedByComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CustomDonationFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomDonationFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DeleteFundraiserComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeleteFundraiserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DonationsZeroComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DonationsZeroComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DonorListFullComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DonorListFullComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DonorListShortComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DonorListShortComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditAboutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditAboutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditAboutDescriptionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditAboutDescriptionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditAppealComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditAppealComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditAppealDescriptionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditAppealDescriptionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditCreatedByComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditCreatedByComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditFundraiserCategoryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditFundraiserCategoryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditFundraiserLocationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditFundraiserLocationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditUpdateComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditUpdateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmbedComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmbedComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FundraiserAboutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundraiserAboutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FundraiserCategoryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundraiserCategoryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FundraiserComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundraiserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FundraiserContactComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundraiserContactComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FundraiserDonationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundraiserDonationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FundraiserLocationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundraiserLocationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FundraiserMediaEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundraiserMediaEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FundraiserMediaViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundraiserMediaViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FundraiserNotificationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundraiserNotificationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FundraiserStatusComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundraiserStatusComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FundraiserUpdateEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundraiserUpdateEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FundraiserUpdateViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundraiserUpdateViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OppOwnerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OppOwnerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OwnerSocialShareComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OwnerSocialShareComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PaymentRequestComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentRequestComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ShareDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ShareDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ShareFundraiserPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ShareFundraiserPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TargetAmountComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TargetAmountComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TranslateAboutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TranslateAboutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TranslateAboutDescriptionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TranslateAboutDescriptionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TranslateAppealComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TranslateAppealComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TranslateAppealDescriptionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TranslateAppealDescriptionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TranslateUpdatesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TranslateUpdatesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UploadImageVideoPopUpComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UploadImageVideoPopUpComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/fundraiserIsDraftComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >fundraiserIsDraftComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/fundraiserNotfoundhandlerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >fundraiserNotfoundhandlerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/FundraiserRoutingModule.html" data-type="entity-link" >FundraiserRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HomeModule.html" data-type="entity-link" >HomeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HomeModule-b8d69bdee07ff5a16d6dd4152832368da9c632b71bbbe0754f885a39d8e47e8c98381ad0aecdd5de38b65253aef213902d0c9b2b18cfcdf61da381207a156b6c"' : 'data-target="#xs-components-links-module-HomeModule-b8d69bdee07ff5a16d6dd4152832368da9c632b71bbbe0754f885a39d8e47e8c98381ad0aecdd5de38b65253aef213902d0c9b2b18cfcdf61da381207a156b6c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HomeModule-b8d69bdee07ff5a16d6dd4152832368da9c632b71bbbe0754f885a39d8e47e8c98381ad0aecdd5de38b65253aef213902d0c9b2b18cfcdf61da381207a156b6c"' :
                                            'id="xs-components-links-module-HomeModule-b8d69bdee07ff5a16d6dd4152832368da9c632b71bbbe0754f885a39d8e47e8c98381ad0aecdd5de38b65253aef213902d0c9b2b18cfcdf61da381207a156b6c"' }>
                                            <li class="link">
                                                <a href="components/DonationPluginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DonationPluginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FeaturedFundraisersComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FeaturedFundraisersComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FeaturesAndWhyWhydonateComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FeaturesAndWhyWhydonateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FundraisingSiteComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundraisingSiteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MakingADifferenceComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MakingADifferenceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OnlineFundraisingFeaturesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OnlineFundraisingFeaturesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OrganisationBannerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrganisationBannerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PersonalFundraisingDividedBannerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PersonalFundraisingDividedBannerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PlatformFeeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PlatformFeeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StartingAFundraiserComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StartingAFundraiserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SubFooterStartAFundraiserComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SubFooterStartAFundraiserComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomeRoutingModule.html" data-type="entity-link" >HomeRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MaterialModule.html" data-type="entity-link" >MaterialModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MyFundraisersModule.html" data-type="entity-link" >MyFundraisersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MyFundraisersModule-f8abe884c6ffe81591c80a987588de85eb05acea2d6ff9f8f2caca9a873e9741db76ff0840fb96e95746d709c035eabe7fa583393d7300e6d9230ab5026428c0"' : 'data-target="#xs-components-links-module-MyFundraisersModule-f8abe884c6ffe81591c80a987588de85eb05acea2d6ff9f8f2caca9a873e9741db76ff0840fb96e95746d709c035eabe7fa583393d7300e6d9230ab5026428c0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MyFundraisersModule-f8abe884c6ffe81591c80a987588de85eb05acea2d6ff9f8f2caca9a873e9741db76ff0840fb96e95746d709c035eabe7fa583393d7300e6d9230ab5026428c0"' :
                                            'id="xs-components-links-module-MyFundraisersModule-f8abe884c6ffe81591c80a987588de85eb05acea2d6ff9f8f2caca9a873e9741db76ff0840fb96e95746d709c035eabe7fa583393d7300e6d9230ab5026428c0"' }>
                                            <li class="link">
                                                <a href="components/MyFundraisersComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MyFundraisersComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MyFundraisersRoutingModule.html" data-type="entity-link" >MyFundraisersRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ProfileModule.html" data-type="entity-link" >ProfileModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ProfileModule-29afb3bace6dadfc7938806bacd5ea7a63024332235e4f098acb1b58a6d507b48774975ce8085de67ee676becdec2d522c0de050a2920da95c7d079448a55800"' : 'data-target="#xs-components-links-module-ProfileModule-29afb3bace6dadfc7938806bacd5ea7a63024332235e4f098acb1b58a6d507b48774975ce8085de67ee676becdec2d522c0de050a2920da95c7d079448a55800"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProfileModule-29afb3bace6dadfc7938806bacd5ea7a63024332235e4f098acb1b58a6d507b48774975ce8085de67ee676becdec2d522c0de050a2920da95c7d079448a55800"' :
                                            'id="xs-components-links-module-ProfileModule-29afb3bace6dadfc7938806bacd5ea7a63024332235e4f098acb1b58a6d507b48774975ce8085de67ee676becdec2d522c0de050a2920da95c7d079448a55800"' }>
                                            <li class="link">
                                                <a href="components/AccountComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccountComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ApiKeyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiKeyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BankAccountType.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BankAccountType</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BankComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BankComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeadNavigationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeadNavigationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PayoutSettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PayoutSettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PersonalVerificationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PersonalVerificationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResetPasswordDialog.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResetPasswordDialog</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerificationBannerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerificationBannerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerifiedPopupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerifiedPopupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerifyBankPasswordDialog.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerifyBankPasswordDialog</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerifyEmailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerifyEmailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerifyPasswordDialog.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerifyPasswordDialog</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfileRoutingModule.html" data-type="entity-link" >ProfileRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SearchModule.html" data-type="entity-link" >SearchModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SearchModule-329b317bf0f21d4d66d9f949e240ed4ff3cb5e3e9bd205415d94b832f9e5e97703d8b20c2f14822d05c963536e702605fd50265a7dc285833330b7b8c6748910"' : 'data-target="#xs-components-links-module-SearchModule-329b317bf0f21d4d66d9f949e240ed4ff3cb5e3e9bd205415d94b832f9e5e97703d8b20c2f14822d05c963536e702605fd50265a7dc285833330b7b8c6748910"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SearchModule-329b317bf0f21d4d66d9f949e240ed4ff3cb5e3e9bd205415d94b832f9e5e97703d8b20c2f14822d05c963536e702605fd50265a7dc285833330b7b8c6748910"' :
                                            'id="xs-components-links-module-SearchModule-329b317bf0f21d4d66d9f949e240ed4ff3cb5e3e9bd205415d94b832f9e5e97703d8b20c2f14822d05c963536e702605fd50265a7dc285833330b7b8c6748910"' }>
                                            <li class="link">
                                                <a href="components/SearchComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SearchComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SearchRoutingModule.html" data-type="entity-link" >SearchRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-ee29f32b4b41f6155eb02be4c959ce4851e316801c817fff3a925f54b64eb3f3668b1f64e4ccba73ecec7ad54bc35f4c32a9cb30e4e1a5d8fdfdb17dca827e29"' : 'data-target="#xs-components-links-module-SharedModule-ee29f32b4b41f6155eb02be4c959ce4851e316801c817fff3a925f54b64eb3f3668b1f64e4ccba73ecec7ad54bc35f4c32a9cb30e4e1a5d8fdfdb17dca827e29"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-ee29f32b4b41f6155eb02be4c959ce4851e316801c817fff3a925f54b64eb3f3668b1f64e4ccba73ecec7ad54bc35f4c32a9cb30e4e1a5d8fdfdb17dca827e29"' :
                                            'id="xs-components-links-module-SharedModule-ee29f32b4b41f6155eb02be4c959ce4851e316801c817fff3a925f54b64eb3f3668b1f64e4ccba73ecec7ad54bc35f4c32a9cb30e4e1a5d8fdfdb17dca827e29"' }>
                                            <li class="link">
                                                <a href="components/AmountViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AmountViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BalanceSummaryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BalanceSummaryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConnectFundraiserButtonComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConnectFundraiserButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DaysLeftViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DaysLeftViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DialogAuthorisationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogAuthorisationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DialogConfirmationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogConfirmationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DonationProgressBarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DonationProgressBarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DonationProgressPercentageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DonationProgressPercentageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FreeSignUpButtonComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FreeSignUpButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FundraiserCardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FundraiserCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImageDisplayComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImageDisplayComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImageUploadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImageUploadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LanguageChooserComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LanguageChooserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotificationBannerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationBannerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PageLoaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PageLoaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PopupStartFundraiserComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PopupStartFundraiserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PromoteCauseButtonComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PromoteCauseButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QrCodeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QrCodeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QuillEditorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QuillEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QuillViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QuillViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SocialShareButtonsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SocialShareButtonsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StartFundraiserButtonComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StartFundraiserButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StepsToDoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StepsToDoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StripeNotificationBannerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StripeNotificationBannerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StripePromptComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StripePromptComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ThankDonarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ThankDonarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VideoUploadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VideoUploadComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/DialogElementsExampleDialog.html" data-type="entity-link" >DialogElementsExampleDialog</a>
                            </li>
                            <li class="link">
                                <a href="components/EmailComponent-1.html" data-type="entity-link" >EmailComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#directives-links"' :
                                'data-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/MaterialElevationDirective.html" data-type="entity-link" >MaterialElevationDirective</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Background.html" data-type="entity-link" >Background</a>
                            </li>
                            <li class="link">
                                <a href="classes/Category.html" data-type="entity-link" >Category</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomDonationConfiguration.html" data-type="entity-link" >CustomDonationConfiguration</a>
                            </li>
                            <li class="link">
                                <a href="classes/Fundraiser.html" data-type="entity-link" >Fundraiser</a>
                            </li>
                            <li class="link">
                                <a href="classes/FundraiserCustomDonationConfiguration.html" data-type="entity-link" >FundraiserCustomDonationConfiguration</a>
                            </li>
                            <li class="link">
                                <a href="classes/FundraiserCustomStyle.html" data-type="entity-link" >FundraiserCustomStyle</a>
                            </li>
                            <li class="link">
                                <a href="classes/FundraiserDonation.html" data-type="entity-link" >FundraiserDonation</a>
                            </li>
                            <li class="link">
                                <a href="classes/FundraiserDonor.html" data-type="entity-link" >FundraiserDonor</a>
                            </li>
                            <li class="link">
                                <a href="classes/FundraiserMediaList.html" data-type="entity-link" >FundraiserMediaList</a>
                            </li>
                            <li class="link">
                                <a href="classes/FundraiserParentInfo.html" data-type="entity-link" >FundraiserParentInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/FundraiserProfile.html" data-type="entity-link" >FundraiserProfile</a>
                            </li>
                            <li class="link">
                                <a href="classes/FundraiserTranslations.html" data-type="entity-link" >FundraiserTranslations</a>
                            </li>
                            <li class="link">
                                <a href="classes/Information.html" data-type="entity-link" >Information</a>
                            </li>
                            <li class="link">
                                <a href="classes/JWT.html" data-type="entity-link" >JWT</a>
                            </li>
                            <li class="link">
                                <a href="classes/Location.html" data-type="entity-link" >Location</a>
                            </li>
                            <li class="link">
                                <a href="classes/Location_local.html" data-type="entity-link" >Location_local</a>
                            </li>
                            <li class="link">
                                <a href="classes/MediaFiles.html" data-type="entity-link" >MediaFiles</a>
                            </li>
                            <li class="link">
                                <a href="classes/PreviewVideo.html" data-type="entity-link" >PreviewVideo</a>
                            </li>
                            <li class="link">
                                <a href="classes/SocialMedia.html" data-type="entity-link" >SocialMedia</a>
                            </li>
                            <li class="link">
                                <a href="classes/Tools.html" data-type="entity-link" >Tools</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserLogin.html" data-type="entity-link" >UserLogin</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRegistration.html" data-type="entity-link" >UserRegistration</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserResetPassword.html" data-type="entity-link" >UserResetPassword</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AccountMetaDataService.html" data-type="entity-link" >AccountMetaDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountService.html" data-type="entity-link" >AccountService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/APIService.html" data-type="entity-link" >APIService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BalanceService.html" data-type="entity-link" >BalanceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BankService.html" data-type="entity-link" >BankService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CategoryService.html" data-type="entity-link" >CategoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CustomBrandingService.html" data-type="entity-link" >CustomBrandingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DashboardService.html" data-type="entity-link" >DashboardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DonationMetaDataService.html" data-type="entity-link" >DonationMetaDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DonationService.html" data-type="entity-link" >DonationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FundraiserCardService.html" data-type="entity-link" >FundraiserCardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FundraiserMetaDataService.html" data-type="entity-link" >FundraiserMetaDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FundraiserService.html" data-type="entity-link" >FundraiserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HomeMetaDataService.html" data-type="entity-link" >HomeMetaDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HomeService.html" data-type="entity-link" >HomeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LinkService.html" data-type="entity-link" >LinkService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MediaService.html" data-type="entity-link" >MediaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MetaTagService.html" data-type="entity-link" >MetaTagService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MyFundraisersService.html" data-type="entity-link" >MyFundraisersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationService.html" data-type="entity-link" >NotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PaymentRequestService.html" data-type="entity-link" >PaymentRequestService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfileService.html" data-type="entity-link" >ProfileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ReplyChangeService.html" data-type="entity-link" >ReplyChangeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ScriptLoaderService.html" data-type="entity-link" >ScriptLoaderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SearchMetaDataService.html" data-type="entity-link" >SearchMetaDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SearchService.html" data-type="entity-link" >SearchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SentryErrorHandler.html" data-type="entity-link" >SentryErrorHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SidenavService.html" data-type="entity-link" >SidenavService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TabChangeRequestService.html" data-type="entity-link" >TabChangeRequestService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TableCSVService.html" data-type="entity-link" >TableCSVService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ThemeService.html" data-type="entity-link" >ThemeService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/BankAccount.html" data-type="entity-link" >BankAccount</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Category.html" data-type="entity-link" >Category</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Category-1.html" data-type="entity-link" >Category</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Color.html" data-type="entity-link" >Color</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConfirmationDialogData.html" data-type="entity-link" >ConfirmationDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CustomBranding.html" data-type="entity-link" >CustomBranding</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CustomEmail.html" data-type="entity-link" >CustomEmail</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CustomReceipt.html" data-type="entity-link" >CustomReceipt</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogData.html" data-type="entity-link" >DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DonationReceived.html" data-type="entity-link" >DonationReceived</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FundraiserCardData.html" data-type="entity-link" >FundraiserCardData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FundraiserCardDataCustomDonation.html" data-type="entity-link" >FundraiserCardDataCustomDonation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FundraiserClosed.html" data-type="entity-link" >FundraiserClosed</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FundraiserCreated.html" data-type="entity-link" >FundraiserCreated</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FundraiserPublished.html" data-type="entity-link" >FundraiserPublished</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GivenDonation.html" data-type="entity-link" >GivenDonation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Image.html" data-type="entity-link" >Image</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MetaContent.html" data-type="entity-link" >MetaContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MetaContent-1.html" data-type="entity-link" >MetaContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MetaContent-2.html" data-type="entity-link" >MetaContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MetaContent-3.html" data-type="entity-link" >MetaContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MetaContent-4.html" data-type="entity-link" >MetaContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MyFundraisersTab.html" data-type="entity-link" >MyFundraisersTab</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MyFundraisersTab-1.html" data-type="entity-link" >MyFundraisersTab</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PeriodicElement.html" data-type="entity-link" >PeriodicElement</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/profileId.html" data-type="entity-link" >profileId</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReceivedDonation.html" data-type="entity-link" >ReceivedDonation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReceivedDonation-1.html" data-type="entity-link" >ReceivedDonation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReceivedDonation-2.html" data-type="entity-link" >ReceivedDonation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RecurringGivenDonation.html" data-type="entity-link" >RecurringGivenDonation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Register.html" data-type="entity-link" >Register</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ScriptModel.html" data-type="entity-link" >ScriptModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ScriptPluginData.html" data-type="entity-link" >ScriptPluginData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StepsToDO.html" data-type="entity-link" >StepsToDO</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/tableCsvData.html" data-type="entity-link" >tableCsvData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ThankYou.html" data-type="entity-link" >ThankYou</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Window.html" data-type="entity-link" >Window</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});