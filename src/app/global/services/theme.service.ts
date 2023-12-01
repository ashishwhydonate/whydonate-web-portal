import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import tinycolor, { TinyColor } from '@ctrl/tinycolor';
export interface Color {
	name: string;
	hex: string;
	darkContrast: boolean;
}
@Injectable({
	providedIn: 'root',
})
export class ThemeService {
	isBrowser: boolean = false;
	constructor(@Inject(PLATFORM_ID) platformId: string) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	computeColors(hex: string): Color[] {
		/** *let color = tinycolor */
		return [
			this.getColorObject(tinycolor(hex).lighten(52), '50'),
			this.getColorObject(tinycolor(hex).lighten(37), '100'),
			this.getColorObject(tinycolor(hex).lighten(26), '200'),
			this.getColorObject(tinycolor(hex).lighten(12), '300'),
			this.getColorObject(tinycolor(hex).lighten(6), '400'),
			this.getColorObject(tinycolor(hex), '500'),
			this.getColorObject(tinycolor(hex).darken(6), '600'),
			this.getColorObject(tinycolor(hex).darken(12), '700'),
			this.getColorObject(tinycolor(hex).darken(18), '800'),
			this.getColorObject(tinycolor(hex).darken(24), '900'),
			this.getColorObject(tinycolor(hex).lighten(50).saturate(30), 'A100'),
			this.getColorObject(tinycolor(hex).lighten(30).saturate(30), 'A200'),
			this.getColorObject(tinycolor(hex).lighten(10).saturate(15), 'A400'),
			this.getColorObject(tinycolor(hex).lighten(5).saturate(5), 'A700'),
		];
	}
	getColorObject(value: TinyColor, name: string): Color {
		const c = tinycolor(value);
		return {
			name: name,
			hex: c.toHexString(),
			darkContrast: c.isLight(),
		};
	}
	setTheme(
		primaryColorHex: string,
		SecondaryColorHex: string,
		fontFamily?: string
	) {
		// set Font Family
		// console.log('--custom-font-family', fontFamily);
		if (fontFamily) {
			if (this.isBrowser)
				document.documentElement.style.setProperty(
					`--custom-font-family`,
					fontFamily || 'Roboto'
				);
		}
		let primaryColorPalette = this.computeColors(primaryColorHex);
		for (const color of primaryColorPalette) {
			const key1 = `--theme-primary-${color.name}`;
			const value1 = color.hex;
			const key2 = `--theme-primary-contrast-${color.name}`;
			const value2 = color.darkContrast ? 'rgba(black, 0.87)' : 'white';
			if (this.isBrowser)
				document.documentElement.style.setProperty(key1, value1);
			if (this.isBrowser)
				document.documentElement.style.setProperty(key2, value2);
		}

		let secondaryColorPalette = this.computeColors(SecondaryColorHex);

		for (const color of secondaryColorPalette) {
			const key1 = `--theme-secondary-${color.name}`;
			const value1 = color.hex;
			const key2 = `--theme-secondary-contrast-${color.name}`;
			const value2 = color.darkContrast ? 'rgba(black, 0.87)' : 'white';
			if (this.isBrowser)
				document.documentElement.style.setProperty(key1, value1);
			if (this.isBrowser)
				document.documentElement.style.setProperty(key2, value2);
		}
	}

	/** *Returns false if color is not dark */
	isColorAccessible(ColorHex: string) {
		return tinycolor(ColorHex).isDark();
	}

	getWhydonateColors(): { primary: string; accent: string } {
		return {
			primary: '#32bf55',
			accent: '#363396',
		};
	}
}
