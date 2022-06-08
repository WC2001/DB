/**
 *
 * @param {string} status
 * @param {object} data
 * @returns {{data, message}}
 * @constructor
 */
const ResponseHelper = (status, data) => ({ "status": status, data });

module.exports = { ResponseHelper }