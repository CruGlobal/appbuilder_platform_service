import ABProcessTaskServiceCore from "../../../core/process/tasks/ABProcessTaskServiceCore.js";

export default class ABProcessTaskService extends ABProcessTaskServiceCore {
   ////
   //// Process Instance Methods
   ////

   /**
    * do()
    * this method actually performs the action for this task.
    * @param {obj} instance  the instance data of the running process
    * @return {Promise}
    *      resolve(true/false) : true if the task is completed.
    *                            false if task is still waiting
    */
   do(instance /* , dbTransaction, req */) {
      return new Promise((resolve, reject) => {
         var myState = this.myState(instance);

         var msg =
            "ABProcessTaskService should not be processed in a .do() block.";
         var badCallError = new Error(msg);
         badCallError.state = myState;
         console.error(msg);
         reject(badCallError);
         return;
      });
   }
}
