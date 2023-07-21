import { Inject, Injectable } from '@nestjs/common';
import { Product } from 'src/typeorm/entities/Product';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
	constructor(
		@Inject('PRODUCT_REPOSITORY') private productRepository: Repository<Product>
	) {}

	async createProduct(
		name: string,
		price: number,
		image: string,
		description: string
	): Promise<Product> {
		const product = this.productRepository.create();
		product.name = name;
		product.price = price;
		product.image = image;
		product.description = description;
		return this.productRepository.save(product);
	}

	async getProductById(
		id: number
	): Promise<Product> {
		const product = await this.productRepository.findOne({ where: { id } });
		return product;
	}

	async updateProduct() {

	}

	async deleteProduct(productId: number) {
		return this.productRepository.delete(productId);
	}
}
