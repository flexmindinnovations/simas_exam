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
                  font-family: 'Arial', sans-serif;
                  background-color: #f9f9f9;
                }
                #printSection {
                  width: 100%;
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                .hall-ticket {
                  width: 800px;
                  margin: 20px auto;
                  padding: 20px;
                  background-color: #fff;
                  border: 2px solid #ddd;
                  border-radius: 8px;
                  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
                }
                .hall-ticket-header {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .hall-ticket-header h3 {
                  font-size: 2em;
                  color: #333;
                  font-weight: bold;
                }
                .image-barcode-details {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  padding: 20px;
                  background-color: #f4f4f4;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  margin-bottom: 20px;
                }
                .image-barcode {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                }
                .image-barcode img.student-photo {
                  width: 128px;
                  height: 128px;
                  object-fit: cover;
                  border: 2px solid #ddd;
                  border-radius: 4px;
                  margin-bottom: 10px;
                }
                .image-barcode img.barcode {
                  width: 100%;
                  height: auto;
                  object-fit: contain;
                  margin-top: 10px;
                }
                .student-basic-info {
                  flex: 1;
                  margin-left: 20px;
                }
                .student-basic-info p {
                  margin: 5px 0;
                  font-size: 1em;
                  color: #333;
                }
                .student-details table {
                  width: 100%;
                  border-collapse: collapse;
                }
                .student-details th, .student-details td {
                  padding: 8px 12px;
                  border: 1px solid #ddd;
                  text-align: left;
                }
                .student-details th {
                  background-color: #1a73e8;
                  color: white;
                  font-weight: bold;
                }
                .footer {
                  text-align: center;
                  margin-top: 20px;
                  font-size: 0.9em;
                  color: #555;
                }
                p-button, button {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div id="printSection" class="hall-ticket">
              <div class="hall-ticket-header">
                <h3>Hall Ticket</h3>
              </div>
              <div class="image-barcode-details">
                <div class="image-barcode">
                  <img src="${this.hallTicketData.studentPhoto}" class="student-photo" alt="Student Photo">
                  <img src="${barcodeDataURL}" class="barcode" alt="Barcode">
                </div>
                <div class="student-basic-info">
                  <p><strong>Hall Ticket Number:</strong> ${this.hallTicketData.hallTicketNumber}</p>
                  <p><strong>Center:</strong> ${this.hallTicketData.center}</p>
                  <p><strong>Group:</strong> ${this.hallTicketData.group}</p>
                  <p><strong>Level:</strong> ${this.hallTicketData.level}</p>
                </div>
              </div>
              <div class="student-details">
                <table>
                  <tbody>
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
              </div>
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
