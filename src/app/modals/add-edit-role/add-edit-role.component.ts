import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role/role.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { of, debounceTime, forkJoin } from 'rxjs';
import { utils } from '../../utils';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-edit-role',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, CalendarModule, InputSwitchModule, CheckboxModule],
  templateUrl: './add-edit-role.component.html',
  styleUrl: './add-edit-role.component.scss',
  animations: [utils.heightIncrease]
})
export class AddEditRoleComponent implements OnInit, AfterViewInit {
  dialogData: any;
  formGroup!: FormGroup;

  permissionId: number = 0;
  roleId: number = 0;
  isEditMode: boolean = false;
  isSubmitActionLoading: boolean = false;
  roleExists: boolean = false;
  roleName: string = '';
  savedRoles: any[] = [];
  moduleList: any[] = [];
  constructor(
    private roleService: RoleService,
    private fb: FormBuilder,
    private cdref: ChangeDetectorRef,
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
  ) { }


  ngOnInit(): void {
    this.dialogData = this.config.data;
    this.isEditMode = this.dialogData?.isEditMode;
    this.savedRoles = this.dialogData?.savedRoles;
    this.initFormGroup();
    this.getMduleList();
  }

  ngAfterViewInit(): void {
    if (this.isEditMode) {
      const { roleName, roleId } = this.dialogData;
      this.roleId = roleId;
      this.roleName = roleName;
      this.formGroup.patchValue({ roleName });
    }
    this.cdref.detectChanges();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      status: [true, [Validators.required]],
      roleName: ['', [Validators.required]],
    })
  }

  getMduleList() {
    this.isSubmitActionLoading = true;
    this.roleService.getModuleList().subscribe({
      next: (response) => {
        if (response) {
          const moduleList = response.map((item: any) => {
            return {
              id: item?.moduleId,
              moduleTitle: utils.addSpaceBetweenWords(item?.moduleName),
              moduleName: item?.moduleName,
              enabled: false,
              actions: [
                { title: "Can Add", action: 'canAdd', id: this.getId(), enabled: false },
                { title: "Can Edit", action: 'canEdit', id: this.getId(), enabled: false },
                { title: "Can Delete", action: 'canDelete', id: this.getId(), enabled: false }
              ]
            }
          });
          this.moduleList = moduleList;
          if (this.isEditMode) {
            this.getPermissionList(this.roleId.toString());
          }
          this.isSubmitActionLoading = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitActionLoading = false;
        utils.setMessages(error.message, 'error');
      }
    })

  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleInputChange(event: any) {
    const value = event?.target?.value;
    if (value && !this.isEditMode) {
      of(value)
        .pipe(
          debounceTime(2000),
        ).subscribe((val: any) => {
          this.roleExists = this.isDuplicateRole(val);
          if (this.roleExists) {
            this.formGroup.get('roleName')?.setErrors({ 'duplicateRole': true });
          }
        })
    }
  }

  isDuplicateRole(roleName: string): boolean {
    this.roleName = roleName;
    return this.savedRoles.some((item: any) => item.roleName.toLowerCase() === roleName.toLowerCase());
  }

  getPermissionList(roleId: string) {
    this.isSubmitActionLoading = true;
    this.roleService.getRolePermissionsById(roleId).subscribe({
      next: (response) => {
        console.log('response: ', response);
        console.log('moduleList: ', this.moduleList);

        if (response?.length) {
          response.forEach((item: any) => {
            const itemIndex = this.moduleList.findIndex((row) => row.id === item?.moduleId);
            this.permissionId = item?.permissionId;
            if (itemIndex > -1) {
              this.moduleList[itemIndex] = {
                id: item?.moduleId,
                moduleTitle: utils.addSpaceBetweenWords(item?.moduleName),
                permissionId: item?.permissionId,
                moduleName: item?.moduleName,
                enabled: item?.canView,
                actions: [
                  { title: "Can Add", action: 'canAdd', id: this.getId(), enabled: item?.canAdd },
                  { title: "Can Edit", action: 'canEdit', id: this.getId(), enabled: item?.canEdit },
                  { title: "Can Delete", action: 'canDelete', id: this.getId(), enabled: item?.canDelete }
                ]
              }
            }
          })
          this.isSubmitActionLoading = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitActionLoading = false;
        utils.setMessages(error.message, 'error');
      }
    });
  }

  handleDialogCancel() {
    utils.isTableEditAction.set(false);
    utils.isAddActionLoading.set(false);
    this.dialogRef.close(false);
  }

  handleSubmitAction() {
    this.isSubmitActionLoading = true;
    this.formGroup.disable();
    const formVal = this.formGroup.getRawValue();
    const roleId = this.dialogData?.roleId;
    const payload: any = {
      roleId: this.isEditMode ? roleId : 0,
      roleName: formVal['roleName'],
      permissionList: this.setPermissionList(roleId)
    }
    let apiCall = this.roleService.saveRole(payload);
    if (this.isEditMode) apiCall = this.roleService.updateRole(payload);
    forkJoin({ apiCall }).subscribe({
      next: (response) => {
        const res: any = response?.apiCall;
        this.isSubmitActionLoading = false;
        utils.isAddActionLoading.set(false);
        utils.isTableEditAction.set(false);
        setTimeout(() => {
          this.dialogRef.close(res);
        })
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitActionLoading = false;
        utils.isAddActionLoading.set(false);
        utils.isTableEditAction.set(false);
        this.dialogRef.close(false);
      }
    });
  }

  setPermissionList(roleId: number) {
    const permissionList = this.moduleList.map((item: any) => {
      const canAdd = item.actions.filter((access: any) => access.action.replace(/\s/g, '').toLowerCase() === 'canadd')[0].enabled;
      const canEdit = item.actions.filter((access: any) => access.action.replace(/\s/g, '').toLowerCase() === 'canedit')[0].enabled;
      const canDelete = item.actions.filter((access: any) => access.action.replace(/\s/g, '').toLowerCase() === 'candelete')[0].enabled;
      return {
        permissionId: item.permissionId ? item.permissionId : 0,
        moduleId: item?.id,
        moduleName: item?.moduleName,
        roleId,
        canView: item.enabled,
        canAdd,
        canEdit,
        canDelete
      }
    })
    return permissionList;
  }

  handleParentStateChange(event: CheckboxChangeEvent, item: any) {
    item.enabled = event.checked;
    item.actions.forEach((action: any) => action.enabled = event.checked);
  }

  handleChildStateChange(event: CheckboxChangeEvent, item: any, parent: any) {
    event.originalEvent?.preventDefault();
    item.enabled = event.checked;
  }

  getId() {
    return new Date().getTime();
  }

}
