/**
 *Media Files
 *attributes : (iisImage,isVideo,imageUrl,videoUrl)
 */
export class MediaFiles {
	isImage: boolean;
	isVideo: boolean;
	imageUrl: string | ArrayBuffer | null;
	videoUrl: string;

	constructor(
		isImage: boolean,
		isVideo: boolean,
		imageUrl: string | ArrayBuffer | null,
		videoUrl: string
	) {
		this.isImage = isImage;
		this.isVideo = isVideo;
		this.imageUrl = imageUrl;
		this.videoUrl = videoUrl;
	}
}
