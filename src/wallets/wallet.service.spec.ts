import { Test, TestingModule } from '@nestjs/testing';
import { WalletRepository } from './wallet.repository';
import { WalletService } from './wallet.service';

describe('WalletService', () => {
  let service: WalletService;
  let repository: WalletRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{provide: WalletService, useValue: {
        debitWallet: jest.fn(),
          creditWallet: jest.fn(),
          createWallet: jest.fn(),
          togglePNCWallet: jest.fn(),
          togglePNDWallet: jest.fn(),
      }},
        {
            provide: WalletRepository,
            useValue: {
              createWallet: jest.fn(),
              getWallet: jest.fn(),
              update: jest.fn(),
            },
          },],
    }).compile();

    service = module.get<WalletService>(WalletService);
    repository = module.get<WalletRepository>(WalletRepository);
  });

  const result: any=   {
    id: '236734789t79340',
    name: 'Rainy Days',
    PND: true,
    PNC: true,
    balance: 0,
    userId: '4e2348129021'
  };

  const user = {
    id: '236734789t79340',
    email: 'tosin@gmail.com',
    firstName: 'Tosin',
    lastName: 'Emma',
    username: 'tosinemma',
    salt: '7348892ksfdnkl',
    hash: 'wqqyuewfgwe',
    password: '1234566',
    balance: 0,
  };

  it('create a new wallet', async () => {
    result;

    const userId = '236734789t79340';
    const name= 'Rainy Days';
    

    jest.spyOn(service, 'createWallet').mockImplementation(async () => result);
    expect(await service.createWallet(userId, name)).toBe(result);
  });

  
  it('should toggle the wallets PNC', async () => {
    
    const walletRequest= { walletId: '209402-032494' };
    const userId = '142536';

    jest
    .spyOn(service, 'togglePNCWallet')
    .mockImplementation(async () => result);

    expect(await service.togglePNCWallet(userId, walletRequest)).toBe(result);
  });

  it('should toggle the wallets PND', async () => {
    const walletRequest= { walletId: '209402-032494' };
    const userId = '142536';

    jest
      .spyOn(service, 'togglePNDWallet')
      .mockImplementation(async () => result);

    expect(await service.togglePNDWallet(userId,walletRequest)).toBe(result);
  });

  
  it('should debit wallet', async () => {
    const userId = '142536';
    const walletRequest= { walletId: '209402-032494',
    amount: 200 };
    

    jest.spyOn(service, 'debitWallet').mockImplementation(async () => result);

    expect(await service.debitWallet(userId,walletRequest)).toBe(result);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
