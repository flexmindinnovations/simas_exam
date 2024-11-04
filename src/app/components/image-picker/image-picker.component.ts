import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PrimeNGConfig } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'image-picker',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ButtonModule, BadgeModule, ProgressBarModule, ToastModule],
  templateUrl: './image-picker.component.html',
  styleUrl: './image-picker.component.scss'
})
export class ImagePickerComponent implements OnInit, OnChanges, OnDestroy {

  selectedImageFile: any;
  files: any[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  @Input() selectedImagePath: string = '';
  @Input({ required: true }) isEditMode: boolean = false;
  @Output() uploadFile: EventEmitter<any> = new EventEmitter();
  imageName: string = '';
  imageChange: boolean = false;
  constructor(
    private config: PrimeNGConfig,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedImagePath) {
      if (this.isEditMode && this.selectedImagePath) {
        this.imageName = this.selectedImagePath.substring(this.selectedImagePath.lastIndexOf('/') + 1);
        this.files.push(this.getSanitizedImage(this.selectedImagePath));
      }
    }
  }

  getSanitizedImage(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  handleChangeImage() {
    this.imageChange = true;
  }

  uploadEvent(callback: any) {
    this.uploadFile.emit({ files: this.files, event: 'uploadEvent' });
  }

  choose(event: any, callback: any) {
    callback();
  }

  onRemoveTemplatingFile(event: any, file: any, removeFileCallback: any, index: any) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear: any) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onTemplatedUpload() { }

  onSelectedFiles(event: FileSelectEvent) {
    this.files = event.currentFiles;
    this.files.forEach((file) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;
    this.uploadFile.emit({ files: this.files, event: 'onSelectedFiles' });
  }

  formatSize(bytes: any) {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes;
    if (bytes === 0 && sizes) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes && sizes[i]}`;
  }

  ngOnDestroy(): void {
    this.imageChange = false;
  }
}
