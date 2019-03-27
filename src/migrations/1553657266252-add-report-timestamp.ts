import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class AddReportTimestamp1553657266252 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await this._createColumns(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('user_statuses', 'reported_at');
  }

  private async _createColumns(queryRunner: QueryRunner) {
    await queryRunner.addColumn(
      'user_statuses',
      new TableColumn({
        name: 'reported_at',
        type: 'bigint',
        isNullable: false,
        default: 0
      })
    );
  }
}
