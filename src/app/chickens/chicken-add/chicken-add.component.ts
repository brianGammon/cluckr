import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService, ChickenService, ImageService, UploadService } from '../../shared/services';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, Chicken, ImageProcessingResult, UploadResult } from '../../shared/models';

@Component({
  templateUrl: './chicken-add.component.html',
  styleUrls: ['./chicken-add.component.scss']
})
export class ChickenAddComponent implements OnInit {
  chickenForm: FormGroup;
  location: Location;
  imageData: ImageProcessingResult;
  loadingMessage: string = null;
  errorMessage: string = null;

  formErrors = {
    'name': ''
  };

  validationMessages = {
    'name': {
      'required': 'Chicken name is required.'
    }
  };

  constructor(
    private router: Router,
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
      'name': ['', [
        Validators.required
      ]
      ],
      'breed': ['', []],
      'hatched': ['', []],
      'photo': ['']
    });

    this.chickenForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages

  }

  addChicken() {
    this.errorMessage = null;
    this.userService.currentUser.take(1).subscribe(user => {
      if (user && this.chickenForm.valid) {
        // Save resized images to storage
        if (this.imageData && this.imageData.result === 'success') {
          this.loadingMessage = 'Uploading image...';
          console.log('uploading images');
          // User selcted an image
          this.uploadService.pushUpload(this.imageData.imageSet, user['$key'], user.currentFlockId)
            .then(uploadResult => this.saveChicken(user, uploadResult))
            .catch(err => {
              this.errorMessage = 'Oops, something went wrong 😩';
              this.loadingMessage = null;
              this.imageData = null;
              console.log(err);
            });
        } else {
          // No photo added
          this.saveChicken(user);
        }
      }
    });
  }

  resetPreview() {
    this.imageData = null;
  }

  onImageChange(event) {
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
  onValueChanged(data?: any) {
    if (!this.chickenForm) { return; }
    const form = this.chickenForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  private saveChicken(user: User, uploadResult?: UploadResult) {
    const chicken = new Chicken();
    chicken.name = this.chickenForm.get('name').value;
    chicken.breed = this.chickenForm.get('breed').value;
    chicken.hatched = this.chickenForm.get('hatched').value;
    chicken.photoUrl = uploadResult ? uploadResult.imageUrl : '';
    chicken.photoPath = uploadResult ? uploadResult.imagePath : '';
    chicken.thumbnailUrl = uploadResult ? uploadResult.thumbnailUrl : '';
    chicken.thumbnailPath = uploadResult ? uploadResult.thumbnailPath : '';

    this.chickenService.addChicken(user.currentFlockId, chicken)
      .then(data => {
        this.loadingMessage = null;
        this.router.navigateByUrl('/flock');
      })
      .catch(error => {
        console.log(error);
        this.loadingMessage = null;
      });
  }
}
