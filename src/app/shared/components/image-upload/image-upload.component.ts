import { Component, Input, OnInit } from '@angular/core';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
//** *Image Upload Component */
export class ImageUploadComponent implements OnInit {
  @Input() aspectRatio: number = 1 / 1;
  notificationService: NotificationService;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    notificatrionService: NotificationService
    ) {
    this.notificationService = notificatrionService;
  }
  
  ngOnInit(): void { }

  //** *File changed event */
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  /** *Cropped Image*/

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    /** *show cropper */
  }

  cropperReady() {
    /** *cropper ready */
  }

  /** *If Image is not load */
  loadImageFailed() {
    this.notificationService.openNotification(
      $localize`:@@image_upload_failed_notification:Image upload failed. Please retry.`,
      'Retry',
      'error'
    );
  }
}
