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
            name: 'reported_by',
            type: 'varchar',
            length: '30',
            isNullable: true
          },
          {
            name: 'analyzed_by',
            type: 'varchar',
            length: '30',
            isNullable: true
          },
          {
            name: 'user_platform',
            type: getEnumName('platform'),
            isNullable: false
          },
          {
            name: 'user_id',
            type: 'varchar',
            length: '30',
            isNullable: false
          },
          {
            name: 'action',
            type: getEnumName('status'),
            isNullable: false
          },
          {
            name: 'timestamp',
            type: 'timestamp',
            isNullable: false,
            default: 'now()'
          }
        ],
        foreignKeys: [
          {
            columnNames: ['reported_by'],
            referencedColumnNames: ['reporter_key'],
            referencedTableName: 'reporters',
            onDelete: 'NO ACTION'
          },
          {
            columnNames: ['analyzed_by'],
            referencedColumnNames: ['username'],
            referencedTableName: 'users',
            onDelete: 'NO ACTION'
          }
        ]
      })
    );
  }
}
