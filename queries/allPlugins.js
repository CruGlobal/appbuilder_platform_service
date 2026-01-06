/**
 * allPlugins.js
 * returns all the Plugin definitions in our SITE_PLUGIN table that
 * match the given platform.
 * @param {ABFactory} AB
 *        The ABFactory that manages the Tenant Data this request should
 *        operate under.
 * @param {ABUtils.reqService} req
 *        The service request object that is driving this operation.
 * @param {obj} cond
 *        a value hash representing the condition for the operation.
 * @return {Promise}
 *        resolve(): {array} [{value}, {value}...]
 */

module.exports = async function (req, cond, options = {}) {
   try {
      let tenantDB = req.queryTenantDB();
      // queryTenantDB will throw an error if not found

      tenantDB += ".";

      let sql = `SELECT * FROM ${tenantDB}\`SITE_PLUGIN\``;

      let { condition, values } = req.queryWhereCondition(cond);
      if (condition) {
         sql += ` WHERE ${condition}`;
      }

      const { results } = await req.queryAsync(sql, values);
      return results;
   } catch (error) {
      if (
         !options.silenceErrors ||
         !options.silenceErrors.includes(error.code)
      ) {
         req.log(error);
      }
      throw error;
   }
};
