import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { generateEnumQuery, getEnumName } from '../core';

export class FirstVersion1552670893473 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await this._createEnums(queryRunner);
    await this._createTables(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('user_statuses', true, true);
    await queryRunner.dropTable('reporters', true, true);
    await queryRunner.query(generateEnumQuery('drop', 'platform'));
    await queryRunner.query(generateEnumQuery('drop', 'status'));
    await queryRunner.query(generateEnumQuery('drop', 'reason'));
  }

  private async _createEnums(queryRunner: QueryRunner) {
    await queryRunner.query(
      generateEnumQuery('create', 'platform', ['TWITTER', 'FACEBOOK', 'INSTAGRAM'])
    );
    await queryRunner.query(
      generateEnumQuery('create', 'status', [
        'REPORTED',
        'IN_PROCESS',
        'BOT',
        'NOT_BOT',
        'DUPLICATE'
      ])
    );
    await queryRunner.query(
      generateEnumQuery('create', 'reason', ['BOT', 'VIOLENCE', 'FAKE'])
    );
  }

  private async _createTables(queryRunner: QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'reporters',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'platform',
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
            name: 'reporter_key',
            type: 'varchar',
            length: '30',
            isNullable: false,
            isUnique: true
          }
        ],
        uniques: [{ columnNames: ['platform', 'user_id'] }]
      }),
      true
    );

    await queryRunner.createTable(
      new Table({
        name: 'user_statuses',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'platform',
            type: getEnumName('platform'),
            isNullable: false
          },
          {
            name: 'user_id',
            type: 'varchar',
            length: '255',
            isNullable: false
          },
          {
            name: 'username',
            type: 'varchar',
            length: '30',
            isNullable: true
          },
          {
            name: 'post_id',
            type: 'varchar',
            length: '255',
            isNullable: false
          },
          {
            name: 'comment_id',
            type: 'varchar',
            length: '255',
            isNullable: true
          },
          {
            name: 'reply_comment_id',
            type: 'varchar',
            length: '255',
            isNullable: true
          },
          {
            name: 'reasons',
            type: getEnumName('reason'),
            isArray: true,
            isNullable: false
          },
          {
            name: 'status',
            type: getEnumName('status'),
            default: `'REPORTED'`,
            isNullable: false
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            isNullable: true
          },
          {
            name: 'reporter_key',
            type: 'varchar',
            length: '30',
            isNullable: false
          }
        ],
        uniques: [
          {
            columnNames: ['platform', 'user_id', 'post_id', 'comment_id', 'reply_comment_id']
          }
        ],
        foreignKeys: [
          {
            columnNames: ['reporter_key'],
            referencedColumnNames: ['reporter_key'],
            referencedTableName: 'reporters',
            onDelete: 'CASCADE'
          }
        ]
      }),
      true,
      true
    );
  }
}
