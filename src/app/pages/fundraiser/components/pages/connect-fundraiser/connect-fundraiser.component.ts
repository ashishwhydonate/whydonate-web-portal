/*This component comes into action after clicking Connect button on Fundraiser Page*/

import {
	Component,
	OnInit,
	ChangeDetectorRef,
	AfterContentChecked,
	Inject,
	PLATFORM_ID,
} from '@angular/core';
import {
	AbstractControl,
	AsyncValidatorFn,
	UntypedFormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
	ValidationErrors,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { FundraiserService } from '../../../services/fundraiser.service';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { MediaFiles } from '../../../models/mediaFiles';
import { DomSanitizer } from '@angular/platform-browser';
import { PreviewVideo } from '../../../models/previewVideo';
import { DashboardService } from 'src/app/pages/user/dashboard/services/dashboard.service';
import { Tools } from 'src/utilities/tools';

@Component({
	selector: 'app-connect-fundraiser',
	templateUrl: './connect-fundraiser.component.html',
	styleUrls: ['./connect-fundraiser.component.scss'],
})

/*
 * This component takes care of creating a new connected fundraiser-------------------------------------------------------------
 */
export class ConnectFundraiserComponent implements OnInit {
	/*
	 * Global Variables----------------------------------------------------------
	 */
	isLoading: boolean = false;
	slug: string = '';
	connectFundraiserForm!: UntypedFormGroup;
	parentFundraiser: any;
	imageFiles: File[] = new Array<File>();
	imgUrl: any[] = new Array<any>();
	isVideo: boolean = false;
	embedVideoUrl: any[] = new Array<any>();
	mediaFiles: MediaFiles[] = new Array<MediaFiles>();
	disableVideoSaveButton: boolean = true;
	profileResponse: any;
	minEndDate: Date = new Date();
	locale: any;
	currencyCode: string = '';
	currencySymbol: string = '';
	currencyConversionFactor: number = 1;
	maxTargetAmount: number = 99;
	isBrowser: boolean = false;
	/*
	 * Constructor Function------------------------------------------------------
	 * @param router
	 * @param notificationService
	 * @param fundraiserService
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
		public formBuilder: UntypedFormBuilder,
		public _dashboardService: DashboardService,
		public cdref: ChangeDetectorRef,
		@Inject(PLATFORM_ID) platformId: string
	) {
		this.isBrowser = isPlatformBrowser(PLATFORM_ID);
		/** *DEFINE FORM GROUP */
		this.connectFundraiserForm = new UntypedFormGroup({
			title: new UntypedFormControl('', [
				Validators.required,
				Validators.minLength(15),
				Validators.maxLength(70),
				Validators.pattern(
					'^[a-zA-Z0-9\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9 _.-]*$'
				),
			]),
			description: new UntypedFormControl('', [
				Validators.required,
				Validators.minLength(150),
				Validators.maxLength(15000),
			]),
			custom_url: new UntypedFormControl('', {
				validators: [
					Validators.required,
					Validators.minLength(1),
					Validators.maxLength(75),
					Validators.pattern('^[a-zA-Z0-9_/s-]*$'),
				],
				asyncValidators: [this.isSlugUnique()],
			}),
			target_amount: new UntypedFormControl('', [
				Validators.max(this.maxTargetAmount),
				Validators.pattern('^[0-9]+$'),
			]),
			end_date: new UntypedFormControl(),
			youtube_link: new UntypedFormControl('', []),
		});
	}

	/*
	 * Lifecycle Hooks~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	ngOnInit(): void {
		// Check Login status - if not login send to login screen
		this.accountService.getLoginInformation().subscribe((info) => {
			if (info == false) {
				this.router.navigate(['account/login']);
			}
		});
		this.locale = this.accountService.getLocaleId();
		if (this.accountService.checkHeaders()) {
			this._dashboardService.getProfile().subscribe((res: any) => {
				/** *Success */
				this.profileResponse = res.data;
				// console.log('the profile data', this.profileResponse.profile.id);
			});
		}

		/** *Extract Slug */
		this.slug = this.router.url.substring(21);

		/** *Get parent fundraiser */
		this.fundraiserService
			.getFundraiserBySlug(this.slug, this.locale)
			.subscribe((response: any) => {
				if (response['status'] == '404') {
					this.notificationService.openNotification(
						$localize`:@@connect_fundraiser_fundraiserNotFound_notification:Fundraiser Not found. Error: ` +
							response['error']['errors']['message'],
						'',
						'error'
					);
				} else {
					this.parentFundraiser = response['data']?.result;

					this.isLoading = true;
				}
				console.log('parent fundraiser data', this.parentFundraiser);
				this.currencyCode = this.parentFundraiser?.currency_code;
				this.currencySymbol = this.parentFundraiser?.currency_symbol;
				this.currencyConversionFactor =
					this.parentFundraiser?.custom_donation_configuration?.x_to_eur;
				this.maxTargetAmount = this.currencyConversionFactor * 999999;
				// Update the max value of form validators.
				const updatedValidators = [
					Validators.pattern('^[0-9]+$'),
					Validators.max(this.maxTargetAmount),
				];
				// Set the updated validators for the control.
				this.connectFundraiserForm.controls.target_amount.setValidators(
					updatedValidators
				);
			});
	}

	ngAfterContentChecked() {
		this.cdref.detectChanges();
	}

	/*
	 * SLUG FUNCTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */

	/*
	 * Function to replace space in slug with hyphen------------------------------
	 * @param slug
	 */
	setSlug(slug: string) {
		let newVal = slug.replace(/\s+/g, '-');
		this.connectFundraiserForm?.controls['custom_url'].setValue(
			newVal.toLowerCase()
		);
		this.connectFundraiserForm?.controls['custom_url'].markAsTouched();
	}

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
							console.log('RESULT', result);
							if (result['data']['slug_in_use']) {
								resolve({ custom_url: 'slugInUse' });
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
	 * Function to save connected Fundraiser-------------------------------------------------
	 */
	saveAndContinue() {
		this.connectFundraiserForm.markAllAsTouched();
		if (this.connectFundraiserForm.valid) {
			this.isLoading = false;

			/** *Check for unlimited */
			let unlimited: boolean = false;
			let amount_target: string =
				this.connectFundraiserForm.get('target_amount')?.value;
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
				this.connectFundraiserForm.get('end_date')?.value,
				'yyyy-MM-dd'
			);
			if (end_date == null || end_date == undefined) {
				end_date = '9999-12-31';
			}

			let location_local =
				this.parentFundraiser?.root_funraiser == undefined
					? this.parentFundraiser?.location?.location_name
					: this.parentFundraiser?.root_funraiser?.location?.location_name;

			/** *Create Object To Pass To API */
			let connectedFundraiser: Object;

			connectedFundraiser = {
				title: this.connectFundraiserForm.get('title')?.value,
				slug: this.connectFundraiserForm.get('custom_url')?.value,
				category_id: this.parentFundraiser?.category?.id,
				description: this.connectFundraiserForm.get('description')?.value,
				location_local: location_local,
				language_code: this.parentFundraiser?.language_code,
				unlimited: unlimited,
				appeal:
					'<p>' + this.connectFundraiserForm.get('description')?.value + '<p>',
				currency_code: this.currencyCode,
				end_date: end_date,
				show_donation_details: true,
				allow_child: true,
				tip_enabled: true,
				is_draft: true,
				created_on: environment.homeUrl,
				parent_id: this.parentFundraiser?.id,
				amount_target: amount_target,
			};

			if (this.accountService.checkHeaders()) {
				this.fundraiserService
					.createConnectedFundraiser(connectedFundraiser)
					.subscribe(
						(data: any) => {
							/** *UPLOAD IMAGES IF AVAILABLE */
							if (this.mediaFiles.length > 0) {
								let multimediaData = new FormData();
								this.mediaFiles.forEach((file, index) => {
									if (file.isImage == true) {
										multimediaData.append(
											'image' + index,
											this.base64toBlob(
												this.imgUrl[index],
												this.imageFiles[index].type
											)
										);
									}
									if (file.isVideo == true) {
										multimediaData.append(
											'video' + index,
											this.mediaFiles[index]['videoUrl']
										);
									}
								});

								multimediaData.append('slug', data['data']['slug']);
								multimediaData.append('text', 'appeal');

								this.fundraiserService
									.uploadAppealImageList(multimediaData)
									.subscribe(
										(data: any) => {
											this.notificationService.openNotification(
												$localize`:@@connect_fundraiser_fundraiserConnected_notification:Fundraiser connected successfully`,
												'close',
												'success'
											);
											this.isLoading = false;
											/** *Route to just created fundraiser */
											this.router.navigate([
												'/fundraising/' +
													this.connectFundraiserForm.get('custom_url')?.value,
											]);
										},
										(error) => {
											this.notificationService.openNotification(
												$localize`:@@connect_fundraiser_fundraiserConnectedNoImages_notification:Fundraiser connected succesfully but images are not uploaded.`,
												'close',
												'success'
											);
										}
									);
							}

							this.notificationService.openNotification(
								$localize`:@@connect_fundraiser_fundraiserConnected_notification:Fundraiser connected successfully`,
								'',
								'success'
							);

							//Zaraz
							if (this.isBrowser)
								(window as any)?.zaraz?.track('Connected_Created', {
									user_id: this.profileResponse?.profile?.user_id,
									fundraiser_id: data?.data?.id,
								});
							this.isLoading = false;
							/** *Route to just created fundraiser */
							this.router.navigate([
								'/fundraising/' +
									this.connectFundraiserForm.get('custom_url')?.value,
							]);
						},
						(error) => {
							this.notificationService.openNotification(
								$localize`:@@connect_fundraiser_errorsInForm_notification:There are errors in creating fundraiser.`,
								'close',
								'error'
							);
						}
					);
			}
		} else {
			this.notificationService.openNotification(
				$localize`:@@connect_fundraiser_errorsInForm_notification:There are errors in your form. Kindly fill the form properly.`,
				'close',
				'error'
			);
		}
	}

	/** *Get Base 64 Image */
	async getBase64ImageFromUrl(imageUrl: string) {
		var res = await fetch(imageUrl);
		var blob = await res.blob();

		return new Promise((resolve, reject) => {
			var reader = new FileReader();
			reader.addEventListener(
				'load',
				function () {
					resolve(reader.result);
				},
				false
			);

			reader.onerror = () => {
				return reject(this);
			};
			reader.readAsDataURL(blob);
		});
	}

	/*
	 * Image File Functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	onFileChange(event: any) {
		if (this.mediaFiles.length > 2) {
			this.notificationService.openNotification(
				$localize`:@@connect_fundraiser_addMoreThan3Files_notifications:You can not add more than 3 media files.`,
				'close',
				'error'
			);
		} else {
			let file = event.target.files[0];
			if (file) {
				if (file.size < 5242880) {
					if (
						file.type == 'image/jpg' ||
						file.type == 'image/jpeg' ||
						file.type == 'image/png' ||
						file.type == 'image/webp'
					) {
						this.imageFiles.push(file);
						this.previewUploadedImage(file);
					} else {
						this.notificationService.openNotification(
							$localize`:@@connect_fundraiser_formatFile_notification:One of your image file is not jpg or png. Please choose a different file.`,
							'OK',
							'error'
						);
					}
				} else {
					this.notificationService.openNotification(
						$localize`:@@connect_fundraiser_oneImageIsGreaterThan5mb_notification:One of your image file is greater than 5mb. Please choose a different file.`,
						'OK',
						'error'
					);
				}
			}
		}
	}

	/*
	 * Function to preview uploaded images-------------------------------------------------------
	 */
	previewUploadedImage(file: File) {
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (_event) => {
			this.imgUrl.push(reader.result);
			this.mediaFiles.push(new MediaFiles(true, false, reader.result, ''));
		};
	}

	/*
	 * Convert base 64 to blob--------------------------------------------------------
	 */

	base64toBlob(base64Data: any, contentType: any): string | Blob {
		try {
			const base64ImageContent = base64Data.replace(
				/^data:image\/(png|jpg|jpeg|webp);base64,/,
				''
			);
			contentType = contentType || '';
			const sliceSize = 1024;
			const byteCharacters = atob(base64ImageContent);
			const bytesLength = byteCharacters.length;
			const slicesCount = Math.ceil(bytesLength / sliceSize);
			const byteArrays = new Array(slicesCount);

			for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
				const begin = sliceIndex * sliceSize;
				const end = Math.min(begin + sliceSize, bytesLength);

				const bytes = new Array(end - begin);
				for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
					bytes[i] = byteCharacters[offset].charCodeAt(0);
				}
				byteArrays[sliceIndex] = new Uint8Array(bytes);
			}
			const imageBlob = new Blob(byteArrays, { type: contentType });
			return imageBlob;
		} catch (e) {
			return '';
		}
	}

	removeImage(imageUrl: any) {
		//Remove from media Files array
		let indexMediaFiles: number = -1;
		this.mediaFiles.forEach((item, indexLoop) => {
			if (item['imageUrl'] == imageUrl) {
				indexMediaFiles = indexLoop;
			}
		});
		if (indexMediaFiles > -1) {
			this.mediaFiles.splice(indexMediaFiles, 1);
		}

		//Remove form imgUrl array
		const index = this.imgUrl.indexOf(imageUrl, 0);
		if (index > -1) {
			this.imgUrl.splice(index, 1);
		}
	}

	/*
	 * Video Function~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */

	/*
	 * Function to switch boolean value of video to show video link input field----------------
	 */
	switchIsVideo() {
		this.isVideo = !this.isVideo;
		if (this.isVideo) {
			this.connectFundraiserForm.controls['youtube_link'].addAsyncValidators(
				this.isYouTubeUrl()
			);
		} else {
			this.connectFundraiserForm.controls['youtube_link'].removeAsyncValidators(
				this.isYouTubeUrl()
			);
		}
	}

	/*
	 * Function to check if given link is valid youtube url--------------------------------------
	 * @returns
	 */
	isYouTubeUrl(): AsyncValidatorFn {
		return (control: AbstractControl) => {
			const validationPromise: Promise<ValidationErrors | null> = new Promise(
				(resolve, reject) => {
					let url = control.value;
					var regExp = '^(https?://)?((www.)?youtube.com|youtu.be)/.+$';
					var match = url.match(regExp);
					if (match) {
						this.disableVideoSaveButton = false;
						resolve(null);
					} else {
						this.disableVideoSaveButton = true;
						resolve({ invalid: 'true' });
					}
				}
			);
			return validationPromise;
		};
	}

	/*
	 * Function to save video in media files array---------------------------------------
	 */
	saveVideo() {
		if (this.mediaFiles.length < 3) {
			if (this.connectFundraiserForm.get('youtube_link')?.valid) {
				/* Converting shorts to embed from youtube URL */
				console.log(
					'First Video Link',
					this.connectFundraiserForm.get('youtube_link')?.value
				);
				const re = /shorts/gi;
				var str = this.connectFundraiserForm.get('youtube_link')?.value;
				var newstr = str.replace(re, 'embed');
				console.log('Updated Video Link', newstr);
				// console.log('Updated Video Link',this.connectFundraiserForm.get('youtube_link')?.value);
				this.connectFundraiserForm.get('youtube_link')?.setValue(newstr);
				let videoUrl = this.connectFundraiserForm.get('youtube_link')?.value;
				/** *let videoUrl = 'https://www.youtube.com/watch?v=avAHsJgr4m0'; */
				let embedVideoUrl =
					'https://www.youtube.com/embed/' + this.getYouTubeEmbedUrl(videoUrl);
				let sanitizedUrl =
					this.sanitizer.bypassSecurityTrustResourceUrl(embedVideoUrl);
				this.embedVideoUrl.push(new PreviewVideo(sanitizedUrl, videoUrl));
				this.mediaFiles.push(new MediaFiles(false, true, '', videoUrl));
				this.connectFundraiserForm.controls[
					'youtube_link'
				].clearAsyncValidators();
				this.connectFundraiserForm.get('youtube_link')?.setValue('');

				this.isVideo = !this.isVideo;
			} else {
				this.notificationService.openNotification(
					$localize`:@@connect_fundraiser_youtubeUrl_notification:The youtube url you have entered is invalid`,
					'close',
					'error'
				);
			}
		} else {
			this.notificationService.openNotification(
				$localize`:@@connect_fundraiser_notAddMoreThan3Files_notification:You can not add more than 3 media files`,
				'Close',
				'error'
			);
		}
	}

	/*
	 * Function to get embed url of a youtube link--------------------------------------------
	 * @param url
	 * @returns
	 */
	getYouTubeEmbedUrl(url: string) {
		var regExp =
			/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
		var match = url.match(regExp);
		return match && match[1].length == 11 ? match[1] : '';
	}

	/**
	 * Function to remove video from arrays
	 * @param videoObject
	 */
	removeVideo(videoObject: any) {
		//Remove from media Files array
		let indexMediaFiles: number = -1;
		this.mediaFiles.forEach((item, indexLoop) => {
			if (item['videoUrl'] == videoObject['youtubeUrl']) {
				indexMediaFiles = indexLoop;
			}
		});
		if (indexMediaFiles > -1) {
			this.mediaFiles.splice(indexMediaFiles, 1);
		}
		//Remove from preview videos araay
		const index = this.embedVideoUrl.indexOf(videoObject, 0);
		if (index > -1) {
			this.embedVideoUrl.splice(index, 1);
		}
	}
}
