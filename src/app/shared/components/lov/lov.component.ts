import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-lov',
  templateUrl: './lov.component.html',
  styleUrls: ['./lov.component.css']
})
export class LovComponent implements OnInit {

  constructor() {
  }

  @Input() form: FormGroup;
  // 表单字段
  @Input() fromControlName: string;
  // 显示字段
  @Input() textField: string;
  // 显示值字段
  @Input() textValue: string;

  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  modalVisible: boolean;
  // 输入框的值
  value: any = '';

  ngOnInit(): void {
  }

  onClick(): void {
    this.modalVisible = true;
  }

  hideModal(): void {
    this.modalVisible = false;
  }

  onCancel(): void {
    this.hideModal();
  }

  onOk(): void {
    this.change();
    this.hideModal();
  }

  change(): void {
    this.value = 'abcd';
    this.form.get(this.fromControlName).setValue('abc');
    console.log('lov change');
    if (this.valueChange) {
      this.valueChange.emit();
    }
  }

  /**
   * 选择值
   */
  check(): void {

  }
}
