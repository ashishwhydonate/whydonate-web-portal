/*This component comes into action upon clicking Start Fundraiser button on the Header
  and selecting New Fundraiser from the pop up window*/

import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import {
	AbstractControl,
	AsyncValidatorFn,
	FormGroup,
	UntypedFormControl,
	UntypedFormGroup,
	ValidationErrors,
	Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
	DomSanitizer,
	SafeHtml,
	SafeResourceUrl,
} from '@angular/platform-browser';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { categories } from 'src/app/pages/search/components/search/category-data';
import { DashboardService } from 'src/app/pages/user/dashboard/services/dashboard.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { environment } from 'src/environments/environment';
import { Tools } from 'src/utilities/tools';
import { Category } from '../../../models/category';
import { MediaFiles } from '../../../models/mediaFiles';
import { CategoryService } from '../../../services/category.service';
import { FundraiserService } from '../../../services/fundraiser.service';
import { MediaService } from '../../../services/media.service';
import { AddBackgroundDialogComponent } from './add-background-dialog/add-background-dialog.component';
import { AddVideoBackgroundDialogComponent } from './add-video-background-dialog/add-video-background-dialog.component';
import { UploadImageVideoPopUpComponent } from './upload-image-video-pop-up/upload-image-video-pop-up.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormControl } from '@angular/forms';
import { any } from 'cypress/types/bluebird';
import { base64ToFile } from 'ngx-image-cropper';
@Component({
	selector: 'app-create-fundraiser',
	templateUrl: './create-fundraiser.component.html',
	styleUrls: ['./create-fundraiser.component.scss'],
})

/*
 * This class takes care of creating a new fundraiser-------------------------------------------------------------
 */
export class CreateFundraiserComponent implements OnInit {
	/*
	 * Global Variables-------------------------------------------------------------
	 */
	isLoading: boolean = false;
	slug: string = '';
	createFundraiserForm!: UntypedFormGroup;
	shareFundraiserForm!: UntypedFormGroup;
	parentFundraiser: any;
	isAddVideo: boolean = false;
	imageFiles: File[] = [];
	imgUrl: any[] = [];
	isVideo: boolean = false;
	embedVideoUrl: any[] = [];
	mediaFiles: MediaFiles[] = [];
	disableVideoSaveButton: boolean = true;
	categories: any;
	locations: any = [];
	isShowTotalAmountDonated: Boolean = true;
	isAllowConnected: Boolean = true;
	imagePath: any;
	imagePath_blob: any;
	videoPath: any;
	profileResponse: any;
	minEndDate: Date = new Date();
	public _categories = categories;
	selectedCategories: Category[] = [];
	isShareFundraiserFormValid: boolean = false;
	fundraiserLocalId: any;
	emptyContact: any = {};
	receivedForm: any;
	isFormValid: boolean = true;
	youtubeIframe!: SafeHtml | undefined;
	isMobileView: boolean = false;
	isDialogOpen: boolean = false;
	allCurrenciesData: any;
	currency: FormControl = new FormControl();
	symbol: FormControl = new FormControl();
	selectedCurrency: string = '';
	selectedSymbol: string = '';
	maxTargetAmount: number = 999999;
	isEditingSlug: boolean = false;
	isBrowser: boolean = false;
	/*
	 * Constructor Function-------------------------------------------------------------
	 * @param router
	 * @param notificationService
	 * @param fundraiserServicePse
	 * @param datepipe
	 * @param accountService
	 * @param sanitizer
	 */
	constructor(
		public router: Router,
		public notificationService: NotificationService,
		public fundraiserService: FundraiserService,
		public datepipe: DatePipe,
		public accountService: AccountService,
		public sanitizer: DomSanitizer,
		public categoryService: CategoryService,
		public dialog: MatDialog,
		public _dashboardService: DashboardService,
		public mediaService: MediaService,
		private breakpointObserver: BreakpointObserver,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
	}

