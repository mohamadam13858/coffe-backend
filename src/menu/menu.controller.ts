import { Controller, Get, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { Product } from './entities/product.entity';

@Controller('menu')
export class MenuController {
    constructor(private menuService: MenuService) { }

    @Get('products')
    getAllProducts(@Query() filterDto: GetProductsFilterDto): Promise<Product[]> {
        return this.menuService.getProducts(filterDto)
    }

}
