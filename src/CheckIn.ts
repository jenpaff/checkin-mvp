import {
  Field,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  isReady,
  CircuitValue,
  prop,
  Bool,
  PrivateKey,
} from 'snarkyjs';
import geohash from 'ngeohash';
import { is_in_valid_range } from './utils';

/**
 * Basic Example
 * See https://docs.minaprotocol.com/zkapps for more info.
 *
 * The Add contract initializes the state variable 'num' to be a Field(1) value by default when deployed.
 * When the 'update' method is called, the Add contract adds Field(2) to its 'num' contract state.
 *
 * This file is safe to delete and replace with your own contract.
 */

await isReady;

export const adminPrivateKey = PrivateKey.random();
export const adminPublicKey = adminPrivateKey.toPublicKey();

export class LocationCheck extends CircuitValue {
  @prop sharedGeoHash: Field;

  constructor(lat: number, long: number) {
    super();
    var geoHash: number = geohash.encode_int(lat, long);
    this.sharedGeoHash = Field.fromNumber(geoHash);
  }
}

export class CheckInApp extends SmartContract {
  @state(Field) geoHash = State<Field>();
  @state(Bool) in = State<Bool>();

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
  }

  @method init() {
    this.geoHash.set(Field.fromNumber(3669811486280996)); // geohash int city center
    this.in.set(new Bool(false));
  }

  @method checkIn(locationCheckInstance: LocationCheck) {
    const currGeoHashes = this.geoHash.get();
    this.geoHash.assertEquals(currGeoHashes); // precondition that links this.num.get() to the actual on-chain state
    const currIn = this.in.get();
    // TODO: do we need to throw an error here?
    this.in.assertEquals(new Bool(false)); // can only check in when I was checked out

    // check if incoming geoHash is equal or nearby
    // TODO: this needs to be a wider range
    let valid = is_in_valid_range(
      currGeoHashes,
      locationCheckInstance.sharedGeoHash
    );
    valid.assertTrue();

    const checkIn = currIn.not();
    checkIn.assertEquals(currIn.not());
    this.in.set(checkIn);
  }
}