	/*
	 * Lifecycle Hooks~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	ngOnInit(): void {
		// Subscribe to viewport changes and detect mobile view
		this.breakpointObserver
			.observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
			.subscribe((result) => {
				this.isMobileView = result.matches;
			});

		//Get All Currencies
		this.fundraiserService.getAllCurrencies().subscribe((res: any) => {
			this.allCurrenciesData = res?.data?.list_of_currencies;
		});

		// Subscribe to currency changes
		this.currency.valueChanges.subscribe((currency_code: any) => {
			this.selectedCurrency = currency_code;

			let filteredCurrency = this.allCurrenciesData.find(
				(currencyData: any) => {
					return currencyData.currency === this.selectedCurrency;
				}
			);
			this.selectedSymbol = filteredCurrency.symbol;

			// GET MAX TARGET AMOUNT FOR SELECTED CURRENCY CODDE
			this.fundraiserService
				.getMaxTargetAmountByCurrency(this.selectedCurrency)
				.subscribe((res: any) => {
					this.maxTargetAmount =
						res?.data?.list_of_currencies[0]?.max_target_amount;
				});
		});
		/** *Check Login status - if not login send to login screen */
		this.accountService.getLoginInformation().subscribe((info: any) => {
			if (info == false) {
				this.router.navigate(['account/login']);
			}
		});
		if (this.accountService.checkHeaders()) {
			this._dashboardService.getProfile().subscribe((res: any) => {
				/** *Success */
				this.profileResponse = res.data;
			});
		}

		/** *Get Category List */
		this.getCategoryList();

