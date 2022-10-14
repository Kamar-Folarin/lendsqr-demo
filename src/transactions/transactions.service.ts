import { Injectable, NotFoundException } from '@nestjs/common';
import { WalletService } from '../wallets/wallet.service';
import { UsersService } from '../users/users.service';
import { CreateTransactionsDto } from './dto/create-transaction.dto';
import { TransferFundsDto } from './dto/transfer.dto';
import { ICreateTransaction, ITransactions } from './interface/transactions.interface';
import { TransactionsRepository } from './transactions.repository';
@Injectable()
export class TransactionsService {
  constructor(
    private userService: UsersService,
    private transactionsRepository: TransactionsRepository,
    private walletService: WalletService,
  ) {}

  async sendMoney(userId: string, dto: TransferFundsDto)  {
    const transactionDto = {
      fromAccount: dto.fromAccount,
      toAccount: dto.toAccount,
      amount: dto.amount,
      title: 'send-money',
      status: 'PENDING',
    };

    const createTransactionState = await this.transactionsRepository.create(transactionDto);
   
    if ( createTransactionState ){
       // Get the user
    const [sender, senderWallet, receiverWallet] = await Promise.all([
      await this.userService.getUserById(userId),
      await this.walletService.getWallet(userId,{walletId: dto.fromAccount}),
      await this.walletService.getWallet(dto.receiverId,{walletId: dto.toAccount})
    ]);

    // Find the amount the sender wants to send
    const senderNewBalance = senderWallet.balance - dto.amount;

    // Check if the sender has enough funds
    if (senderNewBalance < 0) {
      throw new NotFoundException('Insufficient funds');
    }
    if(senderWallet.PND == true){
      throw new Error('PNC Wallet cannot be debited');
    }
    const debitSender =  await this.walletService.debitWallet(userId, {walletId: dto.fromAccount, amount: dto.amount,});

    if (!debitSender) {
      throw new NotFoundException('Cannot send funds');
    }
    if(receiverWallet.PNC == true){
      throw new Error('Receiver PND wallet cannot be credited')
    }
    const creditWallet = this.walletService.creditWallet(dto.receiverId, {walletId: dto.toAccount, amount: dto.amount,});
    if(!creditWallet){
      await this.transactionsRepository.update(createTransactionState.id, { status: 'FAILED' });
      throw new NotFoundException('Maximum retry');
    }
     // Update the transaction status
    this.transactionsRepository.update(createTransactionState.id, { status: 'SUCCESS' });
    }
  }


  async fundAccount(userId: string,account:string, amount: number)  {
    const transactionDto = {
      fromAccount: userId,
      toAccount: userId,
      amount: amount,
      title: 'fund your account',
      status: 'PENDING',
    };

    const createTransactionState = await this.transactionsRepository.create(transactionDto);
    if(!createTransactionState){
      throw new NotFoundException('Failed');
    }
    const wallet = await this.walletService.getWallet(userId,{walletId: account});
    if(wallet.PNC == true){
      throw new Error('PNC wallet cannot be credited');
    }
    const creditWallet = this.walletService.creditWallet(userId, {walletId: account, amount: amount});
    if(!creditWallet){
      await this.transactionsRepository.update(createTransactionState.id, { status: 'FAILED' });
      throw new NotFoundException('Failed to credit');
    }
    await this.transactionsRepository.update(createTransactionState.id, { status: 'SUCCESS' });
  
  }

  async withdrawFromAccount(userId: string,fromAccount: string, amount: number) {
    const transactionDto = {
      fromAccount: fromAccount,
      toAccount: null,
      amount: amount,
      title: 'Withdraw from account',
      status: 'PENDING',
    };

    const transactionState = await this.transactionsRepository.create(transactionDto);
    if (!transactionState) {
      throw new NotFoundException('Failed');
    }

    const wallet = await this.walletService.getWallet(userId,{walletId: fromAccount});
    if(wallet.PND == true){
      throw new Error('PND wallet cannot be debited');
    }

    const debitWallet = await this.walletService.debitWallet(userId, {walletId: fromAccount, amount: amount});

    if (!debitWallet) {
      await this.transactionsRepository.update(transactionState.id, { status: 'FAILED' });
      throw new NotFoundException('Failed to debit');
    }

    await this.transactionsRepository.update(transactionState.id, { status: 'SUCCESS' });
    
  }
}
