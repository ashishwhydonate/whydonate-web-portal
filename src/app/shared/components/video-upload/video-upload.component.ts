import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

@Component({
	selector: 'app-video-upload',
	templateUrl: './video-upload.component.html',
	styleUrls: ['./video-upload.component.scss'],
})
/** *Video Upload Component */
export class VideoUploadComponent implements OnInit {
	videoUrl: string = '';
	videoId: string = '';
	thumbnail: string = '';

	constructor(private _sanitizer: DomSanitizer) {}

	ngOnInit(): void {}

	/** *Upload Video */
	updateVideoId() {
		if (this.videoUrl.includes('youtu')) {
			this.videoId = this.getYouTubeVideoId(this.videoUrl);

			this.thumbnail =
				'https://img.youtube.com/vi/' + this.videoId + '/mqdefault.jpg';
		} else if (this.videoUrl.includes('vimeo')) {
		}
	}
	/** *Get Video */
	getYouTubeVideoId(url: string) {
		var regExp =
			/^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|m\.youtube\.com\/|youtube\.com\/)?(?:ytscreeningroom\?vi?=|youtu\.be\/|vi?\/|user\/.+\/u\/\w{1,2}\/|embed\/|watch\?(?:.*\&)?vi?=|\&vi?=|\?(?:.*\&)?vi?=)([^#\&\?\n\/<>"']*)/i;
		var match = url.match(regExp);
		return match && match[1].length == 11 ? match[1] : '';
	}
}
