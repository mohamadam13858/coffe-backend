import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateTableDto } from './dto/create-table.dto';
import { Roles } from 'src/auth/roles.decorator';
import { TableService } from './table.service';

@Controller('table')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TableController {
    constructor(private tableService: TableService) { }


    @Post('table')
    @Roles('admin')
    createTable(@Body() createTableDto: CreateTableDto) {
        return this.tableService.CreateTable(createTableDto)
    }
}
