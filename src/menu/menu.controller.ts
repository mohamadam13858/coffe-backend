import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { FileInterceptor } from '@nestjs/platform-express';

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
    getAllCategory(): Promise<Category[]> {
        return this.menuService.getAllCategory()
    }


    @Patch('categories/:id')
    @Roles('admin')
    updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        return this.menuService.updateCategory(id, updateCategoryDto)
    }


    @Delete('categories/:id')
    @Roles('admin')
    deleteCategory(@Param('id') id: string): Promise<void> {
        return this.menuService.deleteCategory(id)
    }

    @Get('products')
    getAllProducts(@Query() filterDto: GetProductsFilterDto): Promise<Product[]> {
        return this.menuService.getProducts(filterDto)
    }

    @Post('product')
    @UseInterceptors(FileInterceptor('image'))
    @Roles('admin')
    createProduct(@Body() createProductDto: CreateProductDto, @UploadedFile() image: Express.Multer.File): Promise<Product> {
        return this.menuService.createProduct(createProductDto , image)
    }

    @Patch('product/:id')
    @Roles('admin')
    updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
        return this.menuService.updateProduct(id, updateProductDto)
    }


    @Delete('product/:id')
    @Roles('admin')
    deleteProduct(@Param('id') id: string): Promise<void> {
        return this.menuService.deleteProduct(id)
    }

}
