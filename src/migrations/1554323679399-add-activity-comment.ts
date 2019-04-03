import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class AddActivityComment1554323679399 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await this._createColumns(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('activity_log', 'comment');
  }

  private async _createColumns(queryRunner: QueryRunner) {
    await queryRunner.addColumn(
      'activity_log',
      new TableColumn({
        name: 'comment',
        type: 'varchar',
        length: '255',
        isNullable: true
      })
    );
  }
}
