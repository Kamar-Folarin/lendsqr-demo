import { Test, TestingModule } from '@nestjs/testing';
import { WalletRepository } from '../wallets/wallet.repository';
import { UserRepository } from '../users/users.repository';
import { WalletsController } from './wallet.controller';
import { WalletService } from './wallet.service';

describe('WalletController', () => {
  let controller: WalletsController;
  let service: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletsController],
      providers: [WalletService,
      {
        provide: WalletService,
        useValue: {
          debitWallet: jest.fn(),
          creditWallet: jest.fn(),
          createWallet: jest.fn(),
          togglePNCWallet: jest.fn(),
          togglePNDWallet: jest.fn(),
        },
      },
      {
        provide: WalletRepository,
        useValue: {
          createWallet: jest.fn(),
          getWallet: jest.fn(),
          update: jest.fn(),
        },
      },
      ],
    }).compile();

    controller = module.get<WalletsController>(WalletsController);
    service = module.get<WalletService>(WalletService);
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

  it('allows user to create a wallet', async () => {
    result;

    const walletId = '236734789t79340';
    const createWalletDto = {
        name: 'Rainy Days',
    };

    jest.spyOn(service, 'createWallet').mockImplementation(async () => result);

      expect(
        await controller.createWallet( user, createWalletDto),
      ).toBe(result);
  });

  
  it('allows wallets Post No Credit to be toggled from either true/false', async () => {
    result;

    const walletId = '236734789t79340';
    

    jest.spyOn(service, 'togglePNCWallet').mockImplementation(async () => result);

      expect(
        await controller.freezeUserWalletCredit( user, walletId),
      ).toBe(result);
  });



  it('allows wallets Post No Debit to be toggled from either true/false', async () => {
    result;

    const walletId = '236734789t79340'
    
    jest.spyOn(service, 'togglePNDWallet').mockImplementation(async () => result);

    expect(
      await controller.freezeUserWalletDebit( user, walletId),
    ).toBe(result);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
