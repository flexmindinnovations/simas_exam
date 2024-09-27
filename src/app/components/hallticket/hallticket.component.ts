import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import QRCode from 'qrcode';

@Component({
  selector: 'app-hallticket',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './hallticket.component.html',
  styleUrls: ['./hallticket.component.scss'],
})
export class HallticketComponent implements OnInit, AfterViewInit {
  @ViewChild('qrCanvas', { static: false }) qrCanvas!: ElementRef<HTMLCanvasElement>;
  // @ViewChild('qrCanvas') qrCanvas: ElementRef<HTMLCanvasElement> | undefined;
  @ViewChild('printSection', { static: false }) printSection!: ElementRef<HTMLDivElement>;
  hallTicketData = {
    competitionName: 'SIMAS ACADEMY',
    hallTicketNumber: 'HT123456',
    group: 'A1',
    level: 'Intermediate',
    studentPhoto: '/images/logo1.png',
    studentName: 'John Doe',
    center: 'Main Center',
    instructorName: 'Jane Smith',
    examCenter: 'Exam Hall 1',
    batchDate: new Date(),
    website: 'www.simasacademy.com',
    email: 'info@simasacademy.com'
  };

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    setTimeout(() => this.generateQRCode(), 0); // Ensure view is fully initialized
  }

  constructor(
    private dialogRef: DynamicDialogRef,
  ) { }

  generateQRCode() {
    if (this.qrCanvas && this.qrCanvas.nativeElement) {
      const data = JSON.stringify(this.hallTicketData);
      QRCode.toCanvas(this.qrCanvas.nativeElement, data, { width: 128 }, (error: any) => {
        if (error) {
          console.error('QR Code Generation Error:', error);
        } else {
          console.log('QR code generated successfully!');
        }
      });
    } else {
      console.error('Canvas element not found');
    }
  }

  download() {
    console.log('Hall Ticket Download');
    if (this.qrCanvas && this.qrCanvas.nativeElement) {
      const canvas = this.qrCanvas.nativeElement;
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'hallticket_qrcode.png';
      link.click();
    }
  }

  print() {
    const qrCanvas: HTMLCanvasElement = this.qrCanvas.nativeElement;
    const qrDataURL = qrCanvas.toDataURL('image/png'); // Convert canvas to an image URL

    // Create a new iframe for print preview
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';

    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;

    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(`
          <html>
            <head>
              <title>Print Preview</title>
              <style>
                @media print {
                  html, body {
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                  }
                  #printSection {
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    box-sizing: border-box;
                  }
                  .print-flex-row {
                    display: flex !important;
                    flex-direction: row !important;
                    justify-content: space-between !important;
                  }
                  .student-photo {
                    width: 128px !important;
                    height: 128px !important;
                    object-fit: cover;
                    border: 2px solid #d1d5db;
                    margin: 0 !important;
                    box-shadow: none !important;
                  }
                  .qr-code {
                    width: 128px !important;
                    height: 128px !important;
                    object-fit: cover;
                    border: none !important;
                    margin: 0 !important;
                    box-shadow: none !important;
                  }
                  table {
                    width: 100% !important;
                    border-collapse: collapse;
                  }
                  p-button, button {
                    display: none !important;
                  }
                }
              </style>
            </head>
            <body>
              ${this.printSection.nativeElement.innerHTML.replace(
        /<canvas[\s\S]*?<\/canvas>/,
        `<img src="${qrDataURL}" class="qr-code" alt="QR Code">`
      )}
            </body>
          </html>
        `);
      iframeDoc.close();

      // Trigger print dialog
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      // Remove iframe after printing
      iframe.addEventListener('afterprint', () => {
        document.body.removeChild(iframe);
      });
    }
  }

  handleDialogCancel() {
    this.dialogRef.close(false);
  }
}
