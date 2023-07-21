import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Render, Req, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { CreatePaymentDto, TossPaymentDto } from './payment.dto';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

@Controller('payment')
export class PaymentController {
	constructor(
		private readonly paymentService: PaymentService,
		private readonly userService: UserService,
		private readonly productService: ProductService,
	) {}

	// @Get('/toss')
	// @Render('index')
	// foo() {
	// 	return {
	// 		title: '거누의 결제연동페이지',
	// 		paymentMethod: '카드',
	// 		orderId: 'tosspayments-202303210239', // Todo. 이 아이디는 어떻게 생성해야 하는지 모르겠다.
	// 		orderName: 'toss t-shirt',
	// 		price: 600,
	// 		customerName: '김토스',
	// 		customerEmail: 'toss@toss-payments.co.kr',
	// 	}
	// }

	@Get('toss')
	@Render('index')
	async foo(
		//@Query(new ValidationPipe({ transform: true })) tossPaymentDto: TossPaymentDto,
		@Query() tossPaymentDto: TossPaymentDto
	) {
		console.log('tossPayment:', tossPaymentDto);
		// 여기서 주문 번호를 생성합니다.
		this.paymentService.setCurrentPayment(tossPaymentDto);
		return tossPaymentDto;
	}

	// dynamic rendering을 사용해야 한다.
	@Get('success')
	@Render('success')
	async successPage(@Query() query) {
		const { paymentType, orderId, orderPk, paymentKey, amount } = query;

		// 결제처리 로직 =================================

		// 1. 임시저장했던 데이터와 비교 검증(클라이언트측 데이터 조작 방지)
		const temp = await this.paymentService.getPaymentById(orderPk);

		// console.log('temp:', temp);
		// console.log('query:', query);

		// if (temp.id !== orderId || temp.totalAmount !== amount)
    //   return 'fail';

		// 2. 결제승인 요청 데이터 만들기
		const data = {
      paymentKey,
      orderId,
      amount: amount,
    };

		// 3. 결제승인 API 요청 날리기
		const base64Encoded = Buffer.from(process.env.secretKey).toString('base64');
		console.log(base64Encoded);
		const headers = {
      'Authorization': `Basic ${base64Encoded}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': uuidv4(), // Using UUID v4 to generate a unique Idempotency-Key
    };

		// 4. 승인성공시 DB에 주문정보 저장하기
		try {
      const response = await axios.post('https://api.tosspayments.com/v1/payments/confirm', data, { headers: headers });
			console.log('res.data:', response.data);

			// 주문정보를 결제완료상태로 업데이트한다.
			await this.paymentService.updatePayment(orderPk, 1);
    } catch (error) {
      console.error(error);
      return 'fail';
    }

		// 결제처리 로직 =================================

		return {
			title: '거누의 결제테스트 성공 💪😎',
			paymentType, orderId, paymentKey, amount
		};
	}

	@Get('fail')
	@Render('fail')
	failPage(@Query() query) {
		const { message, code } = query;

		return { message, code };
	}


	@Post()
	create(@Body() createPaymentDto: CreatePaymentDto) {
		return this.paymentService.createPayment(createPaymentDto);
	}

	@Get(':id')
	async getPaymentHandler(
		@Param('id') PaymentId: number,
		@Req() req: Request
	) {
		const Payment = await this.paymentService.getPaymentById(PaymentId);
		console.log('looking Payment:', Payment);
		return 'getPaymentHandler';
	}

	// 수정
	@Patch(':id')
	updatePaymentHandler(
		@Param('id') PaymentId: number,
		@Req() req: Request
	) {
		console.log(`updating Payment:[${PaymentId}]`);
		return 'updatePaymentHandler';
	}

	@Delete(':id')
	async deletePaymentHandler(
		@Param('id') PaymentId: number,
		@Req() req: Request
	) {
		console.log(`deleting Payment:[${PaymentId}]`);
		const ret = await this.paymentService.deletePayment(PaymentId);
		console.log('delete result:', ret);
		return 'deletePaymentHandler';
	}
}
