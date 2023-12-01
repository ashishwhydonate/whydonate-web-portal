# Whydonate Web Portal

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Libraries

The following libraries will be used to develop the application.

- Angular i18n Module → Localization
- Reactive Extensions for JavaScript (RxJs)
- Angular Material → UI Component Library
- NGRX State Management → App State Management
- Angular Universal → Server Side Rendering Engine for SEO
- Angular Ivy→ Compilation and Rendering Pipeline
- Cypress → E2E Testing Library
- Compodoc → Automated Documentation for Angular
- Sentry → Error/bug reporting
- Sitemap → // To Do
- Cloudinary → Image CDN
- NGX Share buttons - Angular Share Buttons
- Mollie → Payment Service Provider

## Development Rules

NOTE: Refer to Angular official coding standard guide for details. https://angular.io/guide/styleguide

### Single Responsibility Principle:

A class should have one and only one reason to change, meaning that a class should have only one job.

### Open-Closed Principle:

Objects or entities should be open for extension but closed for modification.

### Liskov Substitution Principle

Let q(x) be a property provable about objects of x of type T. Then q(y) should be provable for objects y of type S where S is a subtype of T.

### Interface Segregation Principle:

A client should never be forced to implement an interface that it doesn’t use, or clients shouldn’t be forced to depend on methods they do not use.

### Dependency Inversion Principle:

Entities must depend on abstractions, not on concretions. It states that the high-level module must not depend on the low-level module, but they should depend on abstractions.

- Strictly use Angular/Typescript strict mode for development.
- Strictly follow small functions.
- Strictly extract templates and styles to their own files.
- Strictly avoid aliasing inputs and outputs.
- Use meaningful naming conventions.
- Use prettier for code format. https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
- Strictly use the libraries mentioned above.
- All modules mentioned above will be lazy loaded.
- Strictly follow the scalable code plan for future development.
- Create a new Docker image that can be used for development and testing. Building time should be reduced so it can be used for local testing..
- Keep track of building time in the pipeline. It should not take more than a couple of minutes.
- Add 301 redirects to the new project in case someone uses the old url, like whydonate.eu/fundraising/slug/en.

## Using BitBucket Pipelines to push to github
