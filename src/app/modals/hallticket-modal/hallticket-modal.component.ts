import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import JSBarcode from 'jsbarcode';
import { utils } from '../../utils';

@Component({
  selector: 'app-hallticket-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './hallticket-modal.component.html',
  styleUrl: './hallticket-modal.component.scss'
})
export class HallticketModalComponent implements OnInit, AfterViewInit {
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
    if (!this.barcodeCanvas || !this.barcodeCanvas.nativeElement) {
      console.error('Barcode canvas element is not available');
      return;
    }

    const barcodeCanvas: HTMLCanvasElement = this.barcodeCanvas.nativeElement;
    const barcodeDataURL = barcodeCanvas.toDataURL('image/png');

    // Create the content for the iframe
    const printContent = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        #printSection {
          width: 900px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #000;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        td, th {
          border: 1px solid #000;
          padding: 8px;
          vertical-align: middle;
          text-align: left;
        }
        .center {
          text-align: center;
        }
        .photo-cell {
          text-align: center;
          font-weight: bold;
        }
        .gray-header {
          background-color: #ccc;
          font-weight: bold;
        }
        .student-photo {
          width: 140px;
          height: 140px;
          object-fit: cover;
          border: 1px solid #000;
        }
      </style>
    </head>
    <body>
      <div id="printSection">
        <table>
          <tr>
            <td>Competition Name</td>
            <td colspan="3" class="center"><strong>SIMAS ACADEMY</strong></td>
          </tr>
          <tr>
            <td>Hall Ticket Number</td>
            <td>${this.hallTicketData.hallTicketNumber}</td>
            <td>Group</td>
            <td>${this.hallTicketData.group}</td>
          </tr>
          <tr>
            <td>Level</td>
            <td colspan="3">${this.hallTicketData.level}</td>
          </tr>
          <tr>
            <td class="photo-cell" rowspan="6">
              Student Photo<br/><br>
              <img src="${this.hallTicketData.studentPhoto}" class="student-photo" alt="Photo" />
            </td>
            <td class="gray-header">Student Name</td>
            <td class="gray-header" colspan="2">${this.hallTicketData.studentName}</td>
          </tr>
          <tr>
            <td>Center (franchise Name)</td>
            <td colspan="2">${this.hallTicketData.center}</td>
          </tr>
          <tr>
            <td>Instructor Name</td>
            <td colspan="2">${this.hallTicketData.instructorName}</td>
          </tr>
          <tr>
            <td>Exam Center</td>
            <td colspan="2">${this.hallTicketData.examCenter}</td>
          </tr>
          <tr>
            <td>Batch Date & Time</td>
            <td colspan="2">${this.hallTicketData.batchDate.toLocaleString()}</td>
          </tr>
          <tr>
            <td colspan="3" class="center"><strong>Website & Email</strong><br>${this.hallTicketData.website} | ${this.hallTicketData.email}</td>
          </tr>
        </table>
      </div>
    </body>
    </html>
    `;


    // Create a new iframe for download
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;

    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(printContent);
      iframeDoc.close();

      // Wait for the iframe content to be rendered
      setTimeout(() => {
        html2canvas(iframeDoc.getElementById('printSection')!).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          const imgWidth = pdf.internal.pageSize.getWidth();
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Add image to PDF
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          pdf.save('hall_ticket.pdf'); // Download the PDF

          // Clean up: remove the iframe
          document.body.removeChild(iframe);
        });
      }, 100); // Delay to ensure the content is fully rendered
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
                  height: auto;
                  margin: 0;
                  padding: 0;
                  font-family: 'Arial', sans-serif;
                  background-color: #f9f9f9;
                }
                #printSection {
                  width: 900px; /* Increased width for the overall section */
                  margin: 20px auto;
                  padding: 10px;
                  background-color: #fff;
                  border: 2px solid #ddd;
                  border-radius: 8px;
                  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
                }
                .hall-ticket-header {
                  text-align: center;
                  margin-bottom: 10px;
                }
                .hall-ticket-header h3 {
                  font-size: 1.8em;
                  color: #333;
                  font-weight: bold;
                }
                .image-barcode-details {
                  display: flex;
                  align-items: flex-start;
                  margin-bottom: 0;
                  border: 1px solid #ddd; /* Border for image and barcode section */
                  border-bottom: none;
                  padding: 10px;
                  // border-radius: 4px;
                }
                .image-barcode {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  margin-right: 30px;
                  width: 250px; /* Increased width for the image and barcode section */
                }
                .image-barcode img.student-photo {
                  width: 140px; /* Width for the student photo */
                  height: 140px; /* Height for the student photo */
                  object-fit: cover;
                  border: 1px solid #ddd; /* Border for the student photo */
                  // border-radius: 4px;
                  margin-bottom: 5px;
                }
                .image-barcode img.barcode {
                  width: 240px; /* Increased width for barcode */
                  height: 70px; /* Height for barcode */
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
                  padding: 8px 10px;
                  border: 1px solid #ddd; /* Unified border for table cells */ 
                  text-align: left;
                  width: 50%; /* Set equal width for columns */
                }
                .student-details th {
                  color: #0d0d0d; /* Darker font color for table header */
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
                <h3>Admit Card</h3>
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
                      <th>Student Name</th>
                      <td>${this.hallTicketData.studentName}</td>
                    </tr>
                     <tr>
                      <th>Competition Name</th>
                      <td>${this.hallTicketData.competitionName}</td>
                    </tr>
                      <tr>
                        <th>Center (Franchise Name)</th>
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
                        <th>Instructor Name</th>
                        <td>${this.hallTicketData.instructorName}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="student-details">
                <table>
                  <tbody>
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
