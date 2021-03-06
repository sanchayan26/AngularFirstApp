import { Component, OnInit ,ViewChild,Inject} from '@angular/core';
import { Dish } from '../shared/dish';

import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import {visibility, flyInOut, expand} from "../animations/app.animation";



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
    host: {
    '[@flyInOut]': 'true',
      'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      visibility(),
      expand()
    ]
})


export class DishdetailComponent implements OnInit {


  commentForm: FormGroup;
  comment: Comment;
  dishcopy: Dish;
  errMess:string;

  visibility = 'shown';
  @ViewChild('fform') commentFormDirective;


  formErrors = {
    'name': '',
    'comment': ''

  };

  validationMessages = {
    'name': {
      'required':      ' Author Name is required.',
      'minlength':     ' Author Name must be at least 2 characters long.',
      'maxlength':     ' cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'comment is required.',
      'minlength':     'comment must be at least 2 characters long.',
      'maxlength':     'comment cannot be more than 300 characters long.'
    },
  };

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  today: number = Date.now();


  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location ,private fb: FormBuilder,
              @Inject('BaseURL') public BaseURL) {
      this.createForm();
     }

    ngOnInit() {
      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); }))
        .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
          errmess => this.errMess = <any>errmess);
    }

    createForm() {
      this.commentForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        rating:5
      });

      this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data),
        errmess => this.errMess = <any>errmess);

    this.onValueChanged(); // (re)set validation messages now
    }

    onValueChanged(data?: any) {
      if (!this.commentForm) { return; }
      const form = this.commentForm;
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
      }
    }

    onSubmit() {
     let date =new Date().toISOString();
      this.comment = this.commentForm.value;
      this.comment.date=date;
      console.log(this.comment);
      this.dishcopy.comments.push(this.comment);
      this.dishservice.putDish(this.dishcopy)
        .subscribe(dish => {
            this.dish = dish; this.dishcopy = dish;
          },
          errmess => { this.dish == null; this.dishcopy == null; this.errMess = <any>errmess; });
      this.commentForm.reset({
        name: '',
        rating: '',
        comment: '',

      });
      this.commentFormDirective.resetForm(this.commentForm.value);
    }


    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }

  goBack(): void {
    this.location.back();
  }

}
