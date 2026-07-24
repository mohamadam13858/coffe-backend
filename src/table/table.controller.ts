import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateTableDto } from './dto/create-table.dto';
import { Roles } from 'src/auth/roles.decorator';
import { TableService } from './table.service';
import { Table } from './entities/table.entity';

@Controller('table')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TableController {
    constructor(private tableService: TableService) { }


    @Post()
    @Roles('admin')
    createTable(@Body() createTableDto: CreateTableDto): Promise<Table> {
        return this.tableService.CreateTable(createTableDto)
    }


    @Get()
    findAllTable() {
        return this.tableService.findAllTable()
    }


    @Get()
    findOndTable(@Param('id') id: string) {
        return this.tableService.findOneTable(id)
    }
}
