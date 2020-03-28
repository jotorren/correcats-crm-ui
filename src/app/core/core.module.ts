import { NgModule, Optional, SkipSelf } from '@angular/core';

@NgModule({
    imports: [],
    declarations: [],
    exports: [],
    providers: []
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}

export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
    if (parentModule) {
        throw new Error(`${moduleName} has already been loaded. Import it in the AppModule only.`);
    }
}
