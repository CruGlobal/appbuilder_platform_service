const ABProcessTaskUserFormCore = require("../../../core/process/tasks/ABProcessTaskUserFormCore.js");

/**
 * @function parseEntryKeys()
 * Step through an array of formbuilder.io form entry descriptions
 * and identify which of our processData[keys] are being referenced
 * for their values.
 * @param {array} keys
 *        This is the array that will be UPDATED with the keys we
 *        find.
 * @param {array} entries
 *        The .formBuilder description of the fields being displayed
 *        on the form.
 */
function parseEntryKeys(keys, entries) {
   if (entries.length == 0) {
      return;
   }
   let entry = entries.shift();
   // entries that have abFieldID are the ones that directly reference
   // our data:
   if (entry.key) {
      keys.push(entry.key);
   }

   // if this entry is a container, we need to parse it's children
   if (entry.components) {
      if (entry.path) {
         // keep the path
         keys.push(entry.path);
      }

      parseEntryKeys(keys, entry.components);
   }

   // recurse until we are done:
   parseEntryKeys(keys, entries);
}

/**
 * @function parseEntryArrays()
 * Step through an array of formbuilder.io form entry descriptions
 * and identify which them are containers for Arrays of information.
 * Once we find them we will then try to reduce our .processData[key]
 * to only have the essential fields that are referenced.
 * @param {array} entries
 *        The .formBuilder description of the fields being displayed
 *        on the form.
 * @param {json} data
 *        The processData that we need to pair down.
 */
function parseEntryArrays(entries, data) {
   if (entries.length == 0) {
      return;
   }

   let entry = entries.shift();

   if (
      entry.path &&
      entry.templates /* && entry.customClass == "customList" */
   ) {
      // if entry.path refers to one of our entries:
      let dataSet = data[entry.path];
      if (dataSet && dataSet.length) {
         let fieldsToKeep = parseEntryArrayFields(entry);

         for (let i = 0; i < dataSet.length; i++) {
            let d = dataSet[i];
            Object.keys(d).forEach((k) => {
               if (fieldsToKeep.indexOf(k) == -1) {
                  delete d[k];
               }
            });
         }
      }
   } else {
      if (entry.components) {
         // this is a layout component, so scan it's children
         parseEntryArrays(entry.components, data);
      }
   }

   // do the next one
   parseEntryArrays(entries, data);
}

module.exports = class ABProcessTaskUserForm extends (
   ABProcessTaskUserFormCore
) {
   ////
   //// Process Instance Methods
   ////

   /**
    * do()
    * this method actually performs the action for this task.
    * @param {obj} instance  the instance data of the running process
    * @param {Knex.Transaction?} trx - [optional]
    * @param {ABUtil.reqService} req
    *        an instance of the current request object for performing tenant
    *        based operations.
    * @return {Promise}
    *      resolve(true/false) : true if the task is completed.
    *                            false if task is still waiting
    */
   do(instance, trx, req) {
      this._req = req;
      return new Promise((resolve, reject) => {

         const userId = this._req?._user?.id;
         if (!userId) return resolve(true);

         // If the form input are set, then go to the next task
         const myState = this.myState(instance);
         if (myState?._isSet) {
            this.stateCompleted(instance);
            return resolve(true);
         }

         const processData = {};
         const listDataFields = this.process.processDataFields(this);
         listDataFields.forEach((entry) => {
            processData[entry.key] = this.process.processData(this, [
               instance,
               entry.key,
            ]);

            if (entry.field?.key == "connectObject") {
               delete processData[entry.key];
               processData[`${entry.key}.format`] = this.process.processData(
                  this,
                  [instance, `${entry.key}.format`],
               );
            }

            // make sure our user fields are not fully populated.  Just base user
            // is fine.
            if (entry.field?.key == "user") {
               let foundUser = processData[entry.key];
               if (foundUser) {
                  let baseUser = {};
                  let skipFields = ["salt", "password"];
                  let relFields = Object.keys(foundUser).filter(
                     (f) => f.indexOf("__relation") > -1,
                  );
                  relFields.forEach((rf) => {
                     let pairedField = rf.replaceAll("__relation", "");
                     skipFields.push(rf);
                     skipFields.push(pairedField);
                  });

                  Object.keys(foundUser).forEach((f) => {
                     if (skipFields.indexOf(f) == -1) {
                        baseUser[f] = foundUser[f];
                     }
                  });
                  processData[entry.key] = baseUser;
               }
            }
         });

         // reduce the amount of data we are storing to only the ones referenced
         // by the formBuilder information:

         // 1) only keep keys that are used in the form:
         let keysToKeep = [];
         let copyComponents = this.AB.cloneDeep(this.formBuilder.components);
         parseEntryKeys(keysToKeep, copyComponents);
         Object.keys(processData).forEach((k) => {
            // skip any keys that have .format
            if (k.indexOf(".format") > -1) return;
            if (keysToKeep.indexOf(k) == -1) {
               delete processData[k];
            }
         });

         // 2) reduce the arrays of data to be minimal according to what
         //    we actually reference
         copyComponents = this.AB.cloneDeep(this.formBuilder.components);
         parseEntryArrays(copyComponents, processData);

         // Call to display the input form popup.
         this._req.broadcast([
            {
               room: this._req.socketKey(userId),
               event: "ab.task.userform",
               data: {
                  processId: this.process.id,
                  taskId: this.id,
                  instanceId: instance.id,
                  formio: this.formBuilder,
                  formData: processData,
               },
            },
         ], (err) => {
            if (err) return reject(err);

            // Pause before running the next task. It will proceed once it receives the input data.
            resolve(false);
         });
      });
   }

   enterInputs(instance, values = null) {
      if (values) {
         if (typeof values == "string") {
            values = JSON.parse(values) ?? {};
         }
         const keys = Object.keys(values);
         if (keys.length > 0) {
            const previousFields = this.process.processDataFields(this);
            do {
               const key = keys.pop();
               for (const previousField of previousFields)
                  if (key.indexOf(previousField.key) > -1) {
                     delete values[key];
                     break;
                  }
            } while(keys.length > 0);
         }
         values._isSet = true;
         this.stateCompleted(instance);
      }

      this.stateUpdate(instance, values);
   }
};
