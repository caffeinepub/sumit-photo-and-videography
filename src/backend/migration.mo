import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldPhoto = {
    id : Text;
    name : Text;
    description : Text;
    blob : Storage.ExternalBlob;
    uploadTime : Time.Time;
    likeCount : Nat;
  };

  type Photo = {
    id : Text;
    name : Text;
    description : Text;
    blob : Storage.ExternalBlob;
    uploadTime : Time.Time;
    likeCount : Nat;
    category : Text;
  };

  type OldEventImage = {
    id : Text;
    name : Text;
    description : Text;
    blob : Storage.ExternalBlob;
    uploadTime : Time.Time;
  };

  type EventImage = {
    id : Text;
    name : Text;
    description : Text;
    blob : Storage.ExternalBlob;
    uploadTime : Time.Time;
    category : Text;
  };

  type OldEvent = {
    id : Nat;
    name : Text;
    description : Text;
    date : Time.Time;
    images : Map.Map<Text, OldEventImage>;
    password : ?Text;
  };

  type Event = {
    id : Nat;
    name : Text;
    description : Text;
    date : Time.Time;
    images : Map.Map<Text, EventImage>;
    password : ?Text;
  };

  type OldUserProfile = {
    name : Text;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    address : Text;
    phone : Text;
  };

  type OldActor = {
    photos : Map.Map<Text, OldPhoto>;
    events : Map.Map<Nat, OldEvent>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type NewActor = {
    photos : Map.Map<Text, Photo>;
    events : Map.Map<Nat, Event>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newPhotos = old.photos.map<Text, OldPhoto, Photo>(
      func(_id, oldPhoto) {
        { oldPhoto with category = "uncategorized" };
      }
    );

    let newEvents = old.events.map<Nat, OldEvent, Event>(
      func(_id, oldEvent) {
        let newImages = oldEvent.images.map<Text, OldEventImage, EventImage>(
          func(_imageId, oldImage) {
            { oldImage with category = "uncategorized" };
          }
        );
        {
          oldEvent with
          images = newImages;
        };
      }
    );

    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, UserProfile>(
      func(_principal, oldProfile) {
        {
          oldProfile with
          email = "unknown";
          address = "unknown";
          phone = "unknown";
        };
      }
    );

    {
      old with
      photos = newPhotos;
      events = newEvents;
      userProfiles = newUserProfiles;
    };
  };
};
