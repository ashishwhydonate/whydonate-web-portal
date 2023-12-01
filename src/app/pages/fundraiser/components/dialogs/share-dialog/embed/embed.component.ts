import {
	Component,
	ElementRef,
	Inject,
	Input,
	OnInit,
	Renderer2,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import { AccountService } from 'src/app/pages/account/services/account.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';

export type widgetType =
	| 'donation-widget'
	| 'show-with-image'
	| 'donation-form+image'
	| 'donation-form+widget';
/** *Script Plugin Data Service */
export interface ScriptPluginData {
	div_id: string;
	div_class: string;
	div_value: widgetType;
	data_slug: string;
	data_lang: string;
	data_success_url: string;
	data_fail_url: string;
	data_card: string;
}

@Component({
	selector: 'app-embed',
	templateUrl: './embed.component.html',
	styleUrls: ['./embed.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class EmbedComponent implements OnInit {
	@Input() slug!: string;
	@Input() selectedFundraiser!: any;
	@Input() currentFundraiserData: any = {};
	@Input() amountProgressData!: any;
	@ViewChild('embedView', { static: true }) embedView!: ElementRef;

	pluginData!: ScriptPluginData;
	pluginForm!: UntypedFormGroup;

	embedHTML: string = '';
	previewSwitchCase: string = 'donation-widget';
	sucessUrlPlaceholder = $localize`:@@embed_successUrl_placeholder:Success Url`;
	failUrlPlaceholder = $localize`:@@embed_failUrl_placeholder:Fail Url`;
	oneTimeLabel = $localize`:@@embed_oneTimeLabel:One Time`;
	monthlyLabel = $localize`:@@embed_monthlyLabel:Monthly`;
	yearlyLabel = $localize`:@@embed_yearlyLabel:Yearly`;
	currency_symbol: string = '';
	fundraiserBackgroundImage: string = '';
	fundraiserBackgroundVideo: string = '';
	video: string = '';
	youtubeThumbnail: any;
	videoPath!: any;
	onetime_first: string = '';
	onetime_second: string = '';
	onetime_third: string = '';
	onetime_forth: string = '';
	monthly_first: string = '';
	monthly_second: string = '';
	monthly_third: string = '';
	monthly_forth: string = '';
	yearly_first: string = '';
	yearly_second: string = '';
	yearly_third: string = '';
	yearly_forth: string = '';
	constructor(
		private _renderer: Renderer2,
		private _formBuilder: UntypedFormBuilder,
		public media: MediaObserver,
		public _accountService: AccountService,
		@Inject(MAT_DIALOG_DATA) public data: { fundraiser: any },
		public dialogRef: MatDialogRef<EmbedComponent>
	) {
		this.pluginForm = this._formBuilder.group({
			hideWidgetCard: [false],
			showImageCheckbox: [false, { disabled: false }],
			addFormCheckbox: [false, { disabled: false }],
			successRedirectURL: [
				'',
				Validators.pattern(
					'^((ht|f)tp(s?))://([0-9a-zA-Z-]+.)+[a-zA-Z]{2,6}(:[0-9]+)?(/S*)?$'
				),
			],
			failRedirectURL: [
				'',
				Validators.pattern(
					'^((ht|f)tp(s?))://([0-9a-zA-Z-]+.)+[a-zA-Z]{2,6}(:[0-9]+)?(/S*)?$'
				),
			],
		});
	}

	ngOnInit(): void {
		console.log('current main data in embed', this.data);
		this.currency_symbol = this.data?.fundraiser?.currency_symbol;
		this.onetime_first =
			this.data?.fundraiser?.custom_donation_configuration?.onetime_first;
		this.onetime_second =
			this.data?.fundraiser?.custom_donation_configuration?.onetime_second;
		this.onetime_third =
			this.data?.fundraiser?.custom_donation_configuration?.onetime_third;
		this.onetime_forth =
			this.data?.fundraiser?.custom_donation_configuration?.onetime_forth;
		this.monthly_first =
			this.data?.fundraiser?.custom_donation_configuration?.monthly_first;
		this.monthly_second =
			this.data?.fundraiser?.custom_donation_configuration?.monthly_second;
		this.monthly_third =
			this.data?.fundraiser?.custom_donation_configuration?.monthly_third;
		this.monthly_forth =
			this.data?.fundraiser?.custom_donation_configuration?.monthly_forth;
		this.yearly_first =
			this.data?.fundraiser?.custom_donation_configuration?.yearly_first;
		this.yearly_second =
			this.data?.fundraiser?.custom_donation_configuration?.yearly_second;
		this.yearly_third =
			this.data?.fundraiser?.custom_donation_configuration?.yearly_third;
		this.yearly_forth =
			this.data?.fundraiser?.custom_donation_configuration?.yearly_forth;
		if (
			(this.data?.fundraiser?.background?.image != '' &&
				this.data?.fundraiser?.background?.video != '') ||
			(this.data?.fundraiser?.background?.image == '' &&
				this.data?.fundraiser?.background?.video != '') ||
			(this.data?.fundraiser?.background?.image != '' &&
				this.data?.fundraiser?.background?.video == '')
		) {
			this.fundraiserBackgroundImage = this.data?.fundraiser?.background?.image;
			this.fundraiserBackgroundVideo = this.data?.fundraiser?.background?.video;
		} else {
			this.fundraiserBackgroundImage =
				this.data?.fundraiser?.parent?.background?.image;
			this.fundraiserBackgroundVideo =
				this.data?.fundraiser?.parent?.background?.video;
		}
		const url: any = this.fundraiserBackgroundVideo;
		this.youtubeThumbnail = this.checkVideoUrl(url);
		this.videoPath = url;
		let rawFormValue = this.pluginForm.getRawValue();
		let embedData = this.createEmbedData(rawFormValue);
		this.embedHTML = this.getEmbedHTML(embedData);
		/** *set embed Html in Textarea */
		this.embedView.nativeElement.innerText = this.embedHTML;
		this.previewSwitchCase = this.getPreviewCase();

		this.pluginForm.valueChanges.subscribe(() => {
			if (this.pluginForm.valid) {
				let rawFormValue = this.pluginForm.getRawValue();
				let embedData = this.createEmbedData(rawFormValue);
				this.embedHTML = this.getEmbedHTML(embedData);
				/** *set embed Html in Textarea */
				this.embedView.nativeElement.innerText = this.embedHTML;
				this.previewSwitchCase = this.getPreviewCase();
			}
		});
	}

	/** *Disable checkbox if hide card is true */
	setWidgetCheckbox(event: MatSlideToggleChange) {
		if (event.checked) {
			this.pluginForm
				.get('showImageCheckbox')
				?.disable({ onlySelf: true, emitEvent: false });
			this.pluginForm
				.get('addFormCheckbox')
				?.disable({ onlySelf: true, emitEvent: false });
		} else {
			this.pluginForm
				.get('showImageCheckbox')
				?.enable({ onlySelf: true, emitEvent: false });
			this.pluginForm
				.get('addFormCheckbox')
				?.enable({ onlySelf: true, emitEvent: false });
		}
	}

	/** *Create Embed Data */
	createEmbedData(formData: any): ScriptPluginData {
		return {
			div_id: this.slug,
			div_class: 'widget',
			div_value: this.getWidgetType(formData),
			data_slug: this.slug,
			data_lang: this._accountService.getLocaleId() || 'nl',
			data_success_url: formData.successRedirectURL,
			data_fail_url: formData.failRedirectURL,
			data_card: formData?.hideWidgetCard ? 'hide' : 'show',
		};
	}

	/** *Get Widget Type */
	getWidgetType(formData: any): widgetType {
		if (formData?.hideWidgetCard) return 'donation-widget';

		if (formData?.addFormCheckbox) {
			if (formData?.showImageCheckbox) return 'donation-form+image';
			else return 'donation-form+widget';
		}
		if (formData?.showImageCheckbox) return 'show-with-image';

		return 'donation-widget';
	}

	/** *Get Preview Case */
	getPreviewCase() {
		let rawFormValue = this.pluginForm.getRawValue();
		let widgetType = this.getWidgetType(rawFormValue);
		if (widgetType === 'donation-widget' && rawFormValue?.hideWidgetCard)
			return 'donation-button';

		return widgetType;
	}

	getEmbedHTML(data: ScriptPluginData): string {
		/** *static data */
		let script_url =
			'https://res.cloudinary.com/dxhaja5tz/raw/upload/script_main.js';

		let div = this._renderer.createElement('div');
		let wrapperDiv = this._renderer.createElement('div');
		this._renderer.setStyle(wrapperDiv, 'margin-top', '100px');

		let script = this._renderer.createElement('script');
		this._renderer.setProperty(script, 'src', script_url);
		this._renderer.setProperty(script, 'type', 'text/javascript');

		let dataDiv = this._renderer.createElement('div');
		/** *set fundraiser related attribubtes */
		this._renderer.setProperty(dataDiv, 'id', data.div_id);
		this._renderer.addClass(dataDiv, data.div_class);
		this._renderer.setAttribute(dataDiv, 'data-slug', data.data_slug);
		this._renderer.setAttribute(dataDiv, 'data-lang', data.data_lang);
		this._renderer.setAttribute(
			dataDiv,
			'data-success_url',
			data.data_success_url
		);
		this._renderer.setAttribute(dataDiv, 'data-fail_url', data.data_fail_url);
		this._renderer.setAttribute(dataDiv, 'data-card', data.data_card);
		this._renderer.setAttribute(dataDiv, 'value', data.div_value);

		this._renderer.appendChild(wrapperDiv, dataDiv);
		this._renderer.appendChild(wrapperDiv, script);
		this._renderer.appendChild(div, wrapperDiv);

		return div.innerHTML;
	}

	/** *Copy Embed HTML */
	copyEmbedHTML() {
		return this.embedHTML;
	}
	/* INFO: set Image Base URL */
	checkVideoUrl(url: any): SafeHtml {
		const vimeoId = this.getVideoIdFromLink(
			url,
			/^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/
		);
		const youtubeId = this.getVideoIdFromLink(
			url,
			/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=|v\/)|youtu\.be\/)([\w\-]+)/
		);

		if (vimeoId) {
			return `https://vumbnail.com/${vimeoId}.jpg`;
		} else if (youtubeId) {
			return `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`;
		} else {
			return 'unknown';
		}
	}

	getVideoIdFromLink(url: string, pattern: RegExp): string {
		const match = url?.match(pattern);
		return match && match[1] ? match[1] : '';
	}
}
