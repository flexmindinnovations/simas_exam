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
                  height: auto; /* Adjusted to prevent overflow */
                  margin: 0;
                  padding: 0;
                  font-family: 'Arial', sans-serif;
                  background-color: #f9f9f9;
                }
                #printSection {
                  width: 900px; /* Increased width for the overall section */
                  margin: 20px auto;
                  padding: 10px; /* Reduced padding */
                  background-color: #fff;
                  border: 2px solid #ddd;
                  border-radius: 8px;
                  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
                }
                .hall-ticket-header {
                  text-align: center;
                  margin-bottom: 10px; /* Reduced margin */
                }
                .hall-ticket-header h3 {
                  font-size: 1.8em; /* Reduced font size */
                  color: #333;
                  font-weight: bold;
                }
                .image-barcode-details {
                  display: flex;
                  align-items: flex-start;
                  margin-bottom: 0;
                  border: 1px solid #ddd; /* Border for image and barcode section */
                  padding: 10px;
                  border-radius: 4px;
                }
                .image-barcode {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  margin-right: 30px; /* Increased margin for spacing */
                  width: 200px; /* Increased width for the image and barcode section */
                }
                .image-barcode img.student-photo {
                  width: 140px; /* Increased width for the student photo */
                  height: 140px; /* Increased height for the student photo */
                  object-fit: cover;
                  border: 1px solid #ddd; /* Border for the student photo */
                  border-radius: 4px;
                  margin-bottom: 5px; /* Reduced margin */
                }
                .image-barcode img.barcode {
                  width: 200px; /* Increased width for barcode */
                  height: auto; /* Maintain aspect ratio */
                  object-fit: contain;
                  margin: 5px 0; /* Margin for spacing */
                }
                .student-details {
                  flex: 1;
                  margin-bottom: 0;
                }
                .student-details table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 0; /* Remove margin at the bottom */
                }
                .student-details th, .student-details td {
                  padding: 8px 10px; /* Adjusted padding */
                  border: 1px solid #ddd; /* Unified border for table cells */
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
            <div id="printSection">
              <div class="hall-ticket-header">
                <h3>Hall Ticket</h3>
              </div>
              <div class="image-barcode-details">
                <div class="image-barcode">
                  <img src="${this.hallTicketData.studentPhoto}" class="student-photo" alt="Student Photo">
                  <img src="${barcodeDataURL}" class="barcode" alt="Barcode">
                </div>
                <div class="student-details">
                  <table>
                    <tbody>
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
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="student-details">
                <table>
                  <tbody>
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
