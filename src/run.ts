import { LocationCheck, adminPrivateKey, CheckInApp } from './CheckIn';
import { Mina, PrivateKey, AccountUpdate, Field } from 'snarkyjs';

let txn;
// setup local ledger
let Local = Mina.LocalBlockchain();
Mina.setActiveInstance(Local);

// test accounts that pays all the fees, and puts additional funds into the zkapp
const feePayer1 = Local.testAccounts[0].privateKey;

// zkapp account
const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();
const zkAppInstance = new CheckInApp(zkAppAddress);

console.log('Deploying Checkin App ....');

txn = await Mina.transaction(feePayer1, () => {
  AccountUpdate.fundNewAccount(feePayer1);
  zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
});

await txn.send();

const initialState = Mina.getAccount(zkAppAddress).appState?.[0].toString();

let currentState;

console.log('Initial State', initialState);

// attempt to update state with wrong location, should fail
console.log(
  `Attempting to update state from ${initialState} with incorrect location ...`
);

let correctlyFails = false;

try {
  txn = await Mina.transaction(feePayer1, () => {
    zkAppInstance.checkIn(new LocationCheck(47, 15));
    zkAppInstance.sign(zkAppPrivateKey);
  });

  await txn.send();
} catch (err: any) {
  handleError(err, 'assert_equal');
}

if (!correctlyFails) {
  throw Error('We could update the state with wrong location');
}

// update state with value that satisfies preconditions and correct location
console.log(
  `Updating state from ${initialState} to true with correct location...`
);

txn = await Mina.transaction(feePayer1, () => {
  zkAppInstance.checkIn(new LocationCheck(48.208487, 16.372571));
  zkAppInstance.sign(zkAppPrivateKey);
});

await txn.send();

currentState = Mina.getAccount(zkAppAddress).appState?.[0].toString();

if (currentState !== 'true') {
  throw Error(
    `Current state of ${currentState} does not match true after checking in`
  );
}

console.log(`Current state succesfully updated to ${currentState}`);

/**
 * Test for expected failure case. Original error thrown if not expected failure case.
 * @param {any} error  The error thrown in the catch block.
 * @param {string} errorMessage  The expected error message.
 */

function handleError(error: any, errorMessage: string) {
  currentState = Mina.getAccount(zkAppAddress).appState?.[0].toString();

  if (error.message.includes(errorMessage)) {
    correctlyFails = true;
    console.log(
      `Update correctly rejected with failing precondition. Current state is still ${currentState}.`
    );
  } else {
    throw Error(error);
  }
}
