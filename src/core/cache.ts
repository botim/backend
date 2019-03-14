import * as NodeCache from 'node-cache';
import * as moment from 'moment';
import { Duration } from 'moment';

/**
 * Cache utility. wrap cache API to replace cache tool with redis client easily.
 */
export class Cache {
  private _nodeCache: NodeCache;

  /**
   * Init Cache.
   * @param ttl Time to hold value in cache.
   * @param checkperiod Automatic delete check interval.
   */
  constructor(ttl: Duration, checkperiod: Duration = moment.duration(0)) {
    this._nodeCache = new NodeCache({
      stdTTL: ttl.asSeconds(),
      checkperiod: checkperiod.asSeconds()
    });
  }

  /**
   * Get value by key.
   * @param key Key to get for.
   * @returns The value, or 'undefined' if not exist.
   */
  public async get(key: string | number): Promise<any> {
    return this._nodeCache.get(key);
  }

  /** Save or set value map by key to cache. */
  public async set(key: string | number, value: any): Promise<void> {
    this._nodeCache.set(key, value);
  }
}
