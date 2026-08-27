import ABDataCollectionCore from "../core/ABDataCollectionCore.js";

export default class ABDataCollection extends ABDataCollectionCore {
   // constructor(attributes, application) {
   //    super(attributes, application);
   // }

   _dataCollectionNew() {
      // NOTE: on the microservice platfform, DataCollections should not really be
      // used.  The purpose of this method is to create an instance of a webix
      // datacollection like object that can manage the gathering of a set of data.
      // these should only be use by Views.
      return null;
   }
}
