# DEMO-CREDIT-WALLET

## Description 
This is an MPV wallet service where:

* A user can create an account
* A user can fund their account
* A user can transfer funds to another user’s account
* A user can withdraw funds from their account.

### User Flow Diagram

* User creates profile by adding in their firstname, last Name, username, email and password. After which they would login and use the access key provided for authentication.
* The user is required to create a wallet, assigning whatever name they would like.
* The user can then credit the wallet, debit/withdraw, and transfer funds in between users who have valid wallets in the system
* All user transactions are saved in the transactions database

### Entity Relationship Diagram

* This diagram shows the relationship between the users, wallets and transactions entities in the database

![E-R diagram](https://drive.google.com/file/d/1Ai2pWMCRkFh5LMzPa5-WRiHlbbMi3uRV/view?usp=sharing)


### Development
```
$ yarn install
$ yarn run test
$ yarn run start:dev

```

### Create user account
`POST  api/v1/users/user`

#### Authentication
`POST  api/v1/auth/login`

### Create a wallet
`POST  api/v1/wallet/create-wallet`

### Fund your wallet
`POST api/v1/transactions/fund-account`

### Send money to another user
`POST api/v1/transactions/send-money`

### Withdraw from your account
`POST api/v1/transactions/withdraw-money`



