import { Component, Input, OnInit, SecurityContext } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
	selector: 'app-quill-view',
	templateUrl: './quill-view.component.html',
	styleUrls: ['./quill-view.component.scss'],
})
/** *Quill View Component*/
export class QuillViewComponent implements OnInit {
	@Input() quillContent: any | undefined;

	constructor(public sanitizer: DomSanitizer) {}

	ngOnInit(): void {}

	getContent(content: any) {
		let trustedContent = this.sanitizer.bypassSecurityTrustHtml(content);
		return trustedContent;
	}
}
