import { ModuleWithProviders, NgModule } from '@angular/core';

import { RequestBuilder } from './request-builder';
import { RequestBuilderService } from './request-builder-service';

export * from './request-builder';
export * from './request-builder-service';

@NgModule({
  providers: [
    RequestBuilderService
  ]
})
export class RequestBuilderModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: RequestBuilderModule,
      providers: [ RequestBuilderService ]
    };
  }

}
