import { Component, OnInit } from '@angular/core';
import {
	MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-verified-popup',
  templateUrl: './verified-popup.component.html',
  styleUrls: ['./verified-popup.component.scss']
})
export class VerifiedPopupComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<VerifiedPopupComponent>,
  ) { }

  ngOnInit(): void {
  }
	onCloseClick(){
		this.dialogRef.close();
	}

}
