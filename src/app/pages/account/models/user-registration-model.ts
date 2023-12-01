/**
 *User Registration interface
 *attributes : (first_name,last_name,language_code,email,password,type,contactNumber,name,image)
 */
export class UserRegistration {
	first_name: string;
	last_name: string;
	language_code: string | undefined;
	email: string;
	password: string;
	type: string;
	name: string;
	previous_path: string;
	phone_number: any;
	image: any;
	image_name: any;
	image_type: any;

	constructor(
		first_name: string,
		last_name: string,
		language_code: string | undefined,
		email: string,
		password: string,
		type: string,
		name: string,
		previous_path: string,
		phone_number?: number,
		image?: any,
		image_name?: string,
		image_type?: string
	) {
		this.first_name = first_name;
		this.last_name = last_name;
		this.language_code = language_code;
		this.email = email;
		this.password = password;
		this.type = type;
		if (phone_number) {
			this.phone_number = phone_number;
		}

		this.name = name;
		this.previous_path = previous_path;
		if (image) {
			this.image = image;
			this.image_name = image_name;
			this.image_type = image_type;
		}
	}
}
