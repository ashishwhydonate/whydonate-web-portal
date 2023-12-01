/** *Balance Data Interface */
export interface ReceivedDonation {
  date: Date;
  userId: number;
  fundraiserName: string;
  status: string;
  amount: number;
  transaction: string;
  donorId: number;
  donorName: string;
  donorEmail: string;
  receiptName: string;
  address: string;
  city: string;
  zipcode: string;
  country: string;
  isAnonymous: boolean;
  donorReply: string;
  type: string
}
