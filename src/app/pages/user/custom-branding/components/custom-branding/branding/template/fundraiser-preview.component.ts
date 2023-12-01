/**This component display preview of the fundraiser once all details are submitted */

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface DialogData {
	primaryColor: string;
	secondaryColor: string;
}
@Component({
	selector: 'app-fundraiser-preview',
	template: `
		<div ngClass="p-t-l p-r-l">
			<button mat-icon-button class="close-button" (click)="onCloseClick()">
				<img
					src="https://res.cloudinary.com/whydonate/image/upload/v1667418126/whydonate-production/platform/svg-icons/crossBlack.svg"
				/>
			</button>
		</div>
		<h3 mat-dialog-title i18n="@@custom-branding-fundraiser-preview">
			Fundraiser preview
		</h3>
		<div mat-dialog-content fxLayout="column">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				viewBox="0 0 500 500"
			>
				<style type="text/css">
					.logo {
						height: 22px;
					}
					rect.card-elevation-z1 {
						filter: drop-shadow(0 1px 1px rgb(0 0 0 / 30%));
					}
					rect.card-elevation-z4 {
						filter: drop-shadow(0 1px 3px rgb(0 0 0 / 30%));
					}
				</style>
				<image [attr.href]="data.customLogo" x="16" y="8" class="logo" />
				<rect
					width="72"
					height="18"
					x="364"
					y="12"
					fill="none"
					stroke="#363396"
					[attr.stroke]="data.primaryColor"
					stroke-width="2"
					class="accent"
					rx="1"
					ry="1"
				/>
				<path
					fill="#363396"
					[attr.fill]="data.primaryColor"
					d="M374 18h54v6h-54z"
					class="accent"
				/>
				<circle cx="465" cy="21" r="13" fill="#d8d8d8" />
				<rect
					width="326"
					height="256"
					y="224"
					fill="#fff"
					class="card-elevation-z{{ data.customShadow }}"
					rx="1"
					ry="1"
				/>
				<path fill="#d8d8d8" d="M0 40h326v184H0z" />
				<rect
					width="152"
					height="94.5"
					x="338"
					y="50"
					fill="#fff"
					class="card-elevation-z{{ data.customShadow }}"
					rx="1"
					ry="1"
				/>
				<path fill="#d8d8d8" d="M346 56h62v8h-62zm42 14h78v12h-78z" />
				<rect
					width="132"
					height="18"
					x="346"
					y="92"
					fill="#363396"
					[attr.fill]="data.secondaryColor"
					class="accent"
					rx="1"
					ry="1"
				/>
				<rect
					width="132"
					height="18"
					x="346"
					y="116"
					fill="none"
					stroke="#363396"
					[attr.stroke]="data.secondaryColor"
					stroke-width="2"
					class="accent"
					rx="1"
					ry="1"
				/>
				<path
					fill="#363396"
					[attr.fill]="data.secondaryColor"
					d="M381 122h62v6h-62z"
					class="accent"
				/>
				<rect
					width="152"
					height="72.4"
					x="338"
					y="154"
					fill="#fff"
					class="card-elevation-z{{ data.customShadow }}"
					rx="1"
					ry="1"
				/>
				<rect
					width="132"
					height="18"
					x="346"
					y="199"
					fill="none"
					stroke="#363396"
					[attr.stroke]="data.secondaryColor"
					stroke-width="2"
					class="accent"
					rx="1"
					ry="1"
				/>
				<path
					fill="#363396"
					[attr.fill]="data.secondaryColor"
					d="M380 205h62v6h-62z"
					class="accent"
				/>
				<circle cx="361" cy="178" r="13" fill="#d8d8d8" />
				<path fill="#979797" d="M386 164h44v8h-44z" />
				<path fill="#d8d8d8" d="M386 178h86v12h-86z" />
				<path fill="#979797" d="M16 236h86v12H16zm0 30h58v8H16z" />
				<path
					fill="#d8d8d8"
					d="M90 266h58v8H90zm-74 34h280v8H16zm0 14h280v8H16zm0 14h280v8H16zm0 14h280v8H16zm0 14h280v8H16zm0 14h232v8H16zm0 32h92v60H16zm96 0h92v60h-92zm96 0h92v60h-92z"
				/>
				<rect
					width="152"
					height="200"
					x="338"
					y="236"
					fill="#fff"
					class="card-elevation-z{{ data.customShadow }}"
					rx="1"
					ry="1"
				/>
				<path fill="none" stroke="#d8d8d8" d="M338 311h152m-152 63h152" />
				<circle cx="361" cy="273.7" r="13" fill="#d8d8d8" />
				<path fill="#979797" d="M386 262h44v8h-44z" />
				<path fill="#d8d8d8" d="M386 274h62v8h-62z" />
				<path fill="#979797" d="M462 266h16v16h-16z" />
				<rect
					width="44"
					height="12"
					x="404"
					y="290"
					fill="#d8d8d8"
					rx="6"
					ry="6"
				/>
				<circle cx="392" cy="296" r="6" fill="#d8d8d8" />
				<path
					fill="#363396"
					[attr.fill]="data.secondaryColor"
					d="M436 244h42v6h-42z"
					class="accent"
				/>
				<path fill="none" stroke="#d8d8d8" d="M0 285h323" />
				<path
					fill="none"
					stroke="#363396"
					[attr.stroke]="data.secondaryColor"
					stroke-width="2"
					d="M14 284h64"
					class="accent"
				/>
				<circle cx="361" cy="333" r="13" fill="#d8d8d8" />
				<path fill="#979797" d="M386 321h44v8h-44z" />
				<path fill="#d8d8d8" d="M386 333h62v8h-62z" />
				<path fill="#979797" d="M462 325h16v16h-16z" />
				<rect
					width="44"
					height="12"
					x="404"
					y="350"
					fill="#d8d8d8"
					rx="6"
					ry="6"
				/>
				<circle cx="392" cy="356" r="6" fill="#d8d8d8" />
				<circle cx="361" cy="397" r="13" fill="#d8d8d8" />
				<path fill="#979797" d="M386 385h44v8h-44z" />
				<path fill="#d8d8d8" d="M386 397h62v8h-62z" />
				<path fill="#979797" d="M462 390h16v16h-16z" />
				<rect
					width="44"
					height="12"
					x="404"
					y="414"
					fill="#d8d8d8"
					rx="6"
					ry="6"
				/>
				<circle cx="392" cy="420" r="6" fill="#d8d8d8" />
				<path fill="#979797" d="M348 244h44v8h-44zm-3-174h34v12h-34z" />
				<path fill="none" stroke="#fff" d="M0 188h326" />
				<circle cx="21" cy="207" r="13" fill="#979797" />
				<path
					fill="#979797"
					d="M46 208h62v6H46zm121 0h62v6h-62zm0-8h42v6h-42zm-121 0h42v6H46z"
				/>
				<circle cx="149" cy="207" r="7" fill="#979797" />
				<rect
					width="44"
					height="12"
					x="8"
					y="169"
					fill="#979797"
					rx="6"
					ry="6"
				/>
				<path fill="none" stroke="#d8d8d8" d="M0 0h500v40H0z" />
			</svg>
		</div>
		<div mat-dialog-actions align="end">
			<button
				i18n="@@button_close"
				mat-flat-button
				class="button-button-style"
				mat-dialog-close
				color="accent"
			>
				Close
			</button>
		</div>
	`,
	styles: [],
})
/** *Fundraiser Preview Component */
export class FundraiserPreviewComponent implements OnInit {
	whydonateLogo =
		'data:image/webp;base64,UklGRm4EAABXRUJQVlA4TGIEAAAvucAJEP+gqG0jyeEPbtDs66SBoG3bONgH6AxfBW0bObnxpJ/qM5lR1DaSc4tgtjcE9zz+jI5FwJm3ctvbT8B988vXoj6ngj86NGDdFGAGIyMDSJIsGECQycAEAwM+KbACkGXbdpVKx7di0HCBMiSQ0/9umr0PoCXfEf2HKMlKXWm4r12NIiCYfIJI3Y+6TPLgZePkmXWFdNtGveqt2mwaL13HuGmMK9HnSo63t3yONsb4/K/QtfiVnN1bPkdQVfkafd+3v0xSTd/LXqra/zKqGr5GV5LUD+O/mt2HN/X/ze7wlp2pw7y//NfIqpN8npnF72c02C34uDvnjsjVOXel630927P2j0XBUNs8vKFPjKqaY3yxIv6DFLuAC12RfaFyzh2I3eXuXFUsdXlTibCup7LyAPWosXr6AYpu+iOiapRmBO2IvwTK/s1VusIjjKj0p/6oaPUn4MgGEWRXOZCLbdvjm7t9pmmoZz0oSzAq2SuQKhgCwbAREPObGKMXabKh9Ie4oD3kAlzJdjcCtKHxbkVD/vuCZ5rcivicKaGWd+yaF+sBPks6hdfEmnTlWt8mIx0UjHmnRqRV1XY97LgbTnMtLsTxzoS7nk4VBcGR/7xjOAcu/w0sAtcaOMVlVICjoNgSvjPM8oBlkwKRwyI/KHIHtMsyITgmcaQTWuJWWgpkyz3/SZY64Sy1FYuKnhuN7JRoVa1hjzcDZQ7wMdNwELQQuKTBuCLnMtywBzNIBePC7iFO7NsbBzSOdKTKZTDNFJNXgSdg+tmF45EDtcfICX2RsO4Q3RiQAcp1Vel3A9demX3hZjq9QgPucDOR99CRvbH7pSei6mRsnhZ0/AvxLYkVirzRRjUlqS4+DQQLuP5S+l9gB0G/IyMGRlicyKIJAtCINNuEEgkr8mgvtllZBiNMUAGbiDeM9aI7HQMcs4IWUOFwKS5eCBjzQn+LIlYsRkgHRqKqycOGajRc8E/QsecYCEb28ywPStiLv9WL0QDXCzRUpWUZ2Lm6F70MOMBqdLC1exIZyBuVEDUMHNeeY6Bj4oJTR7OgnTEabsbeL+a5LkaorFzYOUBHkdbRvzFeW8vDRrjWdjWprTCZWUbfPQ3yc26UPMfBgZyNAu6Oyzkge864T6GSO1BJGNgeiTycZnqSZo1hnmjcEg7k2hZUXPh8oVtwRkUOXFSc2y1HqkJl6T+EBAmoZ8eNIYyGk8rmmek5lfFC0mLkfx2hKXKBGPqIM5l36Q0OX/+NuoAbYFtkBUeKCvqCVXbG/jcqQHywhzujp7k/Elg7YtrmSVoj2dXzGW7oh6iq85hVmg9Jq9lRZuyjpqG179p9iJrjixbUWD3NM2yOnUif4Kgl9WvSogEY+BVzjgE0jeufOXxWTOP9gvQrmeTz7OD7+BvP1qb/69maQ7nLb8gzraGVb3H6mSeaXVraLTzkS9yP8jvirfu6r8sBnzT8IEG2Vzy/N5tONptWthl4bzatbDatbDbb/BY=';

	constructor(
		public dialogRef: MatDialogRef<FundraiserPreviewComponent>,
		@Inject(MAT_DIALOG_DATA)
		public data: {
			primaryColor: string;
			secondaryColor: string;
			customShadow: string;
			customLogo: string;
		}
	) {}

	ngOnInit(): void {}
	onCloseClick() {
		this.dialogRef.close();
	}
}
