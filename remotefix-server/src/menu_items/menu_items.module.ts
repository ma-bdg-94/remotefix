import { Module } from '@nestjs/common';
import { MenuItemService } from './menu_items.service';
import { MenuItem } from './menu_items.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemController } from './menu_items.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem]), CacheModule.register()],
  providers: [MenuItemService],
  controllers: [MenuItemController],
})
export class MenuItemModule {}
