export interface Transactions {
  id: string;
  amount: number;
  title: string;
  fromAccount: string;
  toAccount: string;
  status: string;
}

export interface ICreateTransaction {
  amount: number;
  title: string;
  fromAccount: string;
  toAccount: string;
}

export interface ITransactions {
  id: string;
  amount: number;
  title: string;
  fromAccount: string;
  toAccount: string;
}

export interface ITransactionUpdateQuery {
  status: string;
}
