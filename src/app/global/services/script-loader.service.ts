import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { ScriptModel } from '../interfaces/script-model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
	providedIn: 'root',
})
export class ScriptLoaderService {
	isBrowser: boolean = false;
	private scripts: ScriptModel[] = [];

	constructor(@Inject(PLATFORM_ID) platformId: string) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	/**
	 * Function to load Crisp Chat
	 */
	public loadCrisp(): void {
		/** *TODO: CRISP_WEBSITE_ID, script name and script src should come from environment */
		if (this.isBrowser) (window as any).$crisp = [];
		if (this.isBrowser)
			(window as any)['CRISP_WEBSITE_ID'] =
				'26dcc138-6a23-47f7-93c3-92ed66fe2afd';
		/** *INFO: below code supress warning from crisp */
		if (this.isBrowser) (window as any)['$crisp'].push(['safe', true]);

		/** * INFO: This callback gets executed once $crisp is fully loaded
		 *(window as any)['CRISP_READY_TRIGGER'] = function() {
		 *(window as any).console.log('crisp loaded');
		 *};
		 */

		/** *INFO: load crisp chat box library after setting the crisp variables in window object */
		this.load(<ScriptModel>{
			name: 'crisp-chat-box',
			src: 'https://client.crisp.chat/l.js',
		}).subscribe();
	}

	/**
	 * Function to load coookie consent.
	 */

	public loadCookieConsent(): void {
		this.load(<ScriptModel>{
			name: 'cookie-consent',
			src: 'https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js',
		}).subscribe(() => {
			/** * INFO: setup style and content for cookie consent */
			/** * INFO: You can add additional options - https://www.osano.com/cookieconsent/documentation/javascript-api/ */
			if (this.isBrowser)
				(window as any)['cookieconsent']['initialise']({
					palette: {
						popup: { background: '#292780' },
						button: { background: '#32bf55' },
					},
					theme: 'classic',
					position: 'bottom-left',
					content: {
						link: $localize`:@@cookie_consent_learnMore_link_label:Learn More`,
						href: '/privacy-en-cookies',
						message: $localize`:@@cookie_consent_message_title:This website uses cookies to improve the user experience. By using our website you consent to all cookies in accordance with our Cookie Policy.`,
						dismiss: $localize`:@@cookie_consent_dismiss_title:Okay. Got it!`,
					},
				});
		});
	}

	/**
	 * Function To load a Script Model
	 * @param script
	 * @returns
	 */
	public load(script: ScriptModel): Observable<ScriptModel> {
		return new Observable<ScriptModel>((observer: Observer<ScriptModel>) => {
			const existingScript = this.scripts.find((s) => s.name == script.name);

			/** *Complete if already loaded */
			if (existingScript && existingScript.loaded) {
				observer.next(existingScript);
				observer.complete();
			} else {
				/** *Add the script */
				this.scripts = [...this.scripts, script];

				/** *Load the script. */
				let scriptElement: any;
				if (this.isBrowser) scriptElement = document.createElement('script');
				scriptElement.type = 'text/javascript';
				scriptElement.src = script.src;
				scriptElement.async = true;

				scriptElement.onload = () => {
					script.loaded = true;

					observer.next(script);

					observer.complete();
				};

				scriptElement.onerror = (error: any) => {
					observer.error("Couldn't load script " + script.src);
				};

				if (this.isBrowser)
					document.getElementsByTagName('body')[0].appendChild(scriptElement);
			}
		});
	}
}
