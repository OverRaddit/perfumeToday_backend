import { Inject, Injectable } from '@nestjs/common';
import { Payment } from 'src/typeorm/entities/Payment';
import { Repository } from 'typeorm';
import { CreatePaymentDto, TossPaymentDto } from './payment.dto';
import { PaymentDetail } from 'src/typeorm/entities/PaymentDetail';

@Injectable()
export class PaymentService {
	private currentPayment: TossPaymentDto;
	private payment: Payment;
	constructor(
		@Inject('PAYMENT_REPOSITORY') private paymentRepository: Repository<Payment>,
		@Inject('PAYMENTDETAIL_REPOSITORY') private paymentDetailRepository: Repository<PaymentDetail>,
	) {}

	setCurrentPayment(payment: TossPaymentDto) {
		this.currentPayment = payment;
	}

	getCurrentPayment(): TossPaymentDto {
		return this.currentPayment;
	}

	setPayment(payment: Payment) {
		this.payment = payment;
	}
	getPayment(): Payment {
		return this.payment;
	}


	// 프론트에서 다음과 같이 요청한다고 가정합시다.
	// paymentMethod, shippingAddress, pricePerUnit는 아직 사용하지 않습니다.
	// {
	// 	"userId": 1,
	// 	"totalAmount": 200,
	// 	"paymentMethod": "Credit Card",
	// 	"shippingAddress": "123 Main St",
	// 	"paymentDetails": [
	// 		{
	// 			"productId": 1,
	// 			"quantity": 1,
	// 			"pricePerUnit": 100
	// 		},
	// 		{
	// 			"productId": 2,
	// 			"quantity": 3,
	// 			"pricePerUnit": 33.33
	// 		}
	// 	]
	// }
	async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
		const payment = this.paymentRepository.create({
			user: { id: createPaymentDto.userId },
			totalAmount: createPaymentDto.totalAmount,
		});
		const savedPayment = await this.paymentRepository.save(payment);

		console.log('createPaymentDto:', createPaymentDto);

		for(let detail of createPaymentDto.paymentDetails) {
			// 어떻게 payment 객체가 아닌 id를 통해 create하는 건지 궁금함.
			const paymentDetail = this.paymentDetailRepository.create({
				payment: { id: savedPayment.id },
				product: { id: detail.productId },
				quantity: detail.quantity,
			});

			// 이렇게 For문 안에서 비동기 처리를 매번 하는게 효율적으로 보이지 않음.
			// Promise.all을 이용할수 있는지 궁금함 -> 트랜잭션 처리가 복잡해진다고 함.
			// 기왕 쓴다면 Promise.allSettled를 사용하라고 함.
			await this.paymentDetailRepository.save(paymentDetail);
		}

		return savedPayment;
	}

	async getPaymentById(
		id: number
	): Promise<Payment> {
		const Payment = await this.paymentRepository.findOne({ where: { id } });
		return Payment;
	}

	// 일단 주문상태만 업데이트 하는 기능만 존재한다.
	async updatePayment(id: number, status: number) {
		const payment = await this.getPaymentById(id);
		return this.paymentRepository.update(payment.id, { status });
	}

	async deletePayment(PaymentId: number) {
		return this.paymentRepository.delete(PaymentId);
	}

	createPaymentNum() {

	}
}
