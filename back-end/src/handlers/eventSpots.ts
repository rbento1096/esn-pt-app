///
/// IMPORTS
///

import { DynamoDB, RCError, ResourceController } from 'idea-aws';

import { EventSpot } from '../models/eventSpot.model';
import { User } from '../models/user.model';

///
/// CONSTANTS, ENVIRONMENT VARIABLES, HANDLER
///

const DDB_TABLES = {
  users: process.env.DDB_TABLE_users,
  configurations: process.env.DDB_TABLE_configurations,
  eventSpots: process.env.DDB_TABLE_eventSpots
};
const ddb = new DynamoDB();

export const handler = (ev: any, _: any, cb: any): Promise<void> => new EventSpotsRC(ev, cb).handleRequest();

///
/// RESOURCE CONTROLLER
///

class EventSpotsRC extends ResourceController {
  user: User;
  spot: EventSpot;

  constructor(event: any, callback: any) {
    super(event, callback, { resourceId: 'spotId' });
  }

  protected async checkAuthBeforeRequest(): Promise<void> {
    try {
      this.user = new User(await ddb.get({ TableName: DDB_TABLES.users, Key: { userId: this.principalId } }));
    } catch (err) {
      throw new RCError('User not found');
    }

    if (!(this.user.permissions.isAdmin || this.user.permissions.canManageRegistrations))
      throw new RCError('Unauthorized');

    if (!this.resourceId) return;

    try {
      this.spot = new EventSpot(await ddb.get({ TableName: DDB_TABLES.eventSpots, Key: { spotId: this.resourceId } }));
    } catch (err) {
      throw new RCError('Spot not found');
    }
  }

  protected async getResource(): Promise<EventSpot> {
    return this.spot;
  }

  protected async putResource(): Promise<EventSpot> {
    const oldSpot = new EventSpot(this.spot);
    this.spot.safeLoad(this.body, oldSpot);

    return await this.putSafeResource();
  }
  private async putSafeResource(): Promise<EventSpot> {
    const errors = this.spot.validate();
    if (errors.length) throw new RCError(`Invalid fields: ${errors.join(', ')}`);

    await ddb.put({ TableName: DDB_TABLES.eventSpots, Item: this.spot });
    return this.spot;
  }

  protected async getResources(): Promise<EventSpot[]> {
    return (await ddb.scan({ TableName: DDB_TABLES.eventSpots })).map(x => new EventSpot(x));
  }
}
