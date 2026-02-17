import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Bool "mo:core/Bool";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  type Photo = {
    id : Text;
    name : Text;
    description : Text;
    blob : Storage.ExternalBlob;
    uploadTime : Time.Time;
    likeCount : Nat;
    category : Text;
  };

  module Photo {
    public func compareByUploadTime(a : Photo, b : Photo) : Order.Order {
      Int.compare(a.uploadTime, b.uploadTime);
    };
  };

  type Video = {
    id : Text;
    name : Text;
    description : Text;
    blob : Storage.ExternalBlob;
    uploadTime : Time.Time;
  };

  module Video {
    public func compareByUploadTime(a : Video, b : Video) : Order.Order {
      Int.compare(a.uploadTime, b.uploadTime);
    };
  };

  type Event = {
    id : Nat;
    name : Text;
    description : Text;
    date : Time.Time;
    images : Map.Map<Text, EventImage>;
    password : ?Text;
  };

  module Event {
    public func compareByDate(a : Event, b : Event) : Order.Order {
      Int.compare(a.date, b.date);
    };
  };

  type EventImage = {
    id : Text;
    name : Text;
    description : Text;
    blob : Storage.ExternalBlob;
    uploadTime : Time.Time;
    category : Text;
  };

  module EventImage {
    public func compareByUploadTime(a : EventImage, b : EventImage) : Order.Order {
      Int.compare(a.uploadTime, b.uploadTime);
    };

    public func compareByCategory(a : EventImage, b : EventImage) : Order.Order {
      Text.compare(a.category, b.category);
    };
  };

  type SpecialMoment = {
    id : Nat;
    name : Text;
    date : Time.Time;
    images : Map.Map<Text, SpecialMomentImage>;
  };

  module SpecialMoment {
    public func compareByDate(a : SpecialMoment, b : SpecialMoment) : Order.Order {
      Int.compare(a.date, b.date);
    };
  };

  type SpecialMomentImage = {
    id : Text;
    name : Text;
    blob : Storage.ExternalBlob;
    uploadTime : Time.Time;
  };

  type FooterContent = {
    contactDetails : Text;
    facebook : Text;
    instagram : Text;
    youtube : Text;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    address : Text;
    phone : Text;
  };

  type UploadResult = {
    success : Bool;
    message : Text;
  };

  type PhotoVideoUploadRequest = {
    name : Text;
    description : Text;
    blob : Storage.ExternalBlob;
    category : Text;
  };

  type MultiPhotoUploadRequest = {
    photos : [PhotoVideoUploadRequest];
  };

  type EventCreateRequest = {
    name : Text;
    description : Text;
    date : Time.Time;
    password : ?Text;
  };

  type EventImageUploadRequest = {
    eventId : Nat;
    name : Text;
    description : Text;
    blob : Storage.ExternalBlob;
    category : Text;
  };

  type SpecialMomentCreateRequest = {
    name : Text;
    date : Time.Time;
  };

  type SpecialMomentImageUploadRequest = {
    specialMomentId : Nat;
    name : Text;
    blob : Storage.ExternalBlob;
  };

  type SortedOrder = {
    #newestFirst;
    #oldestFirst;
  };

  public type EventDTO = {
    id : Nat;
    name : Text;
    description : Text;
    date : Time.Time;
    images : [EventImage];
    passwordProtected : Bool;
  };

  public type SpecialMomentDTO = {
    id : Nat;
    name : Text;
    date : Time.Time;
    images : [SpecialMomentImage];
  };

  public type PhotoFilter = {
    searchText : ?Text;
    startDate : ?Time.Time;
    endDate : ?Time.Time;
  };

  public type VideoFilter = {
    searchText : ?Text;
    startDate : ?Time.Time;
    endDate : ?Time.Time;
  };

  public type EventFilter = {
    searchText : ?Text;
    startDate : ?Time.Time;
    endDate : ?Time.Time;
  };

  public type SpecialMomentFilter = {
    searchText : ?Text;
    startDate : ?Time.Time;
    endDate : ?Time.Time;
  };

  type UploadProgress = {
    uploadedSize : Nat;
    totalSize : Nat;
  };

  type Visitor = {
    principal : Principal;
    timestamp : Time.Time;
  };

  type ShortlistEntry = {
    imageId : Text;
    timestamp : Time.Time;
  };

  type UserShortlist = {
    entries : Map.Map<Text, ShortlistEntry>;
  };

  type EventShortlists = {
    eventId : Nat;
    userShortlists : Map.Map<Principal, UserShortlist>;
  };

  type UserShortlistDTO = {
    user : Principal;
    eventId : Nat;
    images : [Text];
  };

  public type OrderStatus = {
    #Pending;
    #Fulfilled;
    #Cancelled;
  };

  public type OrderItem = {
    itemName : Text;
    quantity : Nat;
    unitPrice : Nat;
  };

  public type PaymentFields = {
    total : Nat;
    advance : Nat;
    remainingDue : Nat;
  };

  public type Order = {
    id : Nat;
    orderDate : Time.Time;
    fulfillDate : Time.Time;
    customerName : Text;
    numberOfDvd : Nat;
    numberOfPrints : Nat;
    status : OrderStatus;
    payment : PaymentFields;
    items : [OrderItem];
  };

  public type CreateOrderRequest = {
    orderDate : Time.Time;
    fulfillDate : Time.Time;
    customerName : Text;
    numberOfDvd : Nat;
    numberOfPrints : Nat;
    payment : PaymentFields;
    items : [OrderItem];
  };

  public type UpdateOrderRequest = {
    fulfillDate : ?Time.Time;
    customerName : ?Text;
    numberOfDvd : ?Nat;
    numberOfPrints : ?Nat;
    payment : ?PaymentFields;
    items : ?[OrderItem];
  };

  public type UpdateOrderStatusRequest = {
    status : OrderStatus;
  };

  let accessControlState = AccessControl.initState();
  let photos = Map.empty<Text, Photo>();
  let videos = Map.empty<Text, Video>();
  var nextEventId = 0;

  let events = Map.empty<Nat, Event>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var footerContent : FooterContent = {
    contactDetails = "kumarsumitmahto2@gmail.com";
    facebook = "https://www.facebook.com/yourpage";
    instagram = "https://www.instagram.com/yourprofile";
    youtube = "https://www.youtube.com/yourchannel";
  };

  var nextSpecialMomentId = 0;
  let specialMoments = Map.empty<Nat, SpecialMoment>();
  let userLikes = Map.empty<Principal, Map.Map<Text, Bool>>();
  let eventShortlists = Map.empty<Nat, Map.Map<Principal, UserShortlist>>();
  let visitors = Map.empty<Time.Time, Visitor>();

  let orders = Map.empty<Nat, Order>();
  var nextOrderId = 0;
  let validatedEventAccess = Map.empty<Principal, Map.Map<Nat, Time.Time>>();

  // Access Control Integration (required functions)
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (
      caller != user and not (AccessControl.isAdmin(accessControlState, caller))
    ) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
