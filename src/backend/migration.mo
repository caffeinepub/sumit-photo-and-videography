import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";

module {
  type OldPhoto = {
    id : Text;
    name : Text;
    description : Text;
    blob : Storage.ExternalBlob;
    uploadTime : Time.Time;
    likeCount : Nat;
    category : Text;
  };

  type OldVideo = {
    id : Text;
    name : Text;
    description : Text;
    blob : Storage.ExternalBlob;
    uploadTime : Time.Time;
  };

  type OldEvent = {
    id : Nat;
    name : Text;
    description : Text;
    date : Time.Time;
    images : Map.Map<Text, OldEventImage>;
    password : ?Text;
  };

  type OldEventImage = {
    id : Text;
    name : Text;
    description : Text;
    blob : Storage.ExternalBlob;
    uploadTime : Time.Time;
    category : Text;
  };

  type OldSpecialMoment = {
    id : Nat;
    name : Text;
    date : Time.Time;
    images : Map.Map<Text, OldSpecialMomentImage>;
  };

  type OldSpecialMomentImage = {
    id : Text;
    name : Text;
    blob : Storage.ExternalBlob;
    uploadTime : Time.Time;
  };

  type OldFooterContent = {
    contactDetails : Text;
    facebook : Text;
    instagram : Text;
    youtube : Text;
  };

  type OldUserProfile = {
    name : Text;
    email : Text;
    address : Text;
    phone : Text;
  };

  type OldVisitor = {
    principal : Principal;
    timestamp : Time.Time;
  };

  type OldOrder = {
    id : Nat;
    orderDate : Time.Time;
    fulfillDate : Time.Time;
    customerName : Text;
    numberOfDvd : Nat;
    numberOfPrints : Nat;
    status : {
      #Pending;
      #Fulfilled;
      #Cancelled;
    };
    payment : {
      total : Nat;
      advance : Nat;
      remainingDue : Nat;
    };
    items : [{
      itemName : Text;
      quantity : Nat;
      unitPrice : Nat;
    }];
  };

  type OldShortlistEntry = {
    imageId : Text;
    timestamp : Time.Time;
  };

  type OldUserShortlist = {
    entries : Map.Map<Text, OldShortlistEntry>;
  };

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    photos : Map.Map<Text, OldPhoto>;
    videos : Map.Map<Text, OldVideo>;
    events : Map.Map<Nat, OldEvent>;
    specialMoments : Map.Map<Nat, OldSpecialMoment>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    visitors : Map.Map<Time.Time, OldVisitor>;
    orders : Map.Map<Nat, OldOrder>;
    footerContent : OldFooterContent;
    nextEventId : Nat;
    nextSpecialMomentId : Nat;
    nextOrderId : Nat;
    eventShortlists : Map.Map<Nat, Map.Map<Principal, OldUserShortlist>>;
    validatedEventAccess : Map.Map<Principal, Map.Map<Nat, Time.Time>>;
  };

  // New actor types (same as old, just for clarity)
  type NewPhoto = OldPhoto;
  type NewVideo = OldVideo;
  type NewEvent = OldEvent;
  type NewEventImage = OldEventImage;
  type NewSpecialMoment = OldSpecialMoment;
  type NewSpecialMomentImage = OldSpecialMomentImage;
  type NewFooterContent = OldFooterContent;
  type NewUserProfile = OldUserProfile;
  type NewVisitor = OldVisitor;
  type NewOrder = OldOrder;

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    photos : Map.Map<Text, NewPhoto>;
    videos : Map.Map<Text, NewVideo>;
    events : Map.Map<Nat, NewEvent>;
    specialMoments : Map.Map<Nat, NewSpecialMoment>;
    userProfiles : Map.Map<Principal, NewUserProfile>;
    visitors : Map.Map<Time.Time, NewVisitor>;
    orders : Map.Map<Nat, NewOrder>;
    footerContent : NewFooterContent;
    nextEventId : Nat;
    nextSpecialMomentId : Nat;
    nextOrderId : Nat;
    eventShortlists : Map.Map<Nat, Map.Map<Principal, [Text]>>;
  };

  public func run(old : OldActor) : NewActor {
    {
      accessControlState = old.accessControlState;
      photos = old.photos;
      videos = old.videos;
      events = old.events;
      specialMoments = old.specialMoments;
      userProfiles = old.userProfiles;
      visitors = old.visitors;
      orders = old.orders;
      footerContent = old.footerContent;
      nextEventId = old.nextEventId;
      nextSpecialMomentId = old.nextSpecialMomentId;
      nextOrderId = old.nextOrderId;
      eventShortlists = convertEventShortlists(old.eventShortlists);
    };
  };

  // Helper function to convert eventShortlists
  func convertEventShortlists(oldEventShortlists : Map.Map<Nat, Map.Map<Principal, OldUserShortlist>>) : Map.Map<Nat, Map.Map<Principal, [Text]>> {
    oldEventShortlists.map<Nat, Map.Map<Principal, OldUserShortlist>, Map.Map<Principal, [Text]>>(
      func(_eventId, userShortlists) {
        userShortlists.map<Principal, OldUserShortlist, [Text]>(
          func(_principal, userShortlist) {
            convertUserShortlist(userShortlist);
          }
        );
      }
    );
  };

  // Helper function to convert UserShortlist to [Text]
  func convertUserShortlist(oldUserShortlist : OldUserShortlist) : [Text] {
    oldUserShortlist.entries.keys().toArray();
  };
};
