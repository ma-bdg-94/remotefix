import { MenuItems } from './src/menu_items/menu_items.entity';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  password: 'boudagga94postgres',
  username: 'postgres',
  database: 'postgres',
  entities: [MenuItems],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
