export class CustomDonationConfiguration {
	onetime_select: boolean;
	onetime_first: string;
	onetime_second: string;
	onetime_third: string;
	onetime_forth: string;
	onetime_style: boolean;

	monthly_select: boolean;
	monthly_first: string;
	monthly_second: string;
	monthly_third: string;
	monthly_forth: string;
	monthly_style: boolean;

	yearly_select: boolean;
	yearly_first: string;
	yearly_second: string;
	yearly_third: string;
	yearly_forth: string;
	yearly_style: boolean;

	other_amount: boolean | undefined = true;

	constructor(
		onetime_select: boolean,
		onetime_first: string,
		onetime_second: string,
		onetime_third: string,
		onetime_forth: string,
		onetime_style: boolean,

		monthly_select: boolean,
		monthly_first: string,
		monthly_second: string,
		monthly_third: string,
		monthly_forth: string,
		monthly_style: boolean,

		yearly_select: boolean,
		yearly_first: string,
		yearly_second: string,
		yearly_third: string,
		yearly_forth: string,
		yearly_style: boolean,

		other_amount?: boolean
	) {
		this.onetime_select = onetime_select;
		this.onetime_first = onetime_first;
		this.onetime_second = onetime_second;
		this.onetime_third = onetime_third;
		this.onetime_forth = onetime_forth;
		this.onetime_style = onetime_style;

		this.monthly_select = monthly_select;
		this.monthly_first = monthly_first;
		this.monthly_second = monthly_second;
		this.monthly_third = monthly_third;
		this.monthly_forth = monthly_forth;
		this.monthly_style = monthly_style;

		this.yearly_select = yearly_select;
		this.yearly_first = yearly_first;
		this.yearly_second = yearly_second;
		this.yearly_third = yearly_third;
		this.yearly_forth = yearly_forth;
		this.yearly_style = yearly_style;

		this.other_amount = other_amount;
	}
}
