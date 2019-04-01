import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { generateEnumQuery, getEnumName } from '../core';

export class AddAdmins1553571996673 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await this._createEnums(queryRunner);
    await this._createTables(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('admins', true, true);
    await queryRunner.query(generateEnumQuery('drop', 'scope'));
  }

  private async _createEnums(queryRunner: QueryRunner) {
    await queryRunner.query(
      generateEnumQuery('create', 'scope', ['REPORTER', 'ADMIN', 'SUPER_ADMIN'])
    );
  }

  private async _createTables(queryRunner: QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'admins',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'username',
            type: 'varchar',
            length: '30',
            isNullable: false,
            isUnique: true
          },
          {
            name: 'password',
            type: 'varchar',
            length: '128',
            isNullable: false
          },
          {
            name: 'email',
            type: 'varchar',
            length: '100',
            isNullable: false,
            isUnique: true
          },
          {
            name: 'scope',
            type: getEnumName('scope'),
            isNullable: false
          }
        ]
      })
    );
  }
}
