import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class UpdateColumns1553657266252 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await this._createColumns(queryRunner);
    await this._updateColumns(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('user_statuses', 'reported_at');
    await this._undoUpdateColumns(queryRunner);
  }

  private async _createColumns(queryRunner: QueryRunner) {
    await queryRunner.addColumn(
      'user_statuses',
      new TableColumn({
        name: 'reported_at',
        type: 'timestamp',
        isNullable: false,
        default: 'now()'
      })
    );
  }

  private async _updateColumns(queryRunner: QueryRunner) {
    await queryRunner.query(
      'ALTER TABLE "user_statuses" ALTER COLUMN "user_id" TYPE varchar(255)'
    );
    await queryRunner.query(
      'ALTER TABLE "user_statuses" ALTER COLUMN "username" TYPE varchar(255)'
    );
    await queryRunner.query(
      'ALTER TABLE "user_statuses" ALTER COLUMN "post_id" TYPE varchar(255)'
    );
    await queryRunner.query(
      'ALTER TABLE "user_statuses" ALTER COLUMN "comment_id" TYPE varchar(255)'
    );
    await queryRunner.query(
      'ALTER TABLE "user_statuses" ALTER COLUMN "reply_comment_id" TYPE varchar(255)'
    );
    await queryRunner.query(
      'ALTER TABLE "user_statuses" ALTER COLUMN "description" TYPE varchar(255)'
    );

    await queryRunner.query(
      'ALTER TABLE "reporters" ALTER COLUMN "user_id" TYPE varchar(255)'
    );
  }

  private async _undoUpdateColumns(queryRunner: QueryRunner) {
    await queryRunner.query(
      'ALTER TABLE "user_statuses" ALTER COLUMN "user_id" TYPE varchar(30)'
    );
    await queryRunner.query(
      'ALTER TABLE "user_statuses" ALTER COLUMN "username" TYPE varchar(30)'
    );
    await queryRunner.query(
      'ALTER TABLE "user_statuses" ALTER COLUMN "post_id" TYPE varchar(30)'
    );
    await queryRunner.query(
      'ALTER TABLE "user_statuses" ALTER COLUMN "comment_id" TYPE varchar(30)'
    );
    await queryRunner.query(
      'ALTER TABLE "user_statuses" ALTER COLUMN "reply_comment_id" TYPE varchar(30)'
    );
    await queryRunner.query(
      'ALTER TABLE "user_statuses" ALTER COLUMN "description" TYPE varchar(200)'
    );

    await queryRunner.query('ALTER TABLE "reporters" ALTER COLUMN "user_id" TYPE varchar(30)');
  }
}
