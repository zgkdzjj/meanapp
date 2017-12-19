import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-add-brand-dialog',
  templateUrl: './add-brand-dialog.component.html',
  styleUrls: ['./add-brand-dialog.component.css']
})
export class AddBrandDialogComponent implements OnInit {
  bname: String;
  bstatus: String;
  status = [
    {value: true, viewValue: 'Available'},
    {value: false, viewValue: 'Unavailable'}
    ];


  constructor(public dialogRef: MatDialogRef<AddBrandDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }


  onCloseClick(): void {
    this.dialogRef.close();
  }

}
