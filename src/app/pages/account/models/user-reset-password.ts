/**
 *User Reset Password interface
 *attributes : (password,currentPassword)
 */
export class UserResetPassword {
	password: string;
	currentPassword?: string;
	email: string;
	token?: string;
	constructor(
		currentPassword: string,
		password: string,
		email: string,
		token: string
	) {
		this.password = password;
		this.currentPassword = currentPassword;
		this.email = email;
		this.token = token;
	}
}
