import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MyFundraisersRoutingModule } from './my-fundraisers-routing.module';
import { MyFundraisersComponent } from './components/my-fundraisers/my-fundraisers.component';
/** *My Fundraisers Component */
@NgModule({
	declarations: [MyFundraisersComponent],
	imports: [
		CommonModule,
		MyFundraisersRoutingModule,
		MaterialModule,
		SharedModule,
		FormsModule,
		ReactiveFormsModule,
	],
})
export class MyFundraisersModule {}
