import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Table } from './entities/table.entity';
import { Repository } from 'typeorm';
import { CreateTableDto } from './dto/create-table.dto';
import { TableStatus } from './table-status.enum';

@Injectable()
export class TableService {
    constructor(
        @InjectRepository(Table)
        private tableRepository: Repository<Table>
    ) { }


    async CreateTable(createTableDto: CreateTableDto) {
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
}
