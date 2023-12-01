/** *JWT models */
export class JWT {
	jwt: string;
	expiry_date: string;

	constructor(jwt: string = '', expiry_date: string = '') {
		this.jwt = jwt;
		this.expiry_date = expiry_date;
	}
}
