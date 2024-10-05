import { DeepPartial, FindOptionsOrder, FindOptionsWhere } from "typeorm";

export interface IBaseRepository<T> {
  findAll(sort: FindOptionsOrder<T>): Promise<T[]>;
  findMany(options: FindOptionsWhere<T>, sort: FindOptionsOrder<T>): Promise<T[]>;
  findOne(options: FindOptionsWhere<T>): Promise<T>;

  create(data: DeepPartial<T>): Promise<T>;

  update()
}