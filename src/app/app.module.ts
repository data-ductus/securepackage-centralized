import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiService } from './services/api.service';
import { GlobalvarsService } from './services/globalvars.service';
import { GenerationService } from './services/generation.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ItemBrowserComponent } from './item-browser/item-browser.component';
import { ItemManagerComponent } from './item-manager/item-manager.component';
import { NewItemComponent } from './new-item/new-item.component';
import { ItemComponent } from './item/item.component';
import { AgreementComponent } from './agreement/agreement.component';
import { AmChartsModule } from '@amcharts/amcharts3-angular';

import { AgmCoreModule } from '@agm/core';
import { ExplorerComponent } from './explorer/explorer.component';


const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'items', component: ItemBrowserComponent},
  { path: 'itemmanager/:action', component: ItemManagerComponent},
  { path: 'newitem', component: NewItemComponent},
  { path: 'item/:id', component: ItemComponent},
  { path: 'agreement/:id', component: AgreementComponent},
  { path: 'explorer', component: ExplorerComponent}];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ItemBrowserComponent,
    ItemManagerComponent,
    NewItemComponent,
    ItemComponent,
    AgreementComponent,
    ExplorerComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    AmChartsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({ // @agm/core
      apiKey: 'AIzaSyCnD7Sr2wMskuqjxVGjP8EpDnd7Olf6fCg'
    }),
  ],
  providers: [ApiService, GlobalvarsService, GenerationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