		/** *DEFINE FORM GROUP FOR FIRST STEP */
		this.createFundraiserForm = new UntypedFormGroup({
			title: new UntypedFormControl('', [
				Validators.required,
				Validators.minLength(15),
				Validators.maxLength(70),
				Validators.pattern(
					/^[a-zA-Z0-9_\s\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FAC0}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{1FC00}-\u{1FCFF}\u{1FD00}-\u{1FDFF}\u{1FE00}-\u{1FEFF}\u{1FF00}-\u{1FFFF}\u{2B05}\u{1F004}]*$/u
				),
			]),
			category: new UntypedFormControl('', [Validators.required]),
			location: new UntypedFormControl('', {
				validators: [Validators.required],
				asyncValidators: [this.isLocationValid()],
			}),

			custom_url: new UntypedFormControl('', {
				validators: [
					Validators.required,
					Validators.minLength(1),
					Validators.maxLength(75),
					Validators.pattern('^[a-zA-Z0-9-]*$'),
				],
				asyncValidators: [this.isSlugUnique()],
			}),
			target_amount: new UntypedFormControl('', [
				Validators.max(this.maxTargetAmount),
				Validators.pattern('^[0-9]+$'),
			]),
			end_date: new UntypedFormControl('', []),
		});
	}

	/*
	 * Image And Video Functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */

	openImageCropperDialog() {
		let fileInput: any;
		if (this.isBrowser)
			fileInput = document.getElementById(
				'upload_image_input'
			) as HTMLInputElement;

		// Check if the dialog is already open
		if (this.isDialogOpen) {
			return;
		}

		// Add event listener to handle file selection
		const handleChange = (event: Event) => {
			const inputElement = event.target as HTMLInputElement;
			if (inputElement.files && inputElement.files.length > 0) {
				const selectedFile = inputElement.files[0];
				const selectedFilePath = URL.createObjectURL(selectedFile);
				const dialogRef = this.dialog.open(AddBackgroundDialogComponent, {
					data: {
						imagePath: selectedFilePath,
						autoFocus: false,
					},
				});
				dialogRef.componentInstance.valueSelected.subscribe(
					(selectedValue: any) => {
						this.imagePath = URL.createObjectURL(base64ToFile(selectedValue));
						this.imagePath_blob = selectedValue;
					}
				);
			}
			this.isDialogOpen = false; // Reset the flag when the dialog is closed
			inputElement.value = ''; // Reset the input value after processing
			fileInput?.removeEventListener('change', handleChange); // Remove the event listener
		};

		fileInput?.addEventListener('change', handleChange);

		// Simulate a click on the file input
		fileInput?.click();
	}

	openVideoDialog() {
		const dialogRef = this.dialog.open(AddVideoBackgroundDialogComponent, {
			data: {
				videoPath: this.videoPath,
				autoFocus: false,
			},
			width: '500px',
		});

		dialogRef.afterClosed().subscribe((update: any) => {
			if (update) {
				this.videoPath = update; // Update the video path
				this.youtubeIframe = this.checkVideoUrl(update);
				// stepper.next(); //
			}
		});
	}

	openimagepopup() {
		const dialogRef = this.dialog.open(UploadImageVideoPopUpComponent, {
			width: '500px',
			data: { videoPath: this.videoPath, imagePath: this.imagePath },
		});

		dialogRef.componentInstance.valueSelected.subscribe(
			(selectedValue: any) => {
				this.getLinkType(selectedValue);
			}
		);
	}

	openvideopopup() {
		const dialogRef = this.dialog.open(UploadImageVideoPopUpComponent, {
			width: '500px',
			data: { videoPath: this.videoPath, imagePath: this.imagePath },
		});

		dialogRef.componentInstance.valueSelected.subscribe(
			(selectedValue: any) => {
				this.getLinkType(selectedValue);
			}
		);
	}

	// Check if it is a file ot url. It is to change between iframe and image after popup call.
	getLinkType(this: any, link: string): void {
		// Check if it is a Blob URL
		if (link.startsWith('blob:')) {
			this.videoPath = null;
			this.imagePath = URL.createObjectURL(base64ToFile(link));
			this.imagePath_blob = link;
			return;
		}

		// Check if it is a base64 image data
		if (link.startsWith('data:image')) {
			this.videoPath = null;
			this.imagePath = URL.createObjectURL(base64ToFile(link));
			this.imagePath_blob = link;
			return;
		}

		// Check if it is a YouTube URL using regex
		const youtubeRegex =
			/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=|v\/)|youtu\.be\/)([\w\-]+)(?:\S+)?$/;
		if (youtubeRegex.test(link)) {
			this.youtubeIframe = this.generateYouTubeIframe(link);
			this.videoPath = link;
			this.imagePath = null;
			return;
		}

		// Check if it is a Vimeo URL using regex
		const vimeoRegex =
			/^(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)(\d+)(?:\S+)?$/;
		if (vimeoRegex.test(link)) {
			this.youtubeIframe = this.generateVimeoIframe(link);
			this.videoPath = link;
			this.imagePath = null;
			return;
		}

		// Default case: unknown link type
		this.videoPath = null;
		this.imagePath = null;
	}

	checkVideoUrl(url: string) {
		// Vimeo link pattern
		const vimeoPattern =
			/^(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)(\d+)(?:\S+)?$/;

		// YouTube link pattern
		const youtubePattern =
			/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=|v\/)|youtu\.be\/)([\w\-]+)(?:\S+)?$/;

		if (url.match(vimeoPattern)) {
			this.youtubeIframe = this.generateVimeoIframe(url);
		} else if (url.match(youtubePattern)) {
			this.youtubeIframe = this.generateYouTubeIframe(url);
		}
		return this.youtubeIframe;
	}

	generateVimeoIframe(videoLink: string): SafeHtml {
		const vimeoVideoId = this.getVideoIdVimeo(videoLink);

		const angularTag = `
		<iframe
			fxFill
			width="100%"
			height="100%"
			id="create_fundraiser_Iframe"
			frameborder="0"
			allowfullscreen
			src="https://player.vimeo.com/video/${vimeoVideoId}"
			title="Vimeo Video"
		></iframe>

		`;

		// Sanitize the HTML tag using DomSanitizer
		const safeHTML = this.sanitizer.bypassSecurityTrustHtml(angularTag);

		return safeHTML;
	}

	generateYouTubeIframe(videoLink: string): SafeHtml {
		const videoId = this.getVideoIdYoutube(videoLink);
		const angularTag = `
		<iframe
			loading = "lazy"
			width="100%"
			height="100%"
			id="create_fundraiser_Iframe"
			fxfill
			src="https://www.youtube-nocookie.com/embed/${videoId}"
			title="The Youtube Video"
		></iframe>`;
		// Sanitize the HTML tag using DomSanitizer
		const safeHTML = this.sanitizer.bypassSecurityTrustHtml(angularTag);
		return safeHTML;
	}

	getVideoIdYoutube(videoLink: string): string {
		// Extract the video ID from the YouTube link
		const pattern =
			/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=|v\/)|youtu\.be\/)([\w\-]+)(?:\S+)?$/;
		const match = videoLink?.match(pattern);
		return match && match[1] ? match[1] : '';
	}

	getVideoIdVimeo(videoLink: string): string {
		// Extract the video ID from the Vimeo link
		const pattern = /^(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)(\d+)(?:\S+)?$/;
		const match = videoLink?.match(pattern);
		return match && match[1] ? match[1] : '';
	}
	/*
	 * Convert data uri to blob-----------------------------------------------
	 */
	dataURItoBlob(dataURI: any) {
		var byteString = atob(dataURI.toString().split(',')[1]);
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ia], { type: 'image/jpeg' });
		//return new File([blob], 'blob', { type: 'image/jpeg;charset=utf-8' });
	}

	/*
	 * Form Functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */

	getCategoryList() {
		this.categoryService.getCategorylist().subscribe((response: any) => {
			this.categories = JSON.parse(JSON.stringify(response))['data'];
		});
	}

	/*
	 * Function to retrieve places list---------------------------------------
	 * @returns
	 */

	searchPlaces(term: string) {
		try {
			if (term.trim()) {
				this.categoryService.getLocation(term).subscribe(
					(result) => {
						this.locations = JSON.parse(JSON.stringify(result))['data'][
							'result'
						];
					},
					(error) => {
						this.createFundraiserForm?.controls.location.markAsDirty({
							onlySelf: true,
						});
					}
				);
			}
		} catch (e) {}
	}

	/*
	 * Validator Function to check if selected location is from Location List-------------------------------
	 * @returns
	 */

	isLocationValid(): AsyncValidatorFn {
		return (control: AbstractControl) => {
			const validationPromise: Promise<ValidationErrors | null> = new Promise(
				(resolve, reject) => {
					let value = control.value;
					let doesExist: boolean = false;
					if (this.locations?.length > 0) {
						this.locations.forEach((location: any) => {
							if (location['description'] == value) {
								doesExist = true;
							}
						});
					}

					if (doesExist) {
						resolve(null);
					} else {
						resolve({ location: 'doNotExist' });
					}
				}
			);
			return validationPromise;
		};
	}

	/*
	 * Slug (Custom Url) Functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */

	/*
	 * Validator Function to check if slug is unique-------------------------------
	 * @returns
	 */
	isSlugUnique(): AsyncValidatorFn {
		return (control: AbstractControl) => {
			const validationPromise: Promise<ValidationErrors | null> = new Promise(
				(resolve, reject) => {
					this.fundraiserService.isSlugUnique(control.value).subscribe(
						(result: any) => {
							if (result['data']['slug_in_use']) {
								resolve({ slugInUse: true });
							} else {
								resolve(null);
							}
						},
						(error) => {
							resolve(null);
						}
					);
				}
			);
			return validationPromise;
		};
	}

	/*
	 * Function to replace emoji and space in slug with hyphen------------------------------
	 * @param slug
	 */
	setSlug(event: Event) {
		if (!this.isEditingSlug) {
			const slug = (event.target as HTMLInputElement).value;
			// Remove emojis from the slug
			const newVal = this.removeEmojis(slug);
			this.createFundraiserForm?.controls['custom_url'].setValue(
				newVal.trim().toLowerCase()
			);
			// this.createFundraiserForm.controls['custom_url'].markAsTouched();
			const controlNames = ['custom_url', 'title'];
			controlNames.forEach((controlName) => {
				this.createFundraiserForm.controls[controlName].markAsTouched();
			});
		}
	}

	/*
	 * Miscellaneous Functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */

	openHowItWorks() {
		if (this.isBrowser)
			window.open(
				'https://helpdesk.whydonate.com/en/article/enabledisable-connected-team-fundraisers-9poye0/',
				'_blank'
			);
	}

	changeShowTotalAmountDonated() {
		this.isShowTotalAmountDonated = !this.isShowTotalAmountDonated;
	}

	changeAllowConnectedFundraiser() {
		this.isAllowConnected = !this.isAllowConnected;
	}

	/*
	 * Social Media  Validator Functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */

	getYouTubeEmbedUrl(videoPath: string): SafeResourceUrl {
		// Construct the YouTube embed URL
		const videoId = this.extractVideoId(videoPath);
		const embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
			`https://www.youtube.com/embed/${videoId}`
		);
		return embedUrl;
	}

	extractVideoId(url: string): string | undefined {
		const match = url.match(
			/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|shorts\/)?([^\s/?&]+)/i
		);
		return match?.[1];
	}

	/*
	 * Save Fundraiser~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	saveFundraiser() {
		this.createFundraiserForm.markAllAsTouched();
		if (this.createFundraiserForm.valid) {
			this.isLoading = true;

			/** *Check for unlimited */
			let unlimited: boolean = false;
			let amount_target: string =
				this.createFundraiserForm.get('target_amount')?.value;
			if (
				amount_target == null ||
				amount_target == undefined ||
				amount_target.length <= 0 ||
				amount_target == '0'
			) {
				unlimited = true;
				amount_target = '0';
			}

			/** *Retrieve end_date in proper format */
			let end_date = this.datepipe.transform(
				this.createFundraiserForm.get('end_date')?.value,
				'yyyy-MM-dd'
			);
			if (end_date == null || end_date == undefined) {
				end_date = this.datepipe.transform(
					new Date('9999-12-31'),
					'yyyy-MM-dd'
				);
			}

			let location_local: string = '';

			this.locations.forEach((location: any) => {
				if (
					location['description'] ==
					this.createFundraiserForm.get('location')?.value
				) {
					if (location['description']) {
						location_local = location['description'];
					} else {
						location_local = this.createFundraiserForm.get('location')?.value;
					}
				}
			});

			/** *Create Object To Pass To API */
			let createFundraiser: Object;

			createFundraiser = {
				title: this.createFundraiserForm.get('title')?.value,
				slug: this.createFundraiserForm.get('custom_url')?.value,
				category_id: this.createFundraiserForm.get('category')?.value,
				location_local: location_local,
				language_code: this.accountService.getLocaleId(),
				unlimited: unlimited,
				currency_code: this.selectedCurrency,
				end_date: end_date,
				show_donation_details: this.isShowTotalAmountDonated,
				allow_child: this.isAllowConnected,
				tip_enabled: true,
				is_draft: true,
				created_on: environment.homeUrl,
				video: this.videoPath,
				amount_target: amount_target,
			};
			if (this.accountService.checkHeaders()) {
				this.fundraiserService
					.createFundraiser(createFundraiser)
					.pipe(
						map((response: any) => {
							if (response['status'] == 200) {
								/** *Notify User */
								this.notificationService.openNotification(
									$localize`:@@create_fundraiser_fundraiserCreated_notification:Fundraiser created successfully.`,
									'OK',
									'success'
								);

								//ZARAZ

								if (this.isBrowser)
									(window as any)?.zaraz?.track('Fundraiser_Created', {
										user_id: this.profileResponse?.profile?.user_id,
										fundraiser_id: response?.data?.id,
									});
								return response;
							}
						}),
						mergeMap((response: any) => {
							this.fundraiserLocalId = response['data']['id'];
							/*
							 * NOTE: Once a fundraiser object is created in database, Four API calls are required.
							 * 1. Update the background image of fundraiser
							 * 2. Update the social media details of fundraiser
							 * 3. Create a new merchant at OPP platform
							 *
							 */

							// 1. Background API CALL----------------------------------------------------------------------
							let backgroundObject;
							let backgroundVideoObject;
							if (
								this.imagePath != undefined &&
								this.imagePath.toString().length > 0
							) {
								backgroundObject = {
									image: this.dataURItoBlob(this.imagePath_blob),
									slug: response['data']['slug'],
								};
							} else if (
								this.videoPath != undefined &&
								this.videoPath.toString().length > 0
							) {
								backgroundVideoObject = {
									video: this.videoPath,
									slug: response['data']['slug'],
								};
								let defaultBackground = Tools.getBase64_FundraiserDefaultBg();
								backgroundObject = {
									image: this.dataURItoBlob(defaultBackground),
									slug: response['data']['slug'],
								};
							} else {
								let defaultBackground = Tools.getBase64_FundraiserDefaultBg();
								backgroundObject = {
									image: this.dataURItoBlob(defaultBackground),
									slug: response['data']['slug'],
								};
							}

							const backgroundAPICall =
								this.fundraiserService.uploadFundraiserBackground(
									backgroundObject
								);

							// 2. SOCIAL MEDIA API CALL----------------------------------------------------------------------
							let socialMediaPayload = {
								slug: response['data']['slug'],
								email: this.receivedForm?.email || '',
								facebook: this.receivedForm?.facebook || '',
								twitter: this.receivedForm?.twitter || '',
								linked_in: this.receivedForm?.linked_in || '',
								instagram: this.receivedForm?.instagram || '',
								website: this.receivedForm?.website || '',
							};
							const socialAPICall =
								this.fundraiserService.createSocialMedia(socialMediaPayload);

							if (
								this.videoPath != undefined &&
								this.videoPath.toString().length > 0
							) {
								const backgroundVideoAPICall =
									this.fundraiserService.addVideoBackground(
										backgroundVideoObject
									);
								return forkJoin([
									backgroundAPICall,
									backgroundVideoAPICall,
									socialAPICall,
								]);
							} else {
								return forkJoin([backgroundAPICall, socialAPICall]);
							}
						})
					)
					.subscribe((result: any) => {
						this.router.navigate([
							'fundraising/' +
								this.createFundraiserForm.get('custom_url')?.value,
						]);
					});
			}
		} else {
			this.isLoading = false;
			this.notificationService.openNotification(
				$localize`:@@connect_fundraiser_errorsInForm_notification:There are errors in your form. Kindly fill the form properly.`,
				'OK',
				'error'
			);
		}
	}
	receiveForm(form: any) {
		this.receivedForm = form;
	}
	receiveFormValidity(validity: boolean) {
		this.isFormValid = validity;
	}
	removeEmojis(text: string): string {
		// Replace consecutive spaces with a unique character
		let result = text.replace(/\s+/g, 'ANTRIKSHY');
		// Regular expression to match emojis and special characters
		const emojiAndSpecialCharsRegex =
			/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\p{S}\p{P}\p{Z}\p{C}]/gu;
		// Remove emojis and special characters
		result = result.replace(emojiAndSpecialCharsRegex, '');
		// Replace the unique character with a hyphen
		result = result.replace(/ANTRIKSHY/g, '-');
		result = result.replace(/-+/g, '-');
		return result;
	}
	onFocus() {
		this.isEditingSlug = true;
	}
	onBlur() {
		this.isEditingSlug = false;
	}
}
