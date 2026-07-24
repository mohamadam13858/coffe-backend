import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
    getAllTable() {
        return this.tableService.getAllTable()
    }
}
