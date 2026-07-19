import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { Product } from './entities/product.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Category } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('menu')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MenuController {
    constructor(private menuService: MenuService) { }

    @Post('categories')
    @Roles('admin')
    createCategory(@Body() createCategory: CreateCategoryDto): Promise<Category> {
        return this.menuService.createCategory(createCategory)
    }

    @Get('categories')
    getAllCategory() {
        return this.menuService.getAllCategory()
    }


    @Patch('categories/:id')
    @Roles('admin')
    updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.menuService.updateCategory(id, updateCategoryDto)
    }


    @Delete('categories/:id')
    @Roles('admin')
    deleteCategory(@Param('id') id: string) {
        return this.menuService.deleteCategory(id)
    }

    @Get('products')
    getAllProducts(@Query() filterDto: GetProductsFilterDto): Promise<Product[]> {
        return this.menuService.getProducts(filterDto)
    }

    @Post('product')
    @Roles('admin')
    createProduct(@Body() createProductDto: CreateProductDto) {
        return this.menuService.createProduct(createProductDto)
    }

    @Patch('product/:id')
    @Roles('admin')
    updateProduct(@Param() id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.menuService.updateProduct(id, updateProductDto)
    }

}
