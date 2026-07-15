import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>
    ) { }

    async getProducts(filterDto: GetProductsFilterDto): Promise<Product[]> {
        const { search } = filterDto
        const query = this.productRepository.createQueryBuilder('product')

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
}



