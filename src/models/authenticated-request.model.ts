import { Entity, Column } from 'typeorm';

/**
 * Each schema that needs to authenticate the client before handling it should extend it.
 */
@Entity()
export class AuthenticatedRequest {
  @Column({ name: 'reporter_key', type: 'varchar', length: 30 })
  reporterKey: string;

  constructor(private authenticatedRequest?: Partial<AuthenticatedRequest>) {
    if (authenticatedRequest) {
      this.reporterKey = authenticatedRequest.reporterKey;
    }
  }
}
