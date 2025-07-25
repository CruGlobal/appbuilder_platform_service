/*
 * ABQLFind
 *
 * An ABQLFind depends on a BASE QL object (Object, Datacollection, Query)
 * and can perform a DB query based upon that BASE object.
 *
 */
const ABQLFindCore = require("../../core/ql/ABQLFindCore.js");

class ABQLFind extends ABQLFindCore {
   // constructor(attributes, prevOP, task, AB) {
   //     super(attributes, ParameterDefinitions, prevOP, task, AB);
   // }
   ///
   /// Instance Methods
   ///

   /**
    * do()
    * perform the action for this Query Language Operation.
    * @param {Promise} chain
    *         the current promise chain of actions being performed.
    * @param {obj} instance
    *        The current process instance values used by our tasks to store
    *        their state/values.
    * @param {Knex.Transaction?} trx
    *        (optional) Knex Transaction instance.
    * @param {ABUtil.reqService} req
    *        an instance of the current request object for performing tenant
    *        based operations.
    * @return {Promise}
    */
   do(chain, instance, trx, req) {
      if (!chain) {
         throw new Error("ABQLFind.do() called without a Promise chain!");
      }

      // capture the new promise from the .then() and
      // return that as the next link in the chain
      var nextLink = chain.then((context) => {
         // {context} context
         // the incoming data structure that defines the state of the results
         // after the previous operation.

         var nextContext = {
            label: "ABQLFind",
            object: context.object,
            data: null,
            prev: context,
         };
         // {context} nextContext
         // this is the data structure that summarizes the results of our
         // current ABQLFind operation, once it is complete.

         if (!context.object) {
            // weird!  pass along our context with data == null;
            return nextContext;
         }

         // otherwise, we perform our find, save the results to our
         // nextContext and then continue on:
         return new Promise((resolve, reject) => {
            var cond = null;
            if (this.params) {
               cond = this.params.cond;
            }
            var reducedCondition = this.conditionReduce(cond, instance);
            req.retry(() =>
               context.object.model().findAll(reducedCondition, null, req)
            )
               .then((rows) => {
                  nextContext.data = rows;
                  if (!rows || rows.length === 0) {
                     // if we didn't get any data, then add some additional
                     // info in case we need to evaluate why.
                     nextContext.origCond = JSON.stringify(cond);
                     nextContext.reducedCondition =
                        JSON.stringify(reducedCondition);
                     nextContext.log = "no rows returned";
                  }
                  resolve(nextContext);
               })
               .catch(reject);
         });
      });

      if (this.next) {
         return this.next.do(nextLink, instance, trx, req);
      } else {
         return nextLink;
      }
   }

   /**
    * @method conditionReduce()
    * parse through our defined conditions, and resolve any "context" related
    * values.
    * @param {obj} cond
    *        The QueryBuilder condition object defined from the UI.
    * @param {obj} instance
    *        The current process instance values used by our tasks to store
    *        their state/values.
    * @return {obj}
    *        Return a NEW condition object that is resolved into useable values
    *        for the .findAll() operation.
    */
   conditionReduce(cond, instance) {
      var newCond = {};

      if (cond) {
         // if this is a group condition, then reduce each of it's rules:
         if (cond.rules) {
            newCond.glue = cond?.glue;
            newCond.rules = [];
            cond.rules.forEach((r) => {
               newCond.rules.push(this.conditionReduce(r, instance));
            });
         } else {
            newCond.value = cond.value;
            newCond.key = cond.key;
            newCond.rule = cond.rule;

            // if this is the special "this_object" reference, change this to "uuid":
            if (newCond.key == "this_object") {
               newCond.key = "uuid";
            }

            // if this is one of our context values:
            // our context value rules will look like: [type]_context_[contains, not_contains]
            if (cond.rule.indexOf("context") > -1) {
               newCond.value = this.task.process.processData(this.task, [
                  instance,
                  cond.value,
               ]);
               newCond.value = newCond.value?.uuid ? newCond.value.uuid : newCond.value;
               newCond.rule = cond.rule.split("context_")[1];
            }
         }
      }

      return newCond;
   }
}

module.exports = ABQLFind;
