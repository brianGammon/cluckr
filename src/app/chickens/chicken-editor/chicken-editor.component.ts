import { Component, OnInit, ViewChildren, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService, ChickenService, ImageService, UploadService } from '../../shared/services';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, Chicken, ImageProcessingResult, UploadResult } from '../../shared/models';
import { forOwn } from 'lodash';

@Component({
  templateUrl: './chicken-editor.component.html',
  styleUrls: ['./chicken-editor.component.scss']
})
export class ChickenEditorComponent implements OnInit, AfterViewInit {
  chickenForm: FormGroup;
  location: Location;
  imageData: ImageProcessingResult;
  loadingMessage: string = null;
  errorMessage: string = null;
  chicken: Chicken;

  formErrors = {
    'name': ''
  };

  validationMessages = {
    'name': {
      'required': 'Chicken name is required.'
    }
  };

  @ViewChildren('setFocus') vc;

  private imagesToDelete: Array<string> = [];

  constructor(
    private route: ActivatedRoute,
    private locationService: Location,
    private fb: FormBuilder,
    private userService: UserService,
    private chickenService: ChickenService,
    private imageService: ImageService,
    private uploadService: UploadService
  ) {
    this.location = locationService;
  }

  ngOnInit() {
    this.chickenForm = this.fb.group({
      'name': ['', [Validators.required]],
      'breed': [''],
      'hatched': ['']
    });
    this.chickenForm.valueChanges.subscribe(() => this.onValueChanged());

    const chickenId = this.route.snapshot.paramMap.get('chickenId');
    if (chickenId) {
      this.loadingMessage = 'Loading chicken...';
      this.userService.currentUser.take(1).subscribe(user => {
        if (user) {
          this.chickenService.getChicken(user.currentFlockId, chickenId).take(1).subscribe(chicken => {
            this.loadingMessage = null;
            this.chicken = chicken;
            this.chickenForm.reset({
              name: chicken.name,
              breed: chicken.breed,
              hatched: chicken.hatched
            });
          });
        }
      });
    }
  }

  ngAfterViewInit() {
    this.vc.first.nativeElement.focus();
  }

  saveForm() {
    this.errorMessage = null;
    this.userService.currentUser.take(1).subscribe(user => {
      if (user && this.chickenForm.valid) {
        if (this.imageData && this.imageData.result === 'success') {
          // New profile image selected
          let uploadResult: UploadResult;
          this.loadingMessage = 'Uploading image...';
          this.uploadService.pushUpload(this.imageData.imageSet, user['$key'], user.currentFlockId)
            .then(result => {
              uploadResult = result;
              if (this.chicken && this.chicken.photoPath) {
                return this.uploadService.deleteFromPath(this.chicken.photoPath);
              }
              return new Promise(resolve => resolve());
            })
            .then(() => {
              if (this.chicken && this.chicken.thumbnailPath) {
                return this.uploadService.deleteFromPath(this.chicken.thumbnailPath);
              }
              return new Promise(resolve => resolve());
            })
            .then(() => this.saveChicken(user, uploadResult))
            .catch(err => {
              this.errorMessage = 'Oops, something went wrong 😩';
              this.loadingMessage = null;
              this.imageData = null;
              console.log(err);
            });
        } else if (this.imagesToDelete.length > 0) {
          // User removed existing profile image
          const promises: Array<any> = [];
          this.imagesToDelete.forEach(imagePath => promises.push(this.uploadService.deleteFromPath(imagePath)));
          Promise.all(promises)
            .then(() => this.saveChicken(user))
            .catch(err => {
              this.errorMessage = 'Oops, something went wrong 😩';
              this.loadingMessage = null;
              this.imageData = null;
              console.log(err);
            });
        } else {
          // No photo added or removed
          this.saveChicken(user);
        }
      }
    });
  }

  resetPreview() {
    this.imageData = null;
  }

  removeProfileImage() {
    this.imagesToDelete.push(this.chicken.photoPath);
    this.imagesToDelete.push(this.chicken.thumbnailPath);
    this.chicken.photoPath = '';
    this.chicken.photoUrl = '';
    this.chicken.thumbnailPath = '';
    this.chicken.thumbnailUrl = '';
  }

  onImageSelected(event) {
    this.errorMessage = null;
    this.imageData = null;
    this.loadingMessage = 'Resizing your image...';
    if (event.target.files[0]) {
      this.imageService.processImage(event.target.files[0]).then(data => {
        this.imageData = data;
        this.loadingMessage = null;
      }).catch(err => {
        console.log(err);
        this.errorMessage = 'Oops, something went wrong 😩';
        this.loadingMessage = null;
      });
    }
  }

  // Updates validation state on form changes.
  private onValueChanged() {
    // Loop over the pre-defined form error fields
    forOwn(this.formErrors, (fieldValue, fieldKey) => {
      // clear previous error message (if any)
      this.formErrors[fieldKey] = '';
      // if the control that matches that field name is dirty and invalid...
      const control = this.chickenForm.get(fieldKey);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[fieldKey];
        // for each error in the control, display the matching error message
        forOwn(control.errors, (msgValue, msgKey) => {
          this.formErrors[fieldKey] += messages[msgKey] + ' ';
        });
      }
    });
  }

  private saveChicken(user: User, uploadResult?: UploadResult) {
    if (!this.chicken) {
      this.chicken = new Chicken();
    }
    this.chicken.name = this.chickenForm.get('name').value;
    this.chicken.breed = this.chickenForm.get('breed').value;
    this.chicken.hatched = this.chickenForm.get('hatched').value;
    this.chicken.photoUrl = uploadResult ? uploadResult.imageUrl : this.chicken.photoUrl || '';
    this.chicken.photoPath = uploadResult ? uploadResult.imagePath : this.chicken.photoPath || '';
    this.chicken.thumbnailUrl = uploadResult ? uploadResult.thumbnailUrl : this.chicken.thumbnailUrl || '';
    this.chicken.thumbnailPath = uploadResult ? uploadResult.thumbnailPath : this.chicken.thumbnailPath || '';
    this.chickenService.saveChicken(user.currentFlockId, this.chicken)
      .then(() => {
        this.loadingMessage = null;
        this.location.back();
      })
      .catch(error => {
        console.log(error);
        this.loadingMessage = null;
      });
  }
}
