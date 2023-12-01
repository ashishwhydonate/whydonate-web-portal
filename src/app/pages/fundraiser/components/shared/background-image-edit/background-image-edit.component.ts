import { Component, Inject, Input, OnInit } from '@angular/core';
import {
	MatDialog,
	MatDialogRef,
	MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FundraiserService } from '../../../services/fundraiser.service';
import { MediaService } from '../../../services/media.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import {
	DomSanitizer,
	SafeHtml,
	SafeResourceUrl,
} from '@angular/platform-browser';
import { BackgroundMediaComponent } from './dialog/background-media/background-media.component';
import { AccountService } from 'src/app/pages/account/services/account.service';

@Component({
	selector: 'app-background-image-edit',
	templateUrl: './background-image-edit.component.html',
})
/** *Background Image Edit Component*/
export class BackgroundImageEditComponent implements OnInit {
	@Input() imagePath!: string;
	@Input() videoPath!: string;
	@Input() backgroundImageId!: number;
	@Input() fundraiserId!: number;
	@Input() slug!: string;
	defaultBackgroundImage =
		'https://res.cloudinary.com/whydonate/image/upload/dpr_auto,f_auto,q_auto/whydonate-staging/platform/visuals/fundraiser_default_bg.jpg';
	youtubeIframe: SafeHtml | undefined;

	constructor(
		public _fundraiserService: FundraiserService,
		public dialog: MatDialog,
		public notificationService: NotificationService,
		public mediaService: MediaService,
		private sanitizer: DomSanitizer,
		public accountService: AccountService
	) {}

	/**Detault background image when no image is uploaded */
	ngOnInit(): void {
		this.youtubeIframe = this.checkVideoUrl(this.videoPath);
	}
	fallbackToDefaultImage() {
		this.imagePath = this.defaultBackgroundImage;
	}

	checkVideoUrl(url: string) {
		// Vimeo link pattern
		const vimeoPattern =
			/^(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)(\d+)(?:\S+)?$/;

		// YouTube link pattern
		const youtubePattern =
			/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=|v\/)|youtu\.be\/)([\w\-]+)(?:\S+)?$/;

		if (url.match(vimeoPattern)) {
			return this.generateVimeoIframe(url);
		} else if (url.match(youtubePattern)) {
			return this.generateYouTubeIframe(url);
		} else {
			return 'unknown';
		}
	}
	generateVimeoIframe(videoLink: string): SafeHtml {
		const vimeoVideoId = this.getVideoIdVimeo(videoLink);

		const angularTag = `
		<style>
		.embed-container {
			--video--width: 1920;
			--video--height: 1080;
		
			position: relative;
			padding-bottom: calc(var(--video--height) / var(--video--width) * 100%); /* 41.66666667% */
			overflow: hidden;
			max-width: 100%;
			max-height: 100%;
			background: black;
		}
		
		.embed-container iframe,
		.embed-container object,
		.embed-container embed {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		} 
		</style>
		<div class='embed-container'>
			<iframe
				width="560"
				height="315"
				id="fundraiser_page_iframe"
				src="https://player.vimeo.com/video/${vimeoVideoId}"
				
				srcdoc="<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://player.vimeo.com/video/${vimeoVideoId}?autoplay=1&muted=1><img src=https://vumbnail.com/${vimeoVideoId}.jpg><span>▶</span></a>"
				frameborder="0"
				allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			></iframe>
		</div>
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
			id="fundraiser_page_iframe"
			height="100%"
			src="https://www.youtube-nocookie.com/embed/${videoId}"
			frameborder="0"
			allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
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

	/**To open image cropping dialog */
	openImageCropperDialog() {
		this.dialog.open(BackgroundMediaComponent, {
			data: {
				imagePath: this.imagePath,
				backgroundImageId: this.backgroundImageId,
				fundraiserId: this.fundraiserId,
				slug: this.slug,
				videoPath: this.videoPath,
			},
			width: '500px',
		});
	}
}
