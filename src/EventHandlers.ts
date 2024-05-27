import { ERC20Contract, AccountEntity } from "generated";

ERC20Contract.Transfer.loader(({ event, context }) => {
  context.Account.load(event.params.from.toString());
  context.Account.load(event.params.to.toString());
});

ERC20Contract.Transfer.handler(({ event, context }) => {
  let senderAccount = context.Account.get(event.params.from.toString());

  if (senderAccount === undefined || senderAccount === null) {
    // create the account
    // This is likely only ever going to be the zero address in the case of the first mint
    let accountObject: AccountEntity = {
      id: event.params.from.toString(),
      balance: 0n - event.params.value,
    };

    context.Account.set(accountObject);
  } else {
    // subtract the balance from the existing users balance
    let accountObject: AccountEntity = {
      id: senderAccount.id,
      balance: senderAccount.balance - event.params.value,
    };
    context.Account.set(accountObject);
  }

  let receiverAccount = context.Account.get(event.params.to.toString());

  if (receiverAccount === undefined || receiverAccount === null) {
    // create new account
    let accountObject: AccountEntity = {
      id: event.params.to.toString(),
      balance: event.params.value,
    };
    context.Account.set(accountObject);
  } else {
    // update existing account
    let accountObject: AccountEntity = {
      id: receiverAccount.id,
      balance: receiverAccount.balance + event.params.value,
    };

    context.Account.set(accountObject);
  }
});
