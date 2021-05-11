import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LtePmComponent } from './lte-pm/lte-pm.component';
import { FifthGenerationMrComponent } from './fifth-generation-mr/fifth-generation-mr.component';
import { FifthGenerationPmComponent } from './fifth-generation-pm/fifth-generation-pm.component';
import { ProblemAreaComponent } from './problem-area/problem-area.component';
import {RouterModule, Routes} from "@angular/router";
import { LteMrComponent } from './lte-mr/lte-mr.component';
import {SharedModule} from "@shared/Shared.Module";
import {CoreModule} from "@core/core.module";

const routes: Routes = [
  {
    path: '', redirectTo: 'lte-mr', pathMatch: 'full'
  },
  {
    path: 'lte-mr', component: LteMrComponent,
    data: {
      reload: true,
      hash: 'sjfx-lte-mr'
    }
  },
  {
    path: 'lte-pm',
    component: LtePmComponent,
    data: {
      reload: true,
      hash: 'sjfx-lte-pm'
    }
  },
  {
    path: 'fifth-generation-mr',
    component: FifthGenerationMrComponent,
    data: {
      reload: true,
      hash: 'sjfx-5g-mr'
    }
  },
  {
    path: 'fifth-generation-pm',
    component: FifthGenerationPmComponent,
    data: {
      reload: true,
      hash: 'sjfx-5g-pm'
    }
  },
  {
    path: 'problem-area',
    component: ProblemAreaComponent,
    data: {
      reload: true,
      hash: 'sjfx-wtxq'
    }
  },
];

@NgModule({
  declarations: [
    LtePmComponent,
    FifthGenerationMrComponent,
    FifthGenerationPmComponent,
    ProblemAreaComponent,
    LteMrComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule,
    CoreModule
  ]
})
export class DataAnalysisModule { }
