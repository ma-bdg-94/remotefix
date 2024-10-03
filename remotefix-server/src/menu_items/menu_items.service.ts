import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuItem } from './menu_items.entity';
import { LessThan, Raw, Repository } from 'typeorm';
import { subDays } from 'date-fns';
import { BaseService } from 'src/base/base.service';
import { DeletedStatus } from 'src/config/types/types';

@Injectable()
export class MenuItemService extends BaseService<MenuItem> {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {
    super(menuItemRepository);
  }

  async createOne(menuItemData: Partial<MenuItem>): Promise<MenuItem> {
    const { link } = menuItemData;
    const existingMenuItem = await this.menuItemRepository.findOneBy({
      link,
    });

    // conflict check
    if (existingMenuItem && menuItemData.link !== '#') {
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
    order_criterion: keyof MenuItem,
    order_value: 'ASC' | 'DESC',
    deletedStatus: DeletedStatus,
  ): Promise<MenuItem[]> {
    // const validDirections: ('ASC' | 'DESC')[] = ['ASC', 'DESC'];
    // if (!validDirections.includes(order_value)) {
    //   order_value = 'ASC';
    // }

    // const menuItemList = await this.menuItemRepository.find({
    //   where: { is_deleted: false },
    //   order: {
    //     position: direction,
    //   },
    // });

    // if (menuItemList.length < 1) {
    //   throw new NotFoundException({
    //     status: HttpStatus.NOT_FOUND,
    //     message: 'No menu item found in the database!',
    //   });
    // }

    // return menuItemList;
    return super.findAll(order_criterion, order_value, deletedStatus);
  }

  async findAllByScope(
    scope: string,
    sortingDirection: string,
  ): Promise<MenuItem[]> {
    const validDirections: ('ASC' | 'DESC')[] = ['ASC', 'DESC'];
    const direction: 'ASC' | 'DESC' = validDirections.includes(
      sortingDirection.toLocaleUpperCase() as 'ASC' | 'DESC',
    )
      ? (sortingDirection.toLocaleUpperCase() as 'ASC' | 'DESC')
      : 'ASC';

    const menuItemList = await this.menuItemRepository.find({
      where: {
        is_deleted: false,
        scope,
      },
      order: {
        position: direction,
      },
    });

    if (menuItemList.length < 1) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `No menu item found in the database with selected scope: ${scope}`,
      });
    }

    return menuItemList;
  }

  async findAllPrivateByScope(
    scope: string,
    sortingDirection: string,
  ): Promise<MenuItem[]> {
    const validDirections: ('ASC' | 'DESC')[] = ['ASC', 'DESC'];
    const direction: 'ASC' | 'DESC' = validDirections.includes(
      sortingDirection.toLocaleUpperCase() as 'ASC' | 'DESC',
    )
      ? (sortingDirection.toLocaleUpperCase() as 'ASC' | 'DESC')
      : 'ASC';

    const menuItemList = await this.menuItemRepository.find({
      where: [
        {
          is_deleted: false,
          is_private: true,
          scope,
        },
      ],
      order: {
        position: direction,
      },
    });

    if (menuItemList.length < 1) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `No menu item found in the database with selected scope: $t{scope}`,
      });
    }

    console.log(menuItemList);

    return menuItemList;
  }

  async findOneById(id: number): Promise<MenuItem | null> {
    const menuItem = await this.menuItemRepository.findOne({
      where: {
        id,
        is_deleted: false,
      },
    });

    if (!menuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    return menuItem;
  }

  async toggleField(id: number, field: string): Promise<MenuItem | null> {
    const menuItem = await this.menuItemRepository.findOne({
      where: {
        id,
        is_deleted: false,
      },
    });

    if (!menuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    if (menuItem[field] === undefined) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Menu item does not contain field = ${field}.`,
      });
    }

    if (field === 'is_deleted') {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        message: `Field = ${field} is not togglable.`,
      });
    }

    menuItem[field] = !menuItem[field];
    if (field === 'is_archived') {
      menuItem['archived_at'] = new Date();
    }
    return await this.menuItemRepository.save(menuItem);
  }

  async updateField(
    id: number,
    field: string,
    value: any,
  ): Promise<MenuItem | null> {
    const menuItem = await this.menuItemRepository.findOne({
      where: {
        id,
        is_deleted: false,
      },
    });

    if (!menuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    if (!menuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    if (!menuItem[field]) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Menu item does not contain field = ${field}.`,
      });
    }

    menuItem[field] = value;
    return await this.menuItemRepository.save(menuItem);
  }

  async updateMultipleFields(
    id: number,
    menuItemData: Partial<MenuItem>,
  ): Promise<MenuItem | null> {
    const menuItem = await this.menuItemRepository.findOne({
      where: {
        id,
        is_deleted: false,
      },
    });

    if (!menuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    // if (menuItemData.link && !this.linkRegex.test(menuItemData.link)) {
    //   throw new UnprocessableEntityException({
    //     status: HttpStatus.UNPROCESSABLE_ENTITY,
    //     message: `Could not create new menu item, ${menuItemData.link} seems not a valid link.`,
    //   });
    // }

    const updatedMenuItem = this.menuItemRepository.merge(
      menuItem,
      menuItemData,
    );
    return await this.menuItemRepository.save(updatedMenuItem);
  }

  async softDelete(id: number): Promise<MenuItem | null> {
    const menuItem = await this.menuItemRepository.findOne({
      where: {
        id,
        is_deleted: false,
      },
    });

    if (!menuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    menuItem['is_deleted'] = true;
    return await this.menuItemRepository.save(menuItem);
  }

  async remove(id: number): Promise<void> {
    const date_60_days_ago: Date = subDays(new Date(), 60);
    const menuItem = await this.menuItemRepository.findOne({
      where: {
        id,
        is_deleted: true,
        deleted_at: LessThan(date_60_days_ago),
      },
    });

    if (!menuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    await this.menuItemRepository.delete(id);
  }

  async addSubEntity(id: number, subEntityId: number): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findOne({
      where: {
        id,
        is_deleted: false,
      },
    });

    if (!menuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    const subMenuItem = await this.menuItemRepository.findOneBy({
      id: subEntityId,
      scope: Raw((alias) => `:scope = ANY(${alias})`, { scope: 'sub_item' }),
      is_deleted: false,
    });

    if (!subMenuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${subEntityId} in the database.`,
      });
    }

    menuItem['sub_items'].push(subMenuItem.id);
    subMenuItem['position'] = menuItem['sub_items'].length + 1;
    return await this.menuItemRepository.save(menuItem);
  }

  async removeSubEntity(id: number, subEntityId: number): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findOne({
      where: {
        id,
        is_deleted: false,
      },
    });

    if (!menuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${id} in the database.`,
      });
    }

    const subMenuItem = await this.menuItemRepository.findOneBy({
      id: subEntityId,
      scope: Raw((alias) => `:scope = ANY(${alias})`, { scope: 'sub_item' }),
      is_deleted: false,
    });

    if (!subMenuItem) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a menu item with id = ${subEntityId} in the database.`,
      });
    }

    const subItemIndex = menuItem['sub_items'].indexOf(subMenuItem.id);
    menuItem['sub_items'].splice(subItemIndex, 1);
    return await this.menuItemRepository.save(menuItem);
  }
}
