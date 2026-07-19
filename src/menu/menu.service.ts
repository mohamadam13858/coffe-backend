import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';


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
        const category = await this.categoryRepository.preload({
            id,
            ...updateCategoryDto
        })
        if (!category) {
            throw new NotFoundException()
        }
        return await this.categoryRepository.save(category)
    }




    async deleteCategory(id: string) {
        const category = await this.categoryRepository.findOne({ where: { id } })
        if (!category) {
            throw new NotFoundException()
        }
        const productCount = await this.productRepository.count({
            where: { category: { id } }
        })

        if (productCount > 0) {
            throw new BadRequestException('لطفا قبل از حذف کردن دسته بندی  محصولات این دسته بندی را حذف کنید')
        }

        try {

            await this.categoryRepository.softRemove(category)

        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException()
        }
    }


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


    async createProduct(createProductDto: CreateProductDto) {
        const { name, description, price, discountPrice, categoryId, imageUrl, stock, isAvailable } = createProductDto
        const category = await this.categoryRepository.findOne({ where: { id: categoryId } })

        if (!category) {
            throw new NotFoundException('دسته بندی مورد نظر پیدا نشد')
        }

        const existing = await this.productRepository.findOne({ where: { name, category: { id: categoryId } } })

        if (existing) {
            throw new ConflictException(`محصول ${name} قبلا در این دسته بندی  ثبت شده است `)
        }


        const product = this.productRepository.create({
            name,
            description,
            price,
            discountPrice,
            categoryId,
            imageUrl,
            stock: stock || 0,
            isAvailable: isAvailable ?? true,
        })

        try {

            return await this.productRepository.save(product)

        } catch (error) {
            throw new InternalServerErrorException()
        }


    }

    async updateProduct(id: string, updateProductDto: UpdateProductDto) {
        const existingProduct = await this.productRepository.findOne({
            where: { id }
        })
        if (!existingProduct) {
            throw new NotFoundException(`محصول با شناسه ${id} یافت نشد `)
        }

        if (updateProductDto.categoryId) {
            const existingCategory = await this.categoryRepository.findOne({
                where: { id: updateProductDto.categoryId }
            })
            if (!existingCategory) {
                throw new NotFoundException('دسته بندی مورد نظز یافت نشد')
            }
        }

        const product = await this.productRepository.preload({
            id,
            ...updateProductDto
        })

        if (!product) {
            throw new BadRequestException('خطا در بروزرسانی محصول')
        }


        try {
           return await this.productRepository.save(product)
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async deleteProduct() {

    }



}



