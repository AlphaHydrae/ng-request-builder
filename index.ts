import { ModuleWithProviders, NgModule } from '@angular/core';

import { RequestBuilder } from './src/request-builder';
import { RequestBuilderService } from './src/request-builder-service';

export * from './src/request-builder';
export * from './src/request-builder-service';
export * from './src/observable-interceptor';

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
