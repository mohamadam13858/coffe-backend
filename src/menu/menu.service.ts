import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';


@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) { }

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
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


    async getAllCategory(): Promise<Category[]> {
        try {
            return await this.categoryRepository.find({
                where: { isActive: true },
                order: {
                    orderIndex: 'ASC',
                    createdAt: 'ASC'
                }
            })
        } catch (error) {
            throw new InternalServerErrorException
        }
    }




    async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
        const category = await this.categoryRepository.findOne({ where: { id } })

        if (!category) {
            throw new NotFoundException()
        }

        const allowedUpdates = {
            name: updateCategoryDto.name,
            description: updateCategoryDto.description,
            imageUrl: updateCategoryDto.imageUrl,
            orderIndex: updateCategoryDto.orderIndex,
            isActive: updateCategoryDto.isActive
        }

        const cleanUpdates = Object.fromEntries(
            Object.entries(allowedUpdates).filter(([_, value]) => value !== undefined)
        )

        if (Object.keys(cleanUpdates).length === 0) {
            throw new BadRequestException('هیچ فیلدی برای بروزرسانی ارسال نشده است')
        }
        Object.assign(category, cleanUpdates)

        try {
            return await this.categoryRepository.save(category)
            
        } catch (error) {
            throw new InternalServerErrorException()
        }
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



