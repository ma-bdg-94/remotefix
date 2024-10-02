import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Industries } from './industries.entity';
import { LessThan, Repository } from 'typeorm';
import { subDays } from 'date-fns';

@Injectable()
export class IndustriesService {
  constructor(
    @InjectRepository(Industries)
    private industriesRepository: Repository<Industries>,
  ) {}

  async insertOne(industryData: Partial<Industries>): Promise<Industries> {
    const newIndustry = this.industriesRepository.create(industryData);
    return await this.industriesRepository.save(newIndustry);
  }

  async findAll(): Promise<Industries[]> {
    const industryList = await this.industriesRepository.find({
      where: { deleted: false },
      order: {
        created_at: 'ASC',
      },
    });

    if (industryList.length < 1) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'No industry found in the database!',
      });
    }

    return industryList;
  }

  async findOneById(id: number): Promise<Industries | null> {
    const industry = await this.industriesRepository.findOneBy({ id });

    if (!industry) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find an industry with id = ${id} in the database.`,
      });
    }

    return industry;
  }

  async toggleArchive(id: number): Promise<Industries | null> {
    const industry = await this.industriesRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (industry) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a industry with id = ${id} in the database.`,
      });
    }

    industry['archived'] = !industry['archived'];
    return await this.industriesRepository.save(industry);
  }

  async softDelete(id: number): Promise<Industries | null> {
    const industry = await this.industriesRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    if (industry) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a industry with id = ${id} in the database.`,
      });
    }

    industry['deleted'] = true;
    return await this.industriesRepository.save(industry);
  }

  async remove(id: number): Promise<void> {
    const date_60_days_ago: Date = subDays(new Date(), 60);
    const industry = await this.industriesRepository.findOne({
      where: {
        id,
        deleted: true,
        deleted_at: LessThan(date_60_days_ago),
      },
    });

    if (industry) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: `Could not find a industry with id = ${id} in the database.`,
      });
    }

    await this.industriesRepository.delete(id);
  }
}
