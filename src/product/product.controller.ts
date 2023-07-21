import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { Request } from 'express';

@Controller('product')
export class ProductController {

	constructor(
		private readonly productService: ProductService,
	) {}

	@Post()
	async createProductHandler(@Req() req: Request, @Body() body) {
		console.log(`creating product:[??]`);
		console.log(`body:`, body);

		const { name, price, image, description } = body;

		if (!name || !price || !image || !description) {
			return '인자가 부족하다구?';
		}

		const product = await this.productService.createProduct(name, price, image, description);
		console.log(product);

		return 'createProductHandler';
	}

	@Get(':id')
	async getProductHandler(
		@Param('id') productId: number,
		@Req() req: Request
	) {
		const product = await this.productService.getProductById(productId);
		console.log('looking product:', product);
		return 'getProductHandler';
	}

	// 수정
	@Patch(':id')
	updateProductHandler(
		@Param('id') productId: number,
		@Req() req: Request
	) {
		console.log(`updating product:[${productId}]`);
		return 'updateProductHandler';
	}

	@Delete(':id')
	async deleteProductHandler(
		@Param('id') productId: number,
		@Req() req: Request
	) {
		console.log(`deleting product:[${productId}]`);
		const ret = await this.productService.deleteProduct(productId);
		console.log('delete result:', ret);
		return 'deleteProductHandler';
	}
}
