import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-image-display',
	templateUrl: './image-display.component.html',
	styleUrls: ['./image-display.component.scss'],
})
/** *Image Display Component */
export class ImageDisplayComponent implements OnInit {
	cloudinaryBaseUrl: string = '';
	src: string = '';
	options: string = 'dpr_auto,f_auto,q_auto';
	errorImage: string = 'assets/img/404.png';

	@Input() imagePath: string | undefined;

	constructor() {}

	ngOnInit(): void {
		this.cloudinaryBaseUrl = environment.cloudinaryBaseUrl;
		this.src =
			this.cloudinaryBaseUrl + '/' + this.options + '/' + this.imagePath;
	}
	/** *Update Error for Image */
	updateErrorImage() {
		this.imagePath = this.errorImage;
	}
}
