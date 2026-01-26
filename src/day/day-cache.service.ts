import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { Day } from './entities/day.entity';

@Injectable()
export class DayCacheService {
  private dayKey = 'days';
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async saveDays(days: Day[]) {
    await this.cacheManager.set(this.dayKey, days, 0);
  }

  async getDays(): Promise<Day[] | undefined> {
    return await this.cacheManager.get<Day[]>(this.dayKey);
  }

  async invalidateDays() {
    await this.cacheManager.del(this.dayKey);
  }
}
