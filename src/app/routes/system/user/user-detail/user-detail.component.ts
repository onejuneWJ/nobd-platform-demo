import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SystemUserService} from '@core/services/system/system-user.service';
import {SysUser} from '@entity/system/SysUser';
import {Constants} from '@shared/utils/Constants';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  user: any = {};
  currentUser: SysUser = null;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: SystemUserService
  ) {
  }

  ngOnInit(): void {
    const userId = this.activatedRoute.snapshot.paramMap.get('id');
    this.currentUser = JSON.parse(sessionStorage.getItem(Constants.currentUserKey));
    this.search(userId);
  }

  search(userId: string): void {
    this.service.detail(userId).subscribe(data => {
      this.user = data || {};
    });
  }

  onBack(): void {
    this.router.navigateByUrl('/system/user').then();
  }

  save(content: string): void {
    console.log(content);
    console.log(this.user.username);
  }
}
