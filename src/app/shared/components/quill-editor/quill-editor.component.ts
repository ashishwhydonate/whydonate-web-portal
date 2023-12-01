import {
	Component,
	OnInit,
	Input,
	ViewChild,
	AfterViewInit,
	Output,
	EventEmitter,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import {
	UntypedFormBuilder,
	UntypedFormControl,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import {
	ContentChange,
	SelectionChange,
	QuillEditorComponent as OriginalQuillEditorComponent,
} from 'ngx-quill';
import { Quill, Delta } from 'quill';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export const QUILL_FORMATS = [
	'bold',
	'background',
	'color',
	'font',
	'code',
	'italic',
	'size',
	'strike',
	'script',
	'underline',
	'blockquote',
	'header',
	'indent',
	'list',
	'align',
	'direction',
	'code-block',
	'formula',
	// 'link','image','video' // THESE ARE DISABLED
];
@Component({
	selector: 'app-quill-editor',
	templateUrl: './quill-editor.component.html',
	styleUrls: ['./quill-editor.component.scss'],
})
/** *Quill Editor Component */
export class QuillEditorComponent implements OnInit, AfterViewInit, OnChanges {
	quillModuleConfig = {};
	quillFormats = {};
	quillForm: UntypedFormGroup;
	characterLength: number = 0;
	quillPlaceholder = $localize`:@@quill_editor_placeholder:insert text here...`;
	@Input() quillContent: any;
	@Input() readOnly: boolean = false;
	@Input() minLength: number = 0;
	@Input() maxLength: number = 15000;
	@Input() control: UntypedFormControl = new UntypedFormControl('');
	@Output() onContentChange: any = new EventEmitter<string>();
	// @Output() maxLengthBoolean: any = new EventEmitter<boolean>();
	@Output() allTextCheck: EventEmitter<boolean> = new EventEmitter<boolean>();

	@ViewChild('editor', {
		static: true,
	})
	editor!: OriginalQuillEditorComponent;

	constructor(_formBuilder: UntypedFormBuilder) {
		this.quillModuleConfig = {
			toolbar: [
				['bold', 'italic', 'underline', 'strike'], // toggled buttons
				['blockquote'],
				[{ header: 1 }, { header: 2 }], // custom button values
				[{ list: 'ordered' }, { list: 'bullet' }],
				[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
				[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
				[{ color: [] }, { background: [] }], // dropdown with defaults from theme
				[{ align: [] }],
				['clean'], // remove formatting button
				// ['link', 'image', 'video'], // link and image, video
			],
		};

		this.quillForm = _formBuilder.group({});
		this.quillContent = '';
		// this.quillForm = _formBuilder.group({
		// 	editorCtrl: [''],
		// });
	}
	ngOnChanges(changes: SimpleChanges): void {
		console.log('ngOnChanges', this.control);
		if (this.quillContent) {
			this.quillContent = this.quillContent?.trimStart();
			this.characterLength = this.quillContent?.length;
			if (this.quillForm) {
				this.quillForm.setControl(
					'editorCtrl',
					new UntypedFormControl(
						this.quillContent,
						Validators.compose([
							Validators.min(this.minLength),
							Validators.max(this.maxLength),
							Validators.pattern(/^(?:(?![0-9*#]).|[\p{Emoji}])*$/u),
						])
					)
				);
				this.subscribeToFormChanges();
				this.quillForm?.controls.editorCtrl.valueChanges
					.pipe(debounceTime(400), distinctUntilChanged())
					.subscribe((data) => {
						// tslint:disable-next-line:no-console
						this.onContentChange.emit(data);
					});
			}
		}
		this.control.valueChanges.subscribe((text) => {
			this.quillForm.get('editorCtrl')?.setValue(text, { emitEvent: false });
		});
	}

	ngOnInit(): void {
		//* INFO: this.editor of @ViewChild will be accessible here since static parameter is true
		// console.log(this.editor);
		try {
			//* INFO: Subscribe to onContentChanged() of @ViewChild -> #editor: OriginalQuillEditorComponent
			// this.editor.onContentChanged
			// 	.pipe(debounceTime(400), distinctUntilChanged())
			// 	.subscribe((data: ContentChange) => {
			// 		// tslint:disable-next-line:no-console
			// 		console.log('view child + directly subscription', data);
			// 		this.onContentChange.emit(data);
			// 	});
			if (this.quillContent) {
				this.quillForm.setControl(
					'editorCtrl',
					new UntypedFormControl(
						this.quillContent,
						Validators.compose([
							Validators.min(this.minLength),
							Validators.max(this.maxLength),
							Validators.pattern(/^(?:(?![0-9*#]).|[\p{Emoji}])*$/u),
						])
					)
				);
				this.subscribeToFormChanges();
				this.characterLength = this.quillContent?.length;
			} else {
				this.quillForm.setControl(
					'editorCtrl',
					new UntypedFormControl(
						'',
						Validators.compose([
							Validators.min(this.minLength),
							Validators.max(this.maxLength),
							Validators.pattern(/^(?:(?![0-9*#]).|[\p{Emoji}])*$/u),
						])
					)
				);
				this.subscribeToFormChanges();
			}
			// //* INFO: Reactive Form's valueChanges event
			// this.quillForm?.controls.editorCtrl.valueChanges
			// 	.pipe(debounceTime(400), distinctUntilChanged())
			// 	.subscribe((data) => {
			// 		// tslint:disable-next-line:no-console
			// 		console.log('native fromControl value changes with debounce', data);
			// 	});
		} catch (error) {
			// tslint:disable-next-line:no-console
			console.log(error);
		}
	}

	ngAfterViewInit(): void {
		// tslint:disable-next-line:no-console
		//* NOTE: when @ViewChild static parameter is set to false then ViewChild is set before AfterViewInit hook, so access it here.
		// console.log(this.editor);
	}

	created(event: Quill) {
		//* INFO: Reactive Form's valueChanges event
		this.quillForm?.controls.editorCtrl.valueChanges
			.pipe(debounceTime(400), distinctUntilChanged())
			.subscribe((data) => {
				// tslint:disable-next-line:no-console
				this.onContentChange.emit(data);
			});
		// tslint:disable-next-line:no-console
		// Programmatically disable quill editor
		// this.editor.setDisabledState(true);
	}

	logChange($event: ContentChange) {
		// tslint:disable-next-line:no-console
		// this.characterLength = $event.content.length();
		this.characterLength =
			$event.content?.length() === 0 ? 0 : $event.content.length() - 1;
		// //* This condition emits boolean value to Output() maxLengthBoolean which disables SAVE button if character length exceeds 15000
		// if(this.characterLength>this.maxLength){
		// 	this.maxLengthBoolean.emit(true);
		// } else {
		// 	this.maxLengthBoolean.emit(false);
		// }
	}

	logSelection($event: SelectionChange) {
		// tslint:disable-next-line:no-console
	}

	subscribeToFormChanges() {
		this.quillForm.statusChanges.subscribe((status: any) => {
			const isFormValid = status == 'VALID';
			// Emit true if the whole form group is valid, false otherwise
			this.allTextCheck.emit(isFormValid);
			//   console.log(isFormValid);
		});
	}
}