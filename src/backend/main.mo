import Map "mo:core/Map";
import Array "mo:core/Array";
import Set "mo:core/Set";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Bool "mo:core/Bool";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  // Core Types
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

  // DTO Types for shared/public functions
  type EventDTO = {
    id : Nat;
    name : Text;
    description : Text;
    date : Time.Time;
    images : [EventImage];
    password : ?Text;
  };

  type SpecialMomentDTO = {
    id : Nat;
    name : Text;
    date : Time.Time;
    images : [SpecialMomentImage];
  };

  // Helper Types
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

  type EventCreateRequest = {
    name : Text;
    description : Text;
    date : Time.Time;
    password : ?Text;
    image : ?Storage.ExternalBlob;
  };

  type VideoUploadRequest = {
    name : Text;
    description : Text;
    blob : Storage.ExternalBlob;
  };

  type OrderStatus = {
    #Pending;
    #Fulfilled;
    #Cancelled;
  };

  type OrderField = {
    itemName : Text;
    quantity : Nat;
    unitPrice : Nat;
  };

  type PaymentFields = {
    total : Nat;
    advance : Nat;
    remainingDue : Nat;
  };

  type Order = {
    id : Nat;
    orderDate : Time.Time;
    fulfillDate : Time.Time;
    customerName : Text;
    numberOfDvd : Nat;
    numberOfPrints : Nat;
    status : OrderStatus;
    payment : PaymentFields;
    items : [OrderField];
  };

  type CreateOrderRequest = {
    orderDate : Time.Time;
    fulfillDate : Time.Time;
    customerName : Text;
    numberOfDvd : Nat;
    numberOfPrints : Nat;
    payment : PaymentFields;
    items : [OrderField];
  };

  // Access Control Integration (required by component)
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

  let eventShortlists = Map.empty<Nat, Map.Map<Principal, [Text]>>();
  let visitors = Map.empty<Time.Time, { principal : Principal; timestamp : Time.Time }>();

  let orders = Map.empty<Nat, Order>();
  var nextOrderId = 0;

  // Backend Functions
  public shared ({ caller }) func uploadPhoto(photoData : PhotoVideoUploadRequest) : async Photo {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can upload photos");
    };

    let photoId = photoData.name.concat("_").concat(Time.now().toText());
    let photo : Photo = {
      id = photoId;
      name = photoData.name;
      description = photoData.description;
      blob = photoData.blob;
      uploadTime = Time.now();
      likeCount = 0;
      category = photoData.category;
    };

    photos.add(photoId, photo);
    photo;
  };

  public shared ({ caller }) func uploadVideo(videoData : VideoUploadRequest) : async Video {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can upload videos");
    };

    let videoId = videoData.name.concat("_").concat(Time.now().toText());
    let video : Video = {
      id = videoId;
      name = videoData.name;
      description = videoData.description;
      blob = videoData.blob;
      uploadTime = Time.now();
    };

    videos.add(videoId, video);
    video;
  };

  public shared ({ caller }) func createEvent(eventData : EventCreateRequest) : async EventDTO {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create events");
    };

    let eventId = nextEventId;
    nextEventId += 1;

    let images = Map.empty<Text, EventImage>();

    let event : Event = {
      id = eventId;
      name = eventData.name;
      description = eventData.description;
      date = eventData.date;
      images;
      password = eventData.password;
    };

    events.add(eventId, event);

    let imagesArray = images.values().toArray().reverse();

    {
      id = eventId;
      name = eventData.name;
      description = eventData.description;
      date = eventData.date;
      images = imagesArray;
      password = eventData.password;
    };
  };

  public shared ({ caller }) func createOrder(orderData : CreateOrderRequest) : async Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };

    let orderId = nextOrderId;
    nextOrderId += 1;

    let order : Order = {
      id = orderId;
      orderDate = orderData.orderDate;
      fulfillDate = orderData.fulfillDate;
      customerName = orderData.customerName;
      numberOfDvd = orderData.numberOfDvd;
      numberOfPrints = orderData.numberOfPrints;
      status = #Pending;
      payment = orderData.payment;
      items = orderData.items;
    };

    orders.add(orderId, order);
    order;
  };

  // Access Control Functions (required by component)
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
