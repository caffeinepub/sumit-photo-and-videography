import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  // Old order type (without status)
  type OldOrder = {
    id : Nat;
    orderDate : Int;
    fulfillDate : Int;
    customerName : Text;
    numberOfDvd : Nat;
    numberOfPrints : Nat;
  };

  // Old actor state type (wet orders)
  type OldActor = {
    orders : Map.Map<Nat, OldOrder>;
  };

  // Order with status (default Pending after migration)
  type NewOrder = {
    id : Nat;
    orderDate : Int;
    fulfillDate : Int;
    customerName : Text;
    numberOfDvd : Nat;
    numberOfPrints : Nat;
    status : { #Pending; #Fulfilled; #Cancelled };
  };

  // New actor state type
  type NewActor = {
    orders : Map.Map<Nat, NewOrder>;
  };

  // Migration function
  public func run(old : OldActor) : NewActor {
    let newOrders = old.orders.map<Nat, OldOrder, NewOrder>(
      func(_id, oldOrder) {
        {
          oldOrder with
          status = #Pending;
        };
      }
    );
    { orders = newOrders };
  };
};
