/**
 *Fundraiser Donor
 *attributes : (image,name,message,amount)
 */
export class FundraiserDonor {
	image: string;
	name: string;
	message: string;
	amount: string;

	constructor(
		image: string = '',
		name: string = '',
		message: string = '',
		amount: string = ''
	) {
		this.image = image;
		this.name = name;
		this.message = message;
		this.amount = amount;
	}
}
