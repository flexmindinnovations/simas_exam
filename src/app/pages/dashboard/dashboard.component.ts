import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserTypeService } from '../../services/user-type.service';
import { HttpErrorResponse } from '@angular/common/http';
import { utils } from '../../utils';
import { StudentService } from '../../services/student/student.service';
import { FranchiseService } from '../../services/franchise/franchise.service';
import { InstructorService } from '../../services/instructor/instructor.service';
import { environment } from '../../../environments/environment.development';
import { ImagePickerComponent } from '../../components/image-picker/image-picker.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,ImagePickerComponent],
  providers: [StudentService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  userDetails: any[] = [];
  isSearchActionLoading: boolean = false;
  imagePath: string = 'https://placehold.co/600x400';
  userType: string = '';
  isEditMode: boolean = false;
  selectedImagePath: string = '';
  selectedFiles: File[] = [];


  constructor(
    private userTypeService: UserTypeService,
    private studentService: StudentService,
    private franchiseService: FranchiseService,
    private instructorService: InstructorService
  ) { }

  ngOnInit(): void {
    this.selectedImagePath='';
    this.userType = this.userTypeService.getUserType();
    if (this.userType === 'Student') {
      this.isSearchActionLoading = true;
      const userId = sessionStorage.getItem('userId');
      const studentId = Number(userId);
      const userDetails = utils.studentDetails();
      if (Object.keys(userDetails).length === 0) {
        this.studentService.getStudentById(studentId)
          .subscribe({
            next: (response) => {
              if (response) {
                this.setUserDetails(this.userType.toLowerCase(), response);
                this.isSearchActionLoading = false;
              }
            },
            error: (error: HttpErrorResponse) => {
              this.isSearchActionLoading = false;
              utils.setMessages(error.message, 'error');
            }
          });
      } else {
        this.setUserDetails(this.userType.toLowerCase(), userDetails);
      }
    } else if (this.userType === 'Instructor') {
      this.isSearchActionLoading = true;
      const userId = sessionStorage.getItem('instructorId');
      const instructorId = Number(userId);
      this.instructorService.getInstructorById(instructorId).subscribe({
        next: (response) => {
          if (response) {
            this.userDetails = [
              { label: 'Instructor Name', value: response?.instructorName },
              { label: 'Franchise Name', value: response?.franchiseName },
              { label: 'Address', value: response?.address1 },
              { label: 'Email Id', value: response?.emailId },
              { label: 'Contact', value: response?.mobileNo },
            ]
            if (response?.logoPath) {
              this.imagePath = `${environment.apiUrl?.replace('api', response?.logoPath)}`;
            }
            this.isSearchActionLoading = false;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isSearchActionLoading = false;
          utils.setMessages(error.message, 'error');
        }
      });
    } else {
      this.isSearchActionLoading = true;
      const franchiseId = sessionStorage.getItem('franchiseId');
      this.franchiseService.getFranchiseById(franchiseId).subscribe({
        next: (response) => {
          if (response) {
            this.userDetails = [
              { label: 'Owner Name', value: response?.ownerName },
              { label: 'Franchise Name', value: response?.franchiseName },
              { label: 'Address', value: `${response?.address1} ${response.stateName}` },
              { label: 'Email Id', value: response?.emailId },
              { label: 'Contact', value: response?.mobileNo },
            ]
            if (response?.logoPath) {
              this.imagePath = `${environment.apiUrl?.replace('api', response?.logoPath)}`;
            }
            this.isSearchActionLoading = false;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isSearchActionLoading = false;
          utils.setMessages(error.message, 'error');
        }
      });
    }
  }
  handleUploadFile(event: any) {
    const eventType = event?.event;
    this.selectedFiles = event?.files;
  }

  setUserDetails(role: string, response: any) {
    switch (role) {
      case 'student':
        this.userDetails = [
          { label: 'Student Name', value: `${response?.studentFirstName} ${response?.studentMiddleName} ${response?.studentLastName}` },
          { label: 'Instructor Name', value: response?.instructorName },
          { label: 'Address', value: response?.address1 },
          { label: 'Current Level', value: response?.levelName },
          { label: 'Contact', value: response?.mobileNo },
        ]
        if (response?.studentPhoto) {
          this.imagePath = `${environment.apiUrl?.replace('api', response?.studentPhoto)}`;
          console.log('this.imagePath: ', this.imagePath);

        }
        break;
    }
  }
}
