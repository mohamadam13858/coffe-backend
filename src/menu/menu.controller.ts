import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { Product } from './entities/product.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Category } from './entities/category.entity';

@Controller('menu')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MenuController {
    constructor(private menuService: MenuService) { }

    @Post('categories')
    @Roles('admin')
    createCategory(@Body() createCategory:CreateCategoryDto):Promise<Category>{
        return this.menuService.createCategory(createCategory)
    }

    @Get('categories')
    getAllCategory(){
        return this.menuService.getAllCategory()
    }

    @Get('products')
    getAllProducts(@Query() filterDto: GetProductsFilterDto): Promise<Product[]> {
        return this.menuService.getProducts(filterDto)
    }

}
