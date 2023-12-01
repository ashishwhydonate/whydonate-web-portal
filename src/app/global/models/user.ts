import { JWT } from './jwt';
/** *User Models */
export class User {
	id: string;
	jwt: JWT;
	first_name!: any;
	last_name!: any;
	email: any;
	profile_image!: any;
	is_email_verified: any;
	constructor(
		id: string = '',
		jwt: any,
		first_name?: any,
		last_name?: any,
		email?: any,
		profile_image?: any,
		is_email_verified?: any
	) {
		this.id = id;
		this.jwt = jwt;
		this.email = email;
		this.is_email_verified = is_email_verified;
		if (first_name) {
			this.first_name = first_name;
		}
		if (last_name) {
			this.last_name = last_name;
		}
		if (profile_image) {
			this.profile_image = profile_image;
		}
	}
}
