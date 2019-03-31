import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { getEnumName } from '../core';

export class AddActivityLog1553973835850 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await this._createTables(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('activity_log', true, true);
  }

  private async _createTables(queryRunner: QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'activity_log',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'user_status_id',
            type: 'int',
            isNullable: true
          },
          {
            name: 'old_status',
            type: getEnumName('status'),
            isNullable: true
          },
          {
            name: 'new_status',
            type: getEnumName('status'),
            isNullable: false
          },
          {
            name: 'admin_id',
            type: 'int',
            isNullable: true
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'now()'
          }
        ],
        foreignKeys: [
          {
            columnNames: ['user_status_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user_statuses',
            onDelete: 'NO ACTION'
          },
          {
            columnNames: ['admin_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'admins',
            onDelete: 'NO ACTION'
          }
        ]
      })
    );
  }
}
