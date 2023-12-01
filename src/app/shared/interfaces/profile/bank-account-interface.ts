/**
 * TITLE: Bank Account Interface
 * DESCRIPTION: Bank Account Interface to be used in profile module as a type for body passed in the put request or type of response data after the get request
 * FIELD: account_holder, account_number, swift_code?
 * AUTHOR: Vivek Patt
 */
export interface BankAccount {
	account_holder?: string;
	account_number?: string;
	swift_code?: any;
}
