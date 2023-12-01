import { SafeResourceUrl } from '@angular/platform-browser';

export class PreviewVideo {
	sanitizedVideoUrl: SafeResourceUrl;
	youtubeUrl: string;

	constructor(sanitizedVideoUrl: SafeResourceUrl, youtubeUrl: string) {
		this.sanitizedVideoUrl = sanitizedVideoUrl;
		this.youtubeUrl = youtubeUrl;
	}
}
