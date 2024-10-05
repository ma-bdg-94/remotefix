import { Injectable } from '@nestjs/common';
import { DeletedStatus } from 'src/config/types/types';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export abstract class BaseService<T> {
  constructor(private readonly repository: Repository<T>) {}

  async createOne(data: DeepPartial<T>): Promise<T> {
    const newEntity = this.repository.create(data);
    return await this.repository.save(newEntity);
  }

  async findAll(
    filter: FindOptionsWhere<T>,
    order_criterion: keyof T,
    order_value: 'ASC' | 'DESC' | 'asc' | 'desc',
    page: number,
    limit: number,
  ): Promise<T[]> {
    const validDirections: ('ASC' | 'DESC' | 'asc' | 'desc')[] = [
      'ASC',
      'DESC',
      'asc',
      'desc',
    ];
    if (!validDirections.includes(order_value)) {
      order_value = 'ASC';
    }

    order_value = order_value.toUpperCase() as any;

    const skip: number = (page - 1) * limit;

    const result = this.repository.find({
      where: filter as any,
      order: { [order_criterion]: order_value } as any,
      skip,
      take: limit,
    });

    return result;
  }

  async findById(
    id: number | string,
    other_criteria?: FindOptionsWhere<T>,
  ): Promise<T> {
    const result = this.repository.findOne({
      where: { id, ...other_criteria },
    });

    return result;
  }

  async findOne(criteria: FindOptionsWhere<T>): Promise<T> {
    const result = this.repository.findOne({
      where: criteria,
    });

    return result;
  }

  async toggleField(entity: T | any, field: keyof T): Promise<T> {
    entity[field] = !entity[field];
    return entity;
  }

  async updateField(entity: T | any, field: keyof T, value: any): Promise<T> {
    entity[field] = value;
    return entity;
  }

  async updateManyFields(entity: T | any, data: DeepPartial<T>): Promise<T> {
    const updatedEntity = this.repository.merge(entity, data)
    return await this.repository.save(updatedEntity);
  }

  async remove(id: number, other_criteria?: FindOptionsWhere<T>): Promise<void> {
    await this.repository.delete({ id, ...other_criteria })
  }
}
