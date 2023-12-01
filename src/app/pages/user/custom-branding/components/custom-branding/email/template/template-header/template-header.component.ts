import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-template-header',
	template: `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 100">
			<path fill="#d8d8d8" d="M14 0h95v32H14z" />
			<path fill="#d8d8d8" d="M229 43h42v42h-42z" paint-order="stroke" />
		</svg>
	`,
	styles: [],
})
/** *Template Header Component */
export class TemplateHeaderComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
