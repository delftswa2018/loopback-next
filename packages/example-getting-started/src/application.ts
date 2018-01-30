// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/example-getting-started
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Application, ApplicationConfig, BootOptions} from '@loopback/core';
import {Context} from '@loopback/context';
import {BootComponent} from '@loopback/boot';
import {RestApplication} from '@loopback/rest';
import {TodoRepository} from './repositories';
import {db} from './datasources/db.datasource';
/* tslint:disable:no-unused-imports */
// Class and Repository imports required to infer types in consuming code!
// Do not remove them!
import {
  Class,
  Repository,
  DataSourceConstructor,
  RepositoryMixin,
} from '@loopback/repository';
/* tslint:enable:no-unused-imports */
export class TodoApplication extends RepositoryMixin(RestApplication) {
  constructor(options?: ApplicationConfig) {
    // TODO(bajtos) The comment below does not make sense to me.
    // Consumers of TodoApplication object should not be changing the shape
    // of the app (what components are mounted, etc.) The config object should
    // be used only to configure what ports the app is listening on,
    // which database to connect to, etc.
    // See https://github.com/strongloop/loopback-next/issues/742

    super(options);
    this.component(BootComponent);
    this.setupRepositories();
  }

  async boot(bootOptions?: BootOptions): Promise<Context> {
    if (!bootOptions) bootOptions = {projectRoot: __dirname};
    if (!bootOptions.projectRoot) bootOptions.projectRoot = __dirname;
    return await super.boot(bootOptions);
  }

  // Helper functions (just to keep things organized)
  setupRepositories() {
    // TODO(bajtos) Automate datasource and repo registration via @loopback/boot
    // See https://github.com/strongloop/loopback-next/issues/441
    const datasource =
      this.options && this.options.datasource
        ? new DataSourceConstructor(this.options.datasource)
        : db;
    // TODO(bajtos) use app.dataSource() from @loopback/repository mixin
    // (app.dataSource() is not implemented there yet)
    // See https://github.com/strongloop/loopback-next/issues/743
    this.bind('datasource').to(datasource);
    this.repository(TodoRepository);
  }
}
