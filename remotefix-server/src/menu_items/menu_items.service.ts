import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuItem } from './menu_items.entity';
import { FindOptionsWhere, LessThan, Raw, Repository } from 'typeorm';
import { subDays } from 'date-fns';
import { BaseService } from 'src/base/base.service';

@Injectable()
export class MenuItemService extends BaseService<MenuItem> {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {
    super(menuItemRepository);
  }

  private readonly LINK_REGEX =
    /^(?:(?:https?|ftp):\/\/|#|\/)(?:[\w_-]+(?:\/[\w_-]+)*)?(?:\?[\w_-]+=\w+(&[\w_-]+=\w+)*)?$/;

  async createOne(menuItemData: Partial<MenuItem>): Promise<MenuItem> {
    const { link } = menuItemData;
    const existing_menu_item = await super.findOne({ link });

    // link check
    if (link && !this.LINK_REGEX.test(link)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: "Associated menu item's link seems not valid!",
      });
    }

    // conflict check
    if (existing_menu_item && link && link !== '#') {
      console.log(existing_menu_item && link)
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message: `Menu item with link ${link} already exists in the database!`,
      });
    }

    const existingMenuItemsCount = await this.menuItemRepository.countBy({
      is_deleted: false,
    });

    // define some default values
    menuItemData['position'] = existingMenuItemsCount + 1;
    
    return await super.createOne(menuItemData);
  }

  async findAll(
    filter: FindOptionsWhere<MenuItem>,
    order_criterion: keyof MenuItem,
    order_value: 'ASC' | 'DESC',
    page: number,
    limit: number,
  ): Promise<MenuItem[]> {
    const menu_item_list = super.findAll(
      filter,
      order_criterion,
      order_value,
      page,
      limit,
    );

    if ((await menu_item_list).length < 1) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `No menu item found in the database with requested criteria!`,
      });
    }
    return menu_item_list;
  }

  async findOneById(id: number): Promise<MenuItem | null> {
    const menu_item = super.findById(id);

    if (!menu_item) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    return menu_item;
  }

  async toggleField(
    id: number,
    field: keyof MenuItem,
  ): Promise<MenuItem | null> {
    const menu_item = super.findById(id, {
      is_deleted: false,
      is_archived: false,
    });

    if (!menu_item) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    if (menu_item[field] === undefined) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Menu item does not have property = ${field}.`,
      });
    }

    if (typeof menu_item[field] !== 'boolean') {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: `Menu item's' property ${field} is not togglable.`,
      });
    }

    return super.toggleField(menu_item, field);
  }

  async updateField(
    id: number,
    field: keyof MenuItem,
    value: any,
  ): Promise<MenuItem | null> {
    const menu_item = super.findById(id, { is_deleted: false });

    if (!menu_item) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    if (menu_item[field] === undefined) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Menu item does not have property = ${field}.`,
      });
    }

    return super.updateField(menu_item, field, value);
  }

  async updateEntity(
    id: number,
    menu_item_data: Partial<MenuItem>,
  ): Promise<MenuItem | null> {
    const { link } = menu_item_data;
    const menu_item = super.findById(id, { is_deleted: false });

    if (!menu_item) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    // link check
    if (link && !this.LINK_REGEX.test(link)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: "Associated menu item's link seems not valid!",
      });
    }

    return super.updateManyFields(menu_item, menu_item_data);
  }

  async removeEntity(
    id: number,
    filter?: FindOptionsWhere<MenuItem>,
  ): Promise<void> {
    const date_60_days_ago: Date = subDays(new Date(), 60);
    const menu_item = super.findById(id, {
      ...filter,
      is_deleted: true,
      deleted_at: LessThan(date_60_days_ago),
    });

    if (!menu_item) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database or other criteria are not respected or is already deleted more than 60 days ago.`,
      });
    }

    await super.remove(id, filter);
  }

  async addSubEntity(id: number, sub_entity_id: number): Promise<MenuItem | null> {
    const menu_item = await super.findById(id, { is_deleted: false });
    const sub_menu_item = await super.findById(sub_entity_id, { is_deleted: false });

    if (!menu_item) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    if (!sub_menu_item) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${sub_entity_id} in the database.`,
      });
    }

    menu_item.sub_items.push(sub_menu_item.id)

    return this.menuItemRepository.save(menu_item);
  }

  async removeSubEntity(id: number, sub_entity_id: number): Promise<MenuItem | null> {
    const menu_item = await super.findById(id, { is_deleted: false });
    const sub_menu_item = await super.findById(sub_entity_id, { is_deleted: false });

    if (!menu_item) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    if (!sub_menu_item) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${sub_entity_id} in the database.`,
      });
    }

    const index = menu_item.sub_items.indexOf(sub_menu_item.id)
    menu_item.sub_items.splice(index, sub_menu_item.id)

    return this.menuItemRepository.save(menu_item);
  }
}
