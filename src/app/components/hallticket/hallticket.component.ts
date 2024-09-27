import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import JSBarcode from 'jsbarcode';

@Component({
  selector: 'app-hallticket',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './hallticket.component.html',
  styleUrls: ['./hallticket.component.scss'],
})
export class HallticketComponent implements OnInit, AfterViewInit {
  @ViewChild('barcodeCanvas', { static: false }) barcodeCanvas!: ElementRef<HTMLCanvasElement>;
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
    setTimeout(() => {
      this.generateBarcode();
    }, 0); // Ensure view is fully initialized
  }


  constructor(
    private dialogRef: DynamicDialogRef,
  ) { }

  generateBarcode() {
    if (this.barcodeCanvas && this.barcodeCanvas.nativeElement) {
      const data = this.hallTicketData.hallTicketNumber; // Using hall ticket number for barcode
      JSBarcode(this.barcodeCanvas.nativeElement, data, {
        format: 'CODE128',
        width: 2,
        height: 30,
        displayValue: true,
        fontSize: 16,
        textAlign: 'center'
      });
    } else {
      console.error('Canvas element not found');
    }
  }

  download() {
    console.log('Hall Ticket Download');
    if (this.barcodeCanvas && this.barcodeCanvas.nativeElement) {
      const canvas = this.barcodeCanvas.nativeElement;
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'hallticket_barcode.png';
      link.click();
    }
  }

  print() {
    if (!this.barcodeCanvas || !this.barcodeCanvas.nativeElement) {
      console.error('Barcode canvas element is not available');
      return;
    }

    const barcodeCanvas: HTMLCanvasElement = this.barcodeCanvas.nativeElement;
    const barcodeDataURL = barcodeCanvas.toDataURL('image/png'); // Convert canvas to an image URL

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
            <style>
              @media print {
                html, body {
                  width: 100%;
                  height: 100%;
                  margin: 0;
                  padding: 0;
                  overflow: hidden;
                  font-family: Arial, sans-serif;
                }
                #printSection {
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  box-sizing: border-box;
                }
                .print-container {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  padding: 20px;
                }
                .print-container table {
                  width: 100% !important;
                  border-collapse: collapse;
                  margin: 20px 0;
                }
                .print-container th, .print-container td {
                  padding: 10px;
                  text-align: left;
                  border: 1px solid #d1d5db;
                }
                .print-container th {
                  background-color: #f4f4f4;
                  font-weight: bold;
                }
                .print-container .student-photo {
                  width: 128px !important;
                  height: 128px !important;
                  object-fit: cover;
                  border: 2px solid #d1d5db;
                  margin: 10px 0;
                }
                .print-container .barcode {
                  width: 128px !important;
                  object-fit: cover;
                  margin: 10px 0;
                }
                .header {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .footer {
                  text-align: center;
                  margin-top: 20px;
                  font-size: 0.9em;
                  color: #555;
                }
                p-button, button {
                  display: none !important;
                }
              }
            </style>
          </head>
          <body>
            <div id="printSection" class="print-container">
              <div class="header">
                <h3>Hall Ticket</h3>
              </div>
              <table>
                <tbody>
                  <tr class="flex items-center">
                    <td><img src="${this.hallTicketData.studentPhoto}" class="student-photo" alt="Student Photo"></td>
                    <td><img src="${barcodeDataURL}" class="barcode" alt="Barcode"></td>
                  </tr>
                  <tr>
                    <th>Hall Ticket Number</th>
                    <td>${this.hallTicketData.hallTicketNumber}</td>
                  </tr>
                  <tr>
                    <th>Center</th>
                    <td>${this.hallTicketData.center}</td>
                  </tr>
                  <tr>
                    <th>Group</th>
                    <td>${this.hallTicketData.group}</td>
                  </tr>
                  <tr>
                    <th>Level</th>
                    <td>${this.hallTicketData.level}</td>
                  </tr>
                  <tr>
                    <th>Instructor</th>
                    <td>${this.hallTicketData.instructorName}</td>
                  </tr>
                  <tr>
                    <th>Exam Center</th>
                    <td>${this.hallTicketData.examCenter}</td>
                  </tr>
                  <tr>
                    <th>Batch Date & Time</th>
                    <td>${this.hallTicketData.batchDate.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>Website</th>
                    <td>${this.hallTicketData.website}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>${this.hallTicketData.email}</td>
                  </tr>
                </tbody>
              </table>
              <div class="footer">
                <p>Thank you for your participation!</p>
              </div>
            </div>
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
