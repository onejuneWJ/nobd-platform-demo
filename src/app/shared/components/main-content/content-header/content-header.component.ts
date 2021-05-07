import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.css']
})
export class ContentHeaderComponent implements OnInit {
  @Input() showArrow = false;
  @Input() title = 'Title';
  @Output() back = new EventEmitter<any>();
  constructor() {
  }

  ngOnInit(): void {
  }

  click(): void {
    console.log('click');
  }

  onBackClick(): void {
    this.back.emit();
  }
}
