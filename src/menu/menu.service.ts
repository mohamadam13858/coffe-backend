import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>
    ) {
          
    }
}



