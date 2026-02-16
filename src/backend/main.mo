import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Nat "mo:core/Nat";
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

  type FooterContent = {
    contactDetails : Text;
    facebook : Text;
    instagram : Text;
    youtube : Text;
  };

  type UserProfile = {
    name : Text;
  };

  type UploadResult = {
    success : Bool;
    message : Text;
  };

  type PhotoVideoUploadRequest = {
    name : Text;
    description : Text;
    blob : Storage.ExternalBlob;
  };

  type MultiPhotoUploadRequest = {
    photos : [PhotoVideoUploadRequest];
  };

  type EventCreateRequest = {
    name : Text;
    description : Text;
    date : Time.Time;
  };

  type EventImageUploadRequest = {
    eventId : Nat;
    name : Text;
    description : Text;
    blob : Storage.ExternalBlob;
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

  // Orders with status
  public type OrderStatus = {
    #Pending;
    #Fulfilled;
    #Cancelled;
  };

  public type Order = {
    id : Nat;
    orderDate : Time.Time;
    fulfillDate : Time.Time;
    customerName : Text;
    numberOfDvd : Nat;
    numberOfPrints : Nat;
    status : OrderStatus;
  };

  public type CreateOrderRequest = {
    orderDate : Time.Time;
    fulfillDate : Time.Time;
    customerName : Text;
    numberOfDvd : Nat;
    numberOfPrints : Nat;
  };

  public type UpdateOrderRequest = {
    fulfillDate : ?Time.Time;
    customerName : ?Text;
    numberOfDvd : ?Nat;
    numberOfPrints : ?Nat;
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

  // Orders storage with status
  let orders = Map.empty<Nat, Order>();
  var nextOrderId = 0;

  // Track validated event access per session
  let validatedEventAccess = Map.empty<Principal, Map.Map<Nat, Time.Time>>();

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

  public shared ({ caller }) func createNewAuthenticatedUser() : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot create profiles");
    };
    userProfiles.add(caller, { name = "Unknown" });
    true;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func uploadPhoto(request : PhotoVideoUploadRequest) : async UploadResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can upload photos");
    };
    let id = request.name;
    let photo : Photo = {
      id;
      name = request.name;
      description = request.description;
      blob = request.blob;
      uploadTime = Time.now();
      likeCount = 0;
    };
    photos.add(id, photo);
    {
      success = true;
      message = "Photo " # request.name # " uploaded successfully";
    };
  };

  public shared ({ caller }) func uploadMultiplePhotos(request : MultiPhotoUploadRequest) : async [UploadResult] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can upload photos");
    };
    request.photos.map(
      func(photoRequest) {
        let id = photoRequest.name;
        let photo : Photo = {
          id;
          name = photoRequest.name;
          description = photoRequest.description;
          blob = photoRequest.blob;
          uploadTime = Time.now();
          likeCount = 0;
        };
        photos.add(id, photo);
        {
          success = true;
          message = "Photo " # photoRequest.name # " uploaded successfully";
        };
      }
    );
  };

  public query ({ caller }) func getAllPhotosSorted(order : SortedOrder) : async [Photo] {
    // Public access - no authentication required for viewing photos
    let photoArray = photos.values().toArray();
    switch (order) {
      case (#newestFirst) {
        photoArray.sort(Photo.compareByUploadTime);
      };
      case (#oldestFirst) {
        photoArray.sort(
          func(a, b) {
            switch (Photo.compareByUploadTime(a, b)) {
              case (#less) { #greater };
              case (#equal) { #equal };
              case (#greater) { #less };
            };
          }
        );
      };
    };
  };

  public query ({ caller }) func getFilteredPhotos(order : SortedOrder, filter : PhotoFilter) : async [Photo] {
    // Public access - no authentication required for viewing photos
    let photoArray = photos.values().toArray();

    let filtered = photoArray.filter(
      func(photo) {
        let matchesSearch = switch (filter.searchText) {
          case (null) { true };
          case (?text) {
            photo.name.toLower().contains(#text(text.toLower())) or photo.description.toLower().contains(#text(text.toLower()));
          };
        };

        let withinDateRange = switch (filter.startDate, filter.endDate) {
          case (?start, ?end) { photo.uploadTime >= start and photo.uploadTime <= end };
          case (?start, null) { photo.uploadTime >= start };
          case (null, ?end) { photo.uploadTime <= end };
          case (null, null) { true };
        };

        matchesSearch and withinDateRange;
      }
    );

    switch (order) {
      case (#newestFirst) {
        filtered.sort(Photo.compareByUploadTime);
      };
      case (#oldestFirst) {
        let sorted = filtered.sort(Photo.compareByUploadTime);
        sorted.reverse();
      };
    };
  };

  public shared ({ caller }) func deletePhoto(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete photos");
    };
    if (not photos.containsKey(id)) {
      Runtime.trap("Photo not found");
    };
    photos.remove(id);
  };

  public shared ({ caller }) func uploadVideo(request : PhotoVideoUploadRequest) : async UploadResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can upload videos");
    };
    let id = request.name;
    let video : Video = {
      id;
      name = request.name;
      description = request.description;
      blob = request.blob;
      uploadTime = Time.now();
    };
    videos.add(id, video);
    {
      success = true;
      message = "Video " # request.name # " uploaded successfully";
    };
  };

  public query ({ caller }) func getAllVideosSorted(order : SortedOrder) : async [Video] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access videos");
    };
    let videoArray = videos.values().toArray();
    switch (order) {
      case (#newestFirst) {
        videoArray.sort(Video.compareByUploadTime);
      };
      case (#oldestFirst) {
        videoArray.sort(
          func(a, b) {
            switch (Video.compareByUploadTime(a, b)) {
              case (#less) { #greater };
              case (#equal) { #equal };
              case (#greater) { #less };
            };
          }
        );
      };
    };
  };

  public query ({ caller }) func getFilteredVideos(order : SortedOrder, filter : VideoFilter) : async [Video] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access videos");
    };
    let videoArray = videos.values().toArray();

    let filtered = videoArray.filter(
      func(video) {
        let matchesSearch = switch (filter.searchText) {
          case (null) { true };
          case (?text) {
            video.name.toLower().contains(#text(text.toLower())) or video.description.toLower().contains(#text(text.toLower()));
          };
        };

        let withinDateRange = switch (filter.startDate, filter.endDate) {
          case (?start, ?end) { video.uploadTime >= start and video.uploadTime <= end };
          case (?start, null) { video.uploadTime >= start };
          case (null, ?end) { video.uploadTime <= end };
          case (null, null) { true };
        };

        matchesSearch and withinDateRange;
      }
    );

    switch (order) {
      case (#newestFirst) {
        filtered.sort(Video.compareByUploadTime);
      };
      case (#oldestFirst) {
        let sorted = filtered.sort(Video.compareByUploadTime);
        sorted.reverse();
      };
    };
  };

  public shared ({ caller }) func deleteVideo(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete videos");
    };
    if (not videos.containsKey(id)) {
      Runtime.trap("Video not found");
    };
    videos.remove(id);
  };

  public shared ({ caller }) func createEvent(request : EventCreateRequest) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create events");
    };

    let eventId = nextEventId;
    let newEvent : Event = {
      id = eventId;
      name = request.name;
      description = request.description;
      date = request.date;
      images = Map.empty<Text, EventImage>();
      password = null;
    };

    events.add(eventId, newEvent);
    nextEventId += 1;
    eventId;
  };

  public shared ({ caller }) func createSpecialMoment(request : SpecialMomentCreateRequest) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create special moments");
    };

    let specialMomentId = nextSpecialMomentId;
    let newSpecialMoment : SpecialMoment = {
      id = specialMomentId;
      name = request.name;
      date = request.date;
      images = Map.empty<Text, SpecialMomentImage>();
    };

    specialMoments.add(specialMomentId, newSpecialMoment);
    nextSpecialMomentId += 1;
    specialMomentId;
  };

  public query ({ caller }) func getAllSpecialMomentsSorted(order : SortedOrder) : async [SpecialMomentDTO] {
    // Public access - no authentication required for viewing special moments
    let momentArray = specialMoments.values().toArray();
    let sortedMoments = switch (order) {
      case (#newestFirst) {
        momentArray.sort(SpecialMoment.compareByDate);
      };
      case (#oldestFirst) {
        momentArray.sort(
          func(a, b) {
            switch (SpecialMoment.compareByDate(a, b)) {
              case (#less) { #greater };
              case (#equal) { #equal };
              case (#greater) { #less };
            };
          }
        );
      };
    };
    sortedMoments.map<SpecialMoment, SpecialMomentDTO>(
      func(moment) {
        {
          moment with
          images = moment.images.values().toArray();
        };
      }
    );
  };

  public query ({ caller }) func getFilteredSpecialMoments(order : SortedOrder, filter : SpecialMomentFilter) : async [SpecialMomentDTO] {
    // Public access - no authentication required for filtering special moments
    let momentArray = specialMoments.values().toArray();

    let filtered = momentArray.filter(
      func(moment) {
        let matchesSearch = switch (filter.searchText) {
          case (null) { true };
          case (?text) {
            moment.name.toLower().contains(#text(text.toLower()))
          };
        };

        let withinDateRange = switch (filter.startDate, filter.endDate) {
          case (?start, ?end) { moment.date >= start and moment.date <= end };
          case (?start, null) { moment.date >= start };
          case (null, ?end) { moment.date <= end };
          case (null, null) { true };
        };

        matchesSearch and withinDateRange;
      }
    );

    let sorted = switch (order) {
      case (#newestFirst) {
        filtered.sort(SpecialMoment.compareByDate);
      };
      case (#oldestFirst) {
        filtered.sort(
          func(a, b) {
            switch (SpecialMoment.compareByDate(a, b)) {
              case (#less) { #greater };
              case (#equal) { #equal };
              case (#greater) { #less };
            };
          }
        );
      };
    };

    sorted.map<SpecialMoment, SpecialMomentDTO>(
      func(moment) {
        {
          moment with
          images = moment.images.values().toArray();
        };
      }
    );
  };

  public query ({ caller }) func getSpecialMoment(specialMomentId : Nat) : async SpecialMomentDTO {
    // Public access - no authentication required for getting special moments
    switch (specialMoments.get(specialMomentId)) {
      case (null) { Runtime.trap("Special moment not found") };
      case (?moment) {
        {
          moment with
          images = moment.images.values().toArray();
        };
      };
    };
  };

  public query ({ caller }) func getSpecialMomentsImages(specialMomentId : Nat, order : SortedOrder) : async [SpecialMomentImage] {
    // Public access - no authentication required for getting special moments images
    switch (specialMoments.get(specialMomentId)) {
      case (null) { Runtime.trap("Special moment not found") };
      case (?moment) {
        let imageArray = moment.images.values().toArray();
        switch (order) {
          case (#newestFirst) {
            imageArray.sort(
              func(a, b) {
                Int.compare(a.uploadTime, b.uploadTime);
              }
            );
          };
          case (#oldestFirst) {
            imageArray.sort(
              func(a, b) {
                switch (Int.compare(a.uploadTime, b.uploadTime)) {
                  case (#less) { #greater };
                  case (#equal) { #equal };
                  case (#greater) { #less };
                };
              }
            );
          };
        };
      };
    };
  };

  public shared ({ caller }) func uploadSpecialMomentImage(request : SpecialMomentImageUploadRequest) : async UploadResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can upload special moment images");
    };

    switch (specialMoments.get(request.specialMomentId)) {
      case (null) { Runtime.trap("Special moment not found") };
      case (?moment) {
        let image : SpecialMomentImage = {
          id = request.name;
          name = request.name;
          blob = request.blob;
          uploadTime = Time.now();
        };
        moment.images.add(request.name, image);
        specialMoments.add(request.specialMomentId, moment);
        {
          success = true;
          message = "Special moment image " # request.name # " uploaded successfully";
        };
      };
    };
  };

  public shared ({ caller }) func deleteSpecialMomentImage(specialMomentId : Nat, imageId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete special moment images");
    };

    switch (specialMoments.get(specialMomentId)) {
      case (null) { Runtime.trap("Special moment not found") };
      case (?moment) {
        if (not moment.images.containsKey(imageId)) {
          Runtime.trap("Image not found");
        };
        moment.images.remove(imageId);
        specialMoments.add(specialMomentId, moment);
      };
    };
  };

  public shared ({ caller }) func deleteSpecialMoment(specialMomentId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete special moments");
    };
    if (not specialMoments.containsKey(specialMomentId)) {
      Runtime.trap("Special moment not found");
    };
    specialMoments.remove(specialMomentId);
  };

  public shared ({ caller }) func updateEvent(eventId : Nat, request : EventCreateRequest) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update events");
    };

    switch (events.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?existingEvent) {
        let updatedEvent : Event = {
          existingEvent with
          name = request.name;
          description = request.description;
          date = request.date;
        };
        events.add(eventId, updatedEvent);
      };
    };
  };

  public shared ({ caller }) func deleteEvent(eventId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete events");
    };
    if (not events.containsKey(eventId)) {
      Runtime.trap("Event not found");
    };
    events.remove(eventId);
  };

  public shared ({ caller }) func setEventPassword(eventId : Nat, password : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can set event passwords");
    };
    switch (events.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) {
        let updatedEvent : Event = { event with password = ?password };
        events.add(eventId, updatedEvent);
      };
    };
  };

  public shared ({ caller }) func removeEventPassword(eventId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can remove event passwords");
    };
    switch (events.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) {
        let updatedEvent : Event = { event with password = null };
        events.add(eventId, updatedEvent);
      };
    };
  };

  public query ({ caller }) func getAllEventsSorted(order : SortedOrder) : async [EventDTO] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access events");
    };
    let eventArray = events.values().toArray();
    let sortedEvents = switch (order) {
      case (#newestFirst) {
        eventArray.sort(Event.compareByDate);
      };
      case (#oldestFirst) {
        eventArray.sort(
          func(a, b) {
            switch (Event.compareByDate(a, b)) {
              case (#less) { #greater };
              case (#equal) { #equal };
              case (#greater) { #less };
            };
          }
        );
      };
    };
    sortedEvents.map<Event, EventDTO>(
      func(event) {
        {
          event with
          images = event.images.values().toArray();
          passwordProtected = switch (event.password) {
            case (null) { false };
            case (_) { true };
          };
        };
      }
    );
  };

  public query ({ caller }) func getFilteredEvents(order : SortedOrder, filter : EventFilter) : async [EventDTO] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access events");
    };
    let eventArray = events.values().toArray();

    let filtered = eventArray.filter(
      func(event) {
        let matchesSearch = switch (filter.searchText) {
          case (null) { true };
          case (?text) {
            event.name.toLower().contains(#text(text.toLower())) or event.description.toLower().contains(#text(text.toLower()));
          };
        };

        let withinDateRange = switch (filter.startDate, filter.endDate) {
          case (?start, ?end) { event.date >= start and event.date <= end };
          case (?start, null) { event.date >= start };
          case (null, ?end) { event.date <= end };
          case (null, null) { true };
        };

        matchesSearch and withinDateRange;
      }
    );

    let sorted = switch (order) {
      case (#newestFirst) {
        filtered.sort(Event.compareByDate);
      };
      case (#oldestFirst) {
        filtered.sort(
          func(a, b) {
            switch (Event.compareByDate(a, b)) {
              case (#less) { #greater };
              case (#equal) { #equal };
              case (#greater) { #less };
            };
          }
        );
      };
    };

    sorted.map<Event, EventDTO>(
      func(event) {
        {
          event with
          images = event.images.values().toArray();
          passwordProtected = switch (event.password) {
            case (null) { false };
            case (_) { true };
          };
        };
      }
    );
  };

  private func hasValidatedEventAccess(caller : Principal, eventId : Nat) : Bool {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };

    switch (validatedEventAccess.get(caller)) {
      case (null) { false };
      case (?accessMap) {
        switch (accessMap.get(eventId)) {
          case (null) { false };
          case (?timestamp) {
            let currentTime = Time.now();
            let oneHour = 3_600_000_000_000;
            (currentTime - timestamp) < oneHour;
          };
        };
      };
    };
  };

  public query ({ caller }) func getEvent(eventId : Nat) : async EventDTO {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access events");
    };

    switch (events.get(eventId)) {
      case (null) {
        Runtime.trap("Event not found");
      };
      case (?event) {
        switch (event.password) {
          case (?_) {
            if (not hasValidatedEventAccess(caller, eventId)) {
              Runtime.trap("Unauthorized: Password required to access this event");
            };
          };
          case (null) {};
        };
        {
          event with
          images = event.images.values().toArray();
          passwordProtected = switch (event.password) {
            case (null) { false };
            case (_) { true };
          };
        };
      };
    };
  };

  public query ({ caller }) func getPasswordProtectedEvents() : async [Nat] {
    let eventIds = events.keys().toArray();
    let passwordProtectedIds = eventIds.filter(
      func(id) {
        switch (events.get(id)) {
          case (null) { false };
          case (?event) {
            switch (event.password) {
              case (null) { false };
              case (_) { true };
            };
          };
        };
      }
    );
    passwordProtectedIds;
  };

  public query ({ caller }) func isEventPasswordProtected(eventId : Nat) : async Bool {
    switch (events.get(eventId)) {
      case (null) { false };
      case (?event) { switch (event.password) { case (null) { false }; case (_) { true } } };
    };
  };

  public shared ({ caller }) func validateEventPassword(eventId : Nat, password : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can validate event passwords");
    };

    switch (events.get(eventId)) {
      case (null) { false };
      case (?event) {
        switch (event.password) {
          case (null) { true };
          case (?eventPassword) {
            let isValid = password == eventPassword;
            if (isValid) {
              switch (validatedEventAccess.get(caller)) {
                case (null) {
                  let newAccessMap = Map.empty<Nat, Time.Time>();
                  newAccessMap.add(eventId, Time.now());
                  validatedEventAccess.add(caller, newAccessMap);
                };
                case (?accessMap) {
                  accessMap.add(eventId, Time.now());
                };
              };
            };
            isValid;
          };
        };
      };
    };
  };

  public shared ({ caller }) func uploadEventImage(request : EventImageUploadRequest) : async UploadResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can upload event images");
    };

    switch (events.get(request.eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) {
        let image : EventImage = {
          id = request.name;
          name = request.name;
          description = request.description;
          blob = request.blob;
          uploadTime = Time.now();
        };
        event.images.add(request.name, image);
        events.add(request.eventId, event);
        {
          success = true;
          message = "Event image " # request.name # " uploaded successfully";
        };
      };
    };
  };

  public shared ({ caller }) func deleteEventImage(eventId : Nat, imageId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete event images");
    };

    switch (events.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) {
        if (not event.images.containsKey(imageId)) {
          Runtime.trap("Image not found");
        };
        event.images.remove(imageId);
        events.add(eventId, event);
      };
    };
  };

  public query ({ caller }) func getEventImages(eventId : Nat, order : SortedOrder) : async [EventImage] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access events");
    };

    switch (events.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) {
        switch (event.password) {
          case (?_) {
            if (not hasValidatedEventAccess(caller, eventId)) {
              Runtime.trap("Unauthorized: Password required to access this event");
            };
          };
          case (null) {};
        };

        let imageArray = event.images.values().toArray();
        switch (order) {
          case (#newestFirst) {
            imageArray.sort(EventImage.compareByUploadTime);
          };
          case (#oldestFirst) {
            imageArray.sort(
              func(a, b) {
                switch (EventImage.compareByUploadTime(a, b)) {
                  case (#less) { #greater };
                  case (#equal) { #equal };
                  case (#greater) { #less };
                };
              }
            );
          };
        };
      };
    };
  };

  public query ({ caller }) func getFooterContent() : async FooterContent {
    footerContent;
  };

  public shared ({ caller }) func updateFooterContent(content : FooterContent) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update footer content");
    };
    footerContent := content;
  };

  public query ({ caller }) func getAppVersion() : async Text {
    "1.2.0";
  };

  public shared ({ caller }) func togglePhotoLike(photoId : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can like or unlike photos");
    };

    switch (photos.get(photoId)) {
      case (null) { Runtime.trap("Photo not found") };
      case (?photo) {
        switch (userLikes.get(caller)) {
          case (null) {
            let newLikesMap = Map.empty<Text, Bool>();
            newLikesMap.add(photoId, true);
            userLikes.add(caller, newLikesMap);

            let updatedPhoto : Photo = {
              photo with
              likeCount = photo.likeCount + 1;
            };
            photos.add(photoId, updatedPhoto);
            true;
          };
          case (?likesMap) {
            switch (likesMap.get(photoId)) {
              case (?true) {
                likesMap.add(photoId, false);
                let updatedPhoto : Photo = {
                  photo with
                  likeCount = if (photo.likeCount > 0) { photo.likeCount - 1 } else { 0 };
                };
                photos.add(photoId, updatedPhoto);
                false;
              };
              case (_) {
                likesMap.add(photoId, true);
                let updatedPhoto : Photo = {
                  photo with
                  likeCount = photo.likeCount + 1;
                };
                photos.add(photoId, updatedPhoto);
                true;
              };
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func hasUserLikedPhoto(photoId : Text) : async Bool {
    switch (userLikes.get(caller)) {
      case (null) { false };
      case (?likesMap) {
        switch (likesMap.get(photoId)) {
          case (?isLiked) { isLiked };
          case (_) { false };
        };
      };
    };
  };

  public query ({ caller }) func hasUserLikedPhotoExplicit(user : Principal, photoId : Text) : async Bool {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own like status");
    };
    switch (userLikes.get(user)) {
      case (null) { false };
      case (?likesMap) {
        switch (likesMap.get(photoId)) {
          case (?isLiked) { isLiked };
          case (_) { false };
        };
      };
    };
  };

  public query ({ caller }) func getPhotoLikeCount(photoId : Text) : async Nat {
    switch (photos.get(photoId)) {
      case (null) { 0 };
      case (?photo) { photo.likeCount };
    };
  };

  public query ({ caller }) func getTotalLikeCountForUser(user : Principal) : async Nat {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own like count");
    };
    switch (userLikes.get(user)) {
      case (null) { 0 };
      case (?likesMap) {
        var count = 0;
        for ((_, isLiked) in likesMap.entries()) {
          if (isLiked) { count += 1 };
        };
        count;
      };
    };
  };

  public query ({ caller }) func getLikedPhotos(user : Principal) : async [Text] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own liked photos");
    };
    switch (userLikes.get(user)) {
      case (null) { [] };
      case (?likesMap) {
        likesMap.entries().toArray().filter(
          func((_, isLiked)) { isLiked }
        ).map(
          func((photoId, _)) { photoId }
        );
      };
    };
  };

  public shared ({ caller }) func recordVisitor() : async () {
    let timestamp = Time.now();
    let visitor : Visitor = {
      principal = caller;
      timestamp;
    };
    visitors.add(timestamp, visitor);
  };

  public shared ({ caller }) func getVisitors(pagination : { start : Nat; limit : Nat }) : async [Visitor] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view the visitors list");
    };

    let visitorArray = visitors.values().toArray();
    let startIndex = pagination.start;
    let arrayLength = visitorArray.size();
    let endIndex = if (arrayLength > 0) {
      Int.min(arrayLength, startIndex + pagination.limit);
    } else { 0 };

    if (startIndex < endIndex) {
      visitorArray.sliceToArray(startIndex, endIndex);
    } else {
      [];
    };
  };

  public shared ({ caller }) func toggleShortlist(eventId : Nat, imageId : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can toggle shortlists");
    };

    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot create shortlists");
    };

    if (not events.containsKey(eventId)) {
      Runtime.trap("Event not found");
    };

    let currentShortlists = switch (eventShortlists.get(eventId)) {
      case (null) { Map.empty<Principal, UserShortlist>() };
      case (?shortlists) { shortlists };
    };

    let userShortlist = switch (currentShortlists.get(caller)) {
      case (null) {
        let newUserShortlist = Map.empty<Text, ShortlistEntry>();
        newUserShortlist.add(
          imageId,
          {
            imageId;
            timestamp = Time.now();
          },
        );
        currentShortlists.add(
          caller,
          {
            entries = newUserShortlist;
          },
        );
        eventShortlists.add(eventId, currentShortlists);
        true;
      };
      case (?existingUserShortlist) {
        let entries = existingUserShortlist.entries;
        let isCurrentlyShortlisted = entries.containsKey(imageId);

        if (isCurrentlyShortlisted) {
          entries.remove(imageId);
        } else {
          entries.add(
            imageId,
            {
              imageId;
              timestamp = Time.now();
            },
          );
        };
        eventShortlists.add(eventId, currentShortlists);
        not isCurrentlyShortlisted;
      };
    };
  };

  public query ({ caller }) func hasUserShortlistedImage(explicitUser : Principal, eventId : Nat, imageId : Text) : async Bool {
    if (caller != explicitUser and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own shortlist status");
    };

    switch (eventShortlists.get(eventId)) {
      case (null) { false };
      case (?shortlists) {
        switch (shortlists.get(explicitUser)) {
          case (null) { false };
          case (?userShortlist) {
            userShortlist.entries.containsKey(imageId);
          };
        };
      };
    };
  };

  public query ({ caller }) func hasUserShortlistedImageForCaller(eventId : Nat, imageId : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can check if image is shortlisted");
    };

    switch (eventShortlists.get(eventId)) {
      case (null) { false };
      case (?shortlists) {
        switch (shortlists.get(caller)) {
          case (null) { false };
          case (?userShortlist) {
            userShortlist.entries.containsKey(imageId);
          };
        };
      };
    };
  };

  public query ({ caller }) func getShortlistedImagesForUser(eventId : Nat) : async [Text] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get their own shortlisted images");
    };

    switch (eventShortlists.get(eventId)) {
      case (null) { [] };
      case (?shortlists) {
        switch (shortlists.get(caller)) {
          case (null) { [] };
          case (?userShortlist) {
            userShortlist.entries.keys().toArray();
          };
        };
      };
    };
  };

  public query ({ caller }) func getAllShortlistedImagesForUser(explicitUser : Principal, eventId : Nat) : async [Text] {
    if (caller != explicitUser and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own shortlisted images");
    };

    switch (eventShortlists.get(eventId)) {
      case (null) { [] };
      case (?shortlists) {
        switch (shortlists.get(explicitUser)) {
          case (null) { [] };
          case (?userShortlist) {
            userShortlist.entries.keys().toArray();
          };
        };
      };
    };
  };

  public query ({ caller }) func getUserShortlistAcrossEvents() : async [UserShortlistDTO] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their own shortlists");
    };

    let resultArray = List.empty<UserShortlistDTO>();

    for ((eventId, userShortlists) in eventShortlists.entries()) {
      for ((user, userShortlist) in userShortlists.entries()) {
        if (user == caller) {
          let eventEntry : UserShortlistDTO = {
            user;
            eventId;
            images = userShortlist.entries.keys().toArray();
          };
          resultArray.add(eventEntry);
        };
      };
    };

    resultArray.toArray();
  };

  public query ({ caller }) func getAllShortlistsForAdmin() : async [UserShortlistDTO] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can get all shortlists");
    };

    let resultArray = List.empty<UserShortlistDTO>();

    for ((eventId, userShortlists) in eventShortlists.entries()) {
      for ((user, userShortlist) in userShortlists.entries()) {
        let eventEntry : UserShortlistDTO = {
          user;
          eventId;
          images = userShortlist.entries.keys().toArray();
        };
        resultArray.add(eventEntry);
      };
    };

    resultArray.toArray();
  };

  public query ({ caller }) func getShortlistCountForImage(eventId : Nat, imageId : Text) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view shortlist analytics");
    };

    switch (eventShortlists.get(eventId)) {
      case (null) { 0 };
      case (?shortlists) {
        var count = 0;
        for ((_, userShortlist) in shortlists.entries()) {
          if (userShortlist.entries.containsKey(imageId)) {
            count += 1;
          };
        };
        count;
      };
    };
  };

  // Orders Functions with status

  public shared ({ caller }) func createOrder(request : CreateOrderRequest) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create orders");
    };

    let orderId = nextOrderId;
    let newOrder : Order = {
      id = orderId;
      orderDate = request.orderDate;
      fulfillDate = request.fulfillDate;
      customerName = request.customerName;
      numberOfDvd = request.numberOfDvd;
      numberOfPrints = request.numberOfPrints;
      status = #Pending;
    };

    orders.add(orderId, newOrder);
    nextOrderId += 1;
    orderId;
  };

  public shared ({ caller }) func updateOrder(orderId : Nat, request : UpdateOrderRequest) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update orders");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?existingOrder) {
        let updatedOrder : Order = {
          existingOrder with
          fulfillDate = switch (request.fulfillDate) { case (null) { existingOrder.fulfillDate }; case (?d) { d } };
          customerName = switch (request.customerName) { case (null) { existingOrder.customerName }; case (?c) { c } };
          numberOfDvd = switch (request.numberOfDvd) { case (null) { existingOrder.numberOfDvd }; case (?n) { n } };
          numberOfPrints = switch (request.numberOfPrints) { case (null) { existingOrder.numberOfPrints }; case (?n) { n } };
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, request : UpdateOrderStatusRequest) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?existingOrder) {
        let updatedOrder : Order = {
          existingOrder with
          status = request.status;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func deleteOrder(orderId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete orders");
    };
    if (not orders.containsKey(orderId)) {
      Runtime.trap("Order not found");
    };
    orders.remove(orderId);
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async ?Order {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    orders.get(orderId);
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func getAllOrdersSortedByDate() : async [Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    let orderArray = orders.values().toArray();
    orderArray.sort(
      func(a, b) {
        Int.compare(a.orderDate, b.orderDate);
      }
    );
  };

  public query ({ caller }) func getOrdersByStatus(status : OrderStatus) : async [Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view orders by status");
    };
    let ordersArray = orders.values().toArray();
    let filtered = ordersArray.filter(
      func(order) { order.status == status }
    );
    filtered;
  };
};
