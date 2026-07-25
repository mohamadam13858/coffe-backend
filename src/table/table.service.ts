import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Table } from './entities/table.entity';
import { Repository } from 'typeorm';
import { CreateTableDto } from './dto/create-table.dto';
import { TableStatus } from './table-status.enum';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TableService {
    constructor(
        @InjectRepository(Table)
        private tableRepository: Repository<Table>
    ) { }


    async CreateTable(createTableDto: CreateTableDto): Promise<Table> {
        const { number } = createTableDto

        const existing = await this.tableRepository.findOne({ where: { number } })

        if (existing) {
            throw new ConflictException('میز با این شماره وجود دارد')
        }

        const table = this.tableRepository.create({
            ...createTableDto,
            status: createTableDto.status || TableStatus.AVAILABLE
        })

        try {
            return await this.tableRepository.save(table)

        } catch (error) {
            throw new InternalServerErrorException()
        }
    }


    async findAllTable() {
        try {
            return await this.tableRepository.find({
                order: { number: 'ASC' },
                where: { isActive: true }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }



    async findOneTable(id: string) {
        const table = await this.tableRepository.findOne({ where: { id } })
        if (!table) {
            throw new NotFoundException('میز پیدا نشد متاسفانه ')
        }

        return table
    }


    async updateTable(id: string, updateTableDto: UpdateTableDto) {
        const table = await this.tableRepository.findOne({ where: { id } })
        if (!table) {
            throw new NotFoundException('میز پیدا نشذ')
        }
        if (updateTableDto.number && updateTableDto.number !== table.number) {
            const existing = await this.tableRepository.findOne({
                where: { number: updateTableDto.number }
            })
            if (existing) {
                throw new ConflictException('میز با این شماره وجود دارد')
            }
        }

        const updatedTable = await this.tableRepository.preload({
            id,
            ...updateTableDto
        })

        if (!updatedTable) {
            throw new BadRequestException('خطا در بروزرسانی میز');
        }

        try {
            return await this.tableRepository.save(updatedTable)

        } catch (error) {
            throw new InternalServerErrorException()
        }

    }
}
