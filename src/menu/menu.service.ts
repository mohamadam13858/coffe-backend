import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        private dataSource: DataSource
    ) { }

    async createCategory(createCategoryDto: CreateCategoryDto, image?: Express.Multer.File): Promise<Category> {
        const { name, description, orderIndex } = createCategoryDto

        const existingCategory = await this.categoryRepository.findOne({ where: { name } })
        if (existingCategory) {
            throw new ConflictException(`دسته بندی با نام ${name} وجود دارد لطفا نام دیگری انتخاب کنید`)
        }


        let imageUrl: string | undefined

        if (image) {
            const uploadDir = './uploads/categories';

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileName = `${Date.now()}-${image.originalname.replace(/\s+/g, '-')}`;
            const filePath = path.join(uploadDir, fileName);

            fs.writeFileSync(filePath, image.buffer);
            imageUrl = `/uploads/categories/${fileName}`;
        }


        const category = this.categoryRepository.create({
            name,
            description,
            imageUrl,
            orderIndex: orderIndex || 0,
            isActive: true
        } as DeepPartial<Category>)

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




    async updateCategory(
        id: string,
        updateCategoryDto: UpdateCategoryDto,
        image?: Express.Multer.File
    ): Promise<Category> {
        let newImagePath: string | undefined;

        return await this.dataSource.transaction(async (manager) => {
            const existing = await manager.findOne(Category, { where: { id } });
            if (!existing) {
                throw new NotFoundException(`دسته‌بندی با شناسه ${id} پیدا نشد`);
            }

            if (updateCategoryDto.name && updateCategoryDto.name !== existing.name) {
                const duplicate = await manager.findOne(Category, {
                    where: { name: updateCategoryDto.name }
                });
                if (duplicate) {
                    throw new ConflictException(`دسته‌بندی با نام "${updateCategoryDto.name}" قبلاً وجود دارد`);
                }
            }

            let imageUrl = existing.imageUrl;

            if (image) {
                const uploadDir = path.join(process.cwd(), 'uploads', 'categories');
                await fs.promises.mkdir(uploadDir, { recursive: true });

                if (existing.imageUrl) {
                    const oldPath = path.join(process.cwd(), existing.imageUrl);
                    try {
                        await fs.promises.unlink(oldPath);
                    } catch (err) {
                        console.log(err)
                        // this.logger.warn(`Failed to delete old image: ${oldPath}`);
                    }
                }

                const ext = path.extname(image.originalname);
                const fileName = `${Date.now()}-${uuidv4()}${ext}`;
                newImagePath = path.join(uploadDir, fileName);

                await fs.promises.writeFile(newImagePath, image.buffer);
                imageUrl = `/uploads/categories/${fileName}`;
            }

            const category = await manager.save(Category, {
                id,
                ...updateCategoryDto,
                imageUrl
            });

            return category;
        });
    }



    async deleteCategory(id: string): Promise<void> {
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
        const query = this.productRepository.createQueryBuilder('product')


        if (categoryId) {
            query.andWhere('product.categoryId = :categoryId', { categoryId })
        }

        if (search) {
            query.andWhere(
                `(LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search))`,
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




    async createProduct(createProductDto: CreateProductDto, image?: Express.Multer.File): Promise<Product> {
        const { name, description, price, discountPrice, categoryId, stock, isAvailable } = createProductDto;

        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) {
            throw new NotFoundException('دسته‌بندی مورد نظر پیدا نشد');
        }

        const existing = await this.productRepository.findOne({
            where: { name, category: { id: categoryId } }
        });
        if (existing) {
            throw new ConflictException(`محصول "${name}" قبلاً در این دسته‌بندی ثبت شده است`);
        }

        let imageUrl: string | undefined = undefined;


        if (image) {
            const uploadDir = './uploads/products';

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileName = `${Date.now()}-${image.originalname}`;
            const filePath = path.join(uploadDir, fileName);

            fs.writeFileSync(filePath, image.buffer);

            imageUrl = `/uploads/products/${fileName}`;
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
            orderCount: 0,
        } as DeepPartial<Product>);

        return await this.productRepository.save(product);
    }




    async updateProduct(id: string, updateProductDto: UpdateProductDto, image: Express.Multer.File): Promise<Product> {
        const existingProduct = await this.productRepository.findOne({ where: { id } })
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

        let imageUrl = existingProduct.imageUrl

        if (image) {
            const uploadDir = './uploads/products'

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true })
            }

            if (existingProduct.imageUrl) {
                const oldImagePath = path.join('.', existingProduct.imageUrl)
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath)
                }
            }
            const fileName = `${Date.now()}-${image.originalname.replace(/\s+/g, '-')}`
            const filePath = path.join(uploadDir, fileName)

            fs.writeFileSync(filePath, image.buffer)
            imageUrl = `/uploads/products/${fileName}`
        }

        const product = await this.productRepository.preload({
            id,
            ...updateProductDto,
            imageUrl
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



    async deleteProduct(id: string): Promise<void> {
        const product = await this.productRepository.findOne({ where: { id } })

        if (!product) {
            throw new NotFoundException('محصول مورد نظر پیدا نشد')
        }

        try {
            await this.productRepository.softRemove(product)
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }



}



