import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { CustomExceptionFilter } from 'src/config/filters/custom-exception.filter';
import { SuccessResponseInterceptor } from 'src/config/interceptors/success_response.interceptor';
import { MenuItemService } from './menu_items.service';
import {
  CreateMenuItemDTO,
  UpdateFieldDTO,
  UpdateMenuItemDTO,
} from './menu_items.dto';
import { MenuItem } from './menu_items.entity';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@UseFilters(CustomExceptionFilter)
@UseInterceptors(SuccessResponseInterceptor)
@Controller('api/menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Post('')
  async createMenuItem(
    @Body() createMenuItemDTO: CreateMenuItemDTO,
  ): Promise<MenuItem> {
    return this.menuItemService.createOne(createMenuItemDTO);
  }

  @Post('/sub/:id/:subItemId')
  async addSubItem(
    @Param('id') id: number,
    @Param('subItemId') subItemId: number
  ): Promise<MenuItem> {
    return this.menuItemService.addSubEntity(id, subItemId);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get('')
  async getAllMenuItems(
    @Query('sort_criterion') sort_criterion: keyof MenuItem,
    @Query('sort_value') sort_value: "ASC" | "DESC",
  ): Promise<MenuItem[]> {
    return this.menuItemService.findAll(sort_criterion, sort_value, { is_deleted: false });
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get('public/scope')
  async getAllMenuItemsByScope(
    @Query('scope') scope: string,
    @Query('sortOrder') sort_order: any,
  ): Promise<MenuItem[]> {
    return this.menuItemService.findAllByScope(scope, sort_order);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get('private/scope')
  async getPrivateMenuItemsByScope(
    @Query('scope') scope: string,
    @Query('sortOrder') sort_order: any,
  ): Promise<MenuItem[]> {
    return this.menuItemService.findAllPrivateByScope(scope, sort_order);
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get('single/:id')
  async getMenuItemById(@Param('id') id: number): Promise<MenuItem | null> {
    return this.menuItemService.findOneById(id);
  }

  @Patch('toggle/:id')
  async toggleOneField(
    @Param('id') id: number,
    @Query('field') field: string,
  ): Promise<MenuItem | null> {
    return this.menuItemService.toggleField(id, field);
  }

  @Patch('delete/:id')
  async softDeleteMenuItem(@Param('id') id: number): Promise<MenuItem | null> {
    return this.menuItemService.softDelete(id);
  }

  @Patch('field/:id')
  async updateOneField(
    @Param('id') id: number,
    @Body() updateFieldDTO: UpdateFieldDTO,
  ): Promise<MenuItem | null> {
    const { field, value } = updateFieldDTO;
    return this.menuItemService.updateField(id, field, value);
  }

  @Put(':id')
  async updateMenuItem(
    @Param('id') id: number,
    updateMenuItemDTO: UpdateMenuItemDTO,
  ): Promise<MenuItem | null> {
    return this.menuItemService.updateMultipleFields(id, updateMenuItemDTO);
  }

  @Delete(':id')
  async removeMenuItem(@Param('id') id: number): Promise<void> {
    return this.menuItemService.remove(id);
  }

  @Delete('/sub/:id/:subItemId')
  async removeSubItem(
    @Param('id') id: number,
    @Param('subItemId') subItemId: number
  ): Promise<MenuItem> {
    return this.menuItemService.removeSubEntity(id, subItemId);
  }
}
