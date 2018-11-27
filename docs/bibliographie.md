**Bibliographie build by (put your credits below if you improve it) :**

- Miguel Monwoo (service@monwoo.com)

**---**

Refresh you knowledge about Markdown language :

https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet

https://help.github.com/articles/basic-writing-and-formatting-syntax/

https://github.com/github/markup/issues/353 :

For bold text : It looks like it doesn't work on GitHub unless there are white spaces before and after the asterisks.

=> well, it's more like need space Before the \*\* and No space after it for start of bold séquence, opposite at end.

---

Dev stuffs :

- https://angular.io/tutorial/toh-pt5
- https://angular.io/api/router/CanActivate
- https://www.concretepage.com/angular-2/angular-2-4-route-guards-canactivate-and-canactivatechild-example
- https://github.com/zefoy/ngx-dropzone-wrapper/blob/v7.1.0/src/lib/dropzone.component.ts
- https://www.dropzonejs.com/#dropzone-methods
- https://momentjs.com/docs/
- https://medium.com/@a.yurich.zuev/angular-nested-template-driven-form-4a3de2042475
- https://blog.grossman.io/real-world-angular-reactive-forms/
- https://scotch.io/tutorials/how-to-build-nested-model-driven-forms-in-angular-2
- https://www.sitepoint.com/component-routing-angular-router/
- https://stackoverflow.com/questions/47133610/angular-4-manual-redirect-to-route
- https://www.jvandemo.com/the-7-step-process-of-angular-router-navigation/
- https://angular.io/guide/router#heroes-list-optionally-selecting-a-hero
- https://stackoverflow.com/questions/38648407/angular2-error-there-is-no-directive-with-exportas-set-to-ngform
- https://www.angularjswiki.com/angular/angular-material-2-tutorial-with-examples/
- https://github.com/cyrilletuzi/angular-async-local-storage
- http://json-schema.org/
- https://angular.io/guide/pipes
- https://angular.io/api?type=pipe
- https://alligator.io/angular/built-in-pipes-angular/
- https://www.bennadel.com/blog/3043-providing-default-values-for-the-safe-navigation-operator-in-angular-2-beta-8.htm
- https://www.intertech.com/Blog/angular-component-lifecycle/
- https://angular.io/guide/lifecycle-hooks
- https://angular.io/api/core/OnChanges
- https://stackoverflow.com/questions/43049312/how-to-pass-object-as-a-param-on-ngmodelchange-angular-2
- https://alligator.io/angular/reactive-forms-valuechanges/
- https://stackoverflow.com/questions/48660515/how-to-listen-of-angular-template-driven-form-changes
- https://medium.com/@tomastrajan/object-assign-vs-object-spread-in-angular-ngrx-reducers-3d62ecb4a4b0
- https://github.com/flauc/ng-push
- https://github.com/dominique-mueller/angular-notifier
- https://github.com/flauc/angular2-notifications
- https://stackblitz.com/edit/angular2-notifications-example
- https://blog.angular-university.io/angular-push-notifications/
- https://stackoverflow.com/questions/2641347/short-circuit-array-foreach-like-calling-break
- https://stackoverflow.com/questions/3486359/regex-to-extract-substring-returning-2-results-for-some-reason
- https://dzone.com/articles/angular-components-pass-by-reference-or-pass-by-va
- https://stackoverflow.com/questions/43520257/angular2-service-testing-inject-a-dependency-with-beforeeach
- https://stackoverflow.com/questions/27978819/extract-time-from-moment-js-object
- https://material.io/develop/web/components/layout-grid/
- https://material-ui.com/layout/grid/
- https://material.io/design/layout/responsive-layout-grid.html
- https://material-ui.com/api/grid/
- https://material.angular.io/components/tabs/overview
- https://material.angular.io/components/expansion/overview
- https://material.angular.io/components/card/overview
- https://material.io/design/components/app-bars-top.html#
- https://stackoverflow.com/questions/28959615/how-to-set-space-between-two-flexbox
- https://material.angularjs.org/latest/layout/options
- https://github.com/angular/flex-layout
- https://material.angularjs.org/latest/layout/alignment

* https://stackoverflow.com/questions/40683673/how-to-execute-only-one-test-spec-with-angular-cli
  Each of your .spec.ts file have all its tests grouped in describe block like this:
  describe('SomeComponent', () => {...}
  You can easily run just this single block, by prefixing the describe function name with f:
  fdescribe('SomeComponent', () => {...}
  If you have such function, no other describe blocks will run. Btw. you can do similar thing with it => fit and there is also a "blacklist" version - x. So:
  fdescribe and fit causes only functions marked this way to run
  xdescribe and xit causes all but functions marked this way to run

```bash
# Basic tools for time sheets web reportings :
yarn add @angular-mdc/web angular/material hammerjs @angular/animations
yarn add '@angular/cdk' '@angular/material' angular-calendar date-fns
yarn add ccapture.js chart.js fullcalendar gif.js moment webm-writer
yarn add primeng primeicons ngx-dropzone-wrapper @ngx-pwa/local-storage@7
yarn add angular2-notifications lodash-es @types/lodash-es
# angular2-logger may be used if src/app/core/logger.service.ts is not enought (log call statck for débug ??)
```

TODO :

try to launch single test, below is falling for now :
yarn run test --karma-config src/app/moon-manager/pipes/url-transformer.pipe.spec.ts
