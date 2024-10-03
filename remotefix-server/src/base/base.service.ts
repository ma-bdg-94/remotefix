import { Injectable } from '@nestjs/common';
import { DeletedStatus } from 'src/config/types/types';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export abstract class BaseService<T> {
  constructor(private readonly repository: Repository<T>) {}

  async createOne(data: DeepPartial<T>): Promise<T> {
    const newEntity = this.repository.create(data);
    return await this.repository.save(newEntity);
  }

  async findAll(
    order_criterion: keyof T,
    order_value: 'ASC' | 'DESC',
    deletedStatus: DeletedStatus,
  ): Promise<T[]> {
    const validDirections: ('ASC' | 'DESC')[] = ['ASC', 'DESC'];
    if (!validDirections.includes(order_value)) {
      order_value = 'ASC';
    }
    return this.repository.find({
      where: deletedStatus as any,
      order: { [order_criterion]: order_value } as any,
    });
  }
}
