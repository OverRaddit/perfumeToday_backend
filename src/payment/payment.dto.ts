import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Payment } from "src/typeorm/entities/Payment";

class PaymentDetailDto {
	@IsNotEmpty()
	@IsNumber()
	productId: number;

	@IsNotEmpty()
	@IsNumber()
	quantity: number;
}

export class CreatePaymentDto {
	@IsNotEmpty()
	@IsNumber()
	userId: number;

	@IsNotEmpty()
	@IsNumber()
	totalAmount: number;

	@IsNotEmpty()
	paymentDetails: PaymentDetailDto[];
}

export class TossPaymentDto {
	// DTO
  @IsString()
  title: string;

  @IsString()
  paymentMethod: string;

  @IsString()
  orderId: string;

  @IsString()
  orderName: string;

  @IsNumber()
	@Transform(({ value }) => parseInt(value))
  price: number;

  @IsString()
  customerName: string;

  @IsEmail()
  customerEmail: string;

	// 여기서부터 다름.
	// @Transform(({ value }) => {
	// 	console.log('trans:', value);
	// 	JSON.parse(value)
	// }, { toClassOnly: true })
  payment: CreatePaymentDto;
}

// export class TossPayment {
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// 	@IsString()
//   title: string;
// }

// // dGVzdF9za196WExrS0V5cE5BcldtbzUwblgzbG1lYXhZRzVSOg
// // dGVzdF9za19PRG55UnBRV0dyTjdSTEVQRzJCOEt3djFNOUVOOg==
