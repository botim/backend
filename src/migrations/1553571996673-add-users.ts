import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { generateEnumQuery, getEnumName } from '../core';

export class AddUsers1553571996673 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await this._createTables(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('users', true, true);
  }

  private async _createTables(queryRunner: QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'users',
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
          }
        ]
      })
    );
  }
}
