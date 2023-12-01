import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AccountService } from '../../account/services/account.service';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
/** *Media Service */
export class MediaService {
	API_URL: string = environment.apiUrl;
	API_URL_V2: string = this.API_URL.replace('/v1', '/v2');
	constructor(
		public accountService: AccountService,
		private sanitizer: DomSanitizer,
		private http: HttpClient
	) {}

	/** APIs to save media for different components */
	/** *Save Appeal Media */
	saveAppealMedia(mediaBody: FormData) {
		let API_URL = environment.fundraiser_url;
		let url = 'fundraiser/image/list';

		let headers = this.accountService.getHeaders();
		let jwt = headers?.get('Authorization') || '';

		/**
		 * NOTE: Sending blob with formData also requires to set "boundary" on content-type,
		 * so that backend can read the payload properly. Since boundary value is dynamic,
		 * avoid setting content-type for this and browser will automatically set it for you.
		 * EXAMPLE: 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryPM0yMOPJKezkwGhC'
		 **/
		let options = {
			headers: new HttpHeaders().set('Authorization', jwt),
		};
		return this.http.post(API_URL + url, mediaBody, options);
	}
	/** Save About Content Media */
	saveAboutMedia(mediaBody: FormData) {
		let API_URL = environment.fundraiser_url;
		let url = 'fundraiser/image/list';
		// let url = 'content/informationlist/';

		let headers = this.accountService.getHeaders();
		let jwt = headers?.get('Authorization') || '';

		/**
		 * NOTE: Sending blob with formData also requires to set "boundary" on content-type,
		 * so that backend can read the payload properly. Since boundary value is dynamic,
		 * avoid setting content-type for this and browser will automatically set it for you.
		 * EXAMPLE: 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryPM0yMOPJKezkwGhC'
		 **/
		let options = {
			headers: new HttpHeaders().set('Authorization', jwt),
		};
		return this.http.post(API_URL + url, mediaBody, options);
	}
	/** *Save Update Media */
	saveUpdateMedia(mediaBody: FormData) {
		let API_URL = environment.fundraiser_url;
		// let url = 'content/updateImageList/';
		let url = 'fundraiser/image/list';

		let headers = this.accountService.getHeaders();
		let jwt = headers?.get('Authorization') || '';

		/**
		 * NOTE: Sending blob with formData also requires to set "boundary" on content-type,
		 * so that backend can read the payload properly. Since boundary value is dynamic,
		 * avoid setting content-type for this and browser will automatically set it for you.
		 * EXAMPLE: 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryPM0yMOPJKezkwGhC'
		 **/
		let options = {
			headers: new HttpHeaders().set('Authorization', jwt),
		};
		return this.http.post(API_URL + url, mediaBody, options);
	}

	/** Functions to get different object for Image media */
	/** * Function to create a view object for media */
	getViewMediaList(mediaList: any) {
		if (mediaList) {
			/** *if video exists then create embeddedHtml and replace it with url */
			mediaList.map((result: any) => {
				if (result?.video_url) {
					result.video_embed = this.createVideoEmbeddedHTML(result?.video_url);
					return result;
				}
				return result;
			});
			/** *console.log(mediaList); */
			return mediaList;
		} else {
			return [];
		}
	}

	/** *Function to get a patched object for media, contains extra data which is to be used be edit logic */
	getMediaList(mediaList: any) {
		if (mediaList) {
			mediaList.map((result: any) => {
				/** *if video exist then create embeddedHtml and add it to video */
				if (result.video_url) {
					result['video'] = result.video_url;
					result['video_embed'] = this.createVideoEmbeddedHTML(
						result.video_url
					);
					return result;
				}
				/** *if image exist then added to image_url and create base64 and replace it to image */
				if (result.image) {
					// result['image_url'] = result.image;
					this.imageUrlToBase64Async(result?.image).then((res) => {
						result['image_base64'] = res;
					});
					return result;
				}
				return result;
			});
			/** *console.log(mediaList); */
			return mediaList;
		} else {
			return [];
		}
	}

	/** * Function to create an object for media slider */
	getSliderMediaList(mediaList: any) {
		if (mediaList) {
			return mediaList?.map((obj: any) => {
				if (obj?.image) {
					return {
						image: obj?.image,
						thumbImage: obj?.image,
					};
				}
				if (obj?.video_url || obj?.video) {
					return {
						video: obj?.video_url || obj?.video,
					};
				}
				return;
			});
		} else {
			return [];
		}
	}

