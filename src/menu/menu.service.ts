import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';


@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) { }

    async createCategory(createCategoryDto: CreateCategoryDto) {
        const { name, description, imageUrl, orderIndex } = createCategoryDto

        const existingCategory = await this.categoryRepository.findOne({ where: { name } })
        if (existingCategory) {
            throw new ConflictException(`دسته بندی با نام ${name} وجود دارد لطفا نام دیگری انتخاب کنید`)
        }

        const category = this.categoryRepository.create({
            name,
            description,
            imageUrl,
            orderIndex: orderIndex || 0,
            isActive: true
        })

        try {
            return await this.categoryRepository.save(category)

        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException()
        }


    }


    async getAllCategory() {

    }

    async updateCategory() {

    }

    async deleteCategory() { }


    async getProducts(filterDto: GetProductsFilterDto): Promise<Product[]> {
        const { search, categoryId } = filterDto
        const query = this.productRepository.createQueryBuilder('product').leftJoinAndSelect('product.category', 'category')


        if (categoryId) {
            query.andWhere('product.categoryId = :categoryId', { categoryId })
        }

        if (search) {
            query.andWhere(
                `(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))`,
                { search: `%${search}%` }
            )
        }

        try {
            const products = await query.getMany()
            return products
        } catch (error) {
            throw new InternalServerErrorException()
        }

    }


    async createProduct() {

    }

    async updateProduct() {

    }

    async deleteProduct() {

    }



}