	/** Below Helper function are used for converting Image media */
	/* * Convert Base64 to File */
	base64toFile(dataURI: any) {
		var byteString = atob(dataURI.toString().split(',')[1]);
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		var blob = new Blob([ia], { type: 'image/jpeg' });
		return new File([blob], 'blob', { type: 'image/jpeg;charset=utf-8' });
	}
	/* * Convert Base64 to blob */
	base64toBlob(base64Data: any) {
		let byteString = atob(base64Data.toString().split(',')[1]);
		let ab = new ArrayBuffer(byteString.length);
		let ia = new Uint8Array(ab);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		let imageBlob = new Blob([ia], { type: 'image/png' });
		return imageBlob;
	}
	/* * Promise to Convert Image Url to Base64 asynchronously */
	async imageUrlToBase64Async(imageUrl: string): Promise<string> {
		var res = await fetch(imageUrl);
		var blob = await res.blob();

		return new Promise((resolve, reject) => {
			try {
				var reader = new FileReader();
				reader.onload = (event: any) => {
					resolve(event?.target?.result);
				};
				reader.onerror = () => {
					reject(this);
				};
				reader.readAsDataURL(blob);
			} catch (error) {
				reject(error);
			}
		});
	}
	/* * Promise to Convert Image Url to File asynchronously */
	async imageUrlToFileAsync(
		imageUrl: string,
		name: string,
		type = 'image/png'
	): Promise<File> {
		const response = await fetch(imageUrl);
		const data = await response.blob();
		return new Promise((resolve, reject) => {
			try {
				let newFile = new File([data], name, {
					type: data.type || type,
				});
				resolve(newFile);
			} catch (error) {
				reject(error);
			}
		});
	}
	/* * Promise to Convert File to Base64 asynchronously */
	fileToBase64Async(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				var reader = new FileReader();
				reader.onload = (event: any) => {
					resolve(event?.target?.result);
				};

				reader.onerror = () => {
					reject(this);
				};
				reader.readAsDataURL(file);
			} catch (error) {
				reject(error);
			}
		});
	}

	/** Video related functions */
	/** Function to create embed html string out of video url */
	createVideoEmbeddedHTML(_url: string, options?: any) {
		let id;
		if (_url) {
			let url = new URL(_url);
			/** *detect video */
			id = this.detectYoutube(url);
			if (id) return this.embed_youtube(id, options);
			id = this.detectVimeo(url);
			if (id) return this.embed_vimeo(id, options);
			id = this.detectDailymotion(url);
			if (id) return this.embed_dailymotion(id, options);
		} else return null;
	}
	/** detect and embed functions related to video */
	private detectYoutube(url: any): string {
		if (url.hostname.indexOf('youtube.com') > -1) return this.getYoutubeId(url);
		if (url.hostname === 'youtu.be') return url.pathname.split('/')[1];
		return '';
	}
	private getYoutubeId(url: URL): string {
		let id = url.pathname?.includes('shorts')
			? url?.pathname?.split('shorts/')[1]
			: url?.search?.split('=')[1];
		return id;
	}
	private embed_youtube(id: string, options?: any): any {
		options = this.parseOptions(options);
		let queryString;

		if (options && options.hasOwnProperty('query')) {
			queryString = '?' + this.serializeQuery(options.query);
		}

		return this.sanitize_iframe(
			'<iframe style="width: inherit;height: inherit;" src="//www.youtube.com/embed/' +
				id +
				options.query +
				'"' +
				options.attr +
				' frameborder="0" allowfullscreen></iframe>'
		);
	}

	private detectVimeo(url: any): string {
		return url.hostname === 'vimeo.com' ? url.pathname.split('/')[1] : null;
	}
	private embed_vimeo(id: string, options?: any): any {
		options = this.parseOptions(options);
		let queryString;

		if (options && options?.hasOwnProperty('query')) {
			queryString = '?' + this.serializeQuery(options.query);
		}

		return this.sanitize_iframe(
			'<iframe style="width: inherit;height: inherit;" src="//player.vimeo.com/video/' +
				id +
				options.query +
				'"' +
				options.attr +
				' frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
		);
	}

	private detectDailymotion(url: any): string {
		if (url.hostname.indexOf('dailymotion.com') > -1)
			return url.pathname.split('/')[2].split('_')[0];
		if (url.hostname === 'dai.ly') return url.pathname.split('/')[1];
		return '';
	}
	private embed_dailymotion(id: string, options?: any): any {
		options = this.parseOptions(options);
		let queryString;

		if (options && options?.hasOwnProperty('query')) {
			queryString = '?' + this.serializeQuery(options.query);
		}

		return this.sanitize_iframe(
			'<iframe style="width: inherit;height: inherit;" src="//www.dailymotion.com/embed/video/' +
				id +
				options.query +
				'"' +
				options.attr +
				' frameborder="0" allowfullscreen></iframe>'
		);
	}

	/** *helpers for embed function related to video */
	private sanitize_iframe(iframe: string): any {
		return this.sanitizer.bypassSecurityTrustHtml(iframe);
	}
	private parseOptions(options: any): any {
		let queryString = '',
			attributes = '';

		if (options && options?.hasOwnProperty('query')) {
			queryString = '?' + this.serializeQuery(options.query);
		}

		if (options && options?.hasOwnProperty('attr')) {
			const temp = <any>[];

			Object.keys(options.attr).forEach(function (key) {
				temp.push(key + '="' + options.attr[key] + '"');
			});

			attributes = ' ' + temp.join(' ');
		}
		return {
			query: queryString,
			attr: attributes,
		};
	}
	private serializeQuery(query: any): any {
		const queryString: any = [];

		for (const p in query) {
			if (query?.hasOwnProperty(p)) {
				queryString.push(
					encodeURIComponent(p) + '=' + encodeURIComponent(query[p])
				);
			}
		}

		return queryString.join('&');
	}
}
