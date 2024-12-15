const {
  getAllLaunches,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch,
} = require("../../models/launches.model");
const { getPagination } = require("../../services/query");

/**
 * @function httpGetAllLaunches
 * @description Get all launches.
 * @param {http.IncomingMessage} req - The request object.
 * @param {http.ServerResponse} res - The response object.
 * @returns {Promise<void>}
 */
async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  console.log("Helooooooooooooooooo");
  console.log(req.query);
  const launches = await getAllLaunches(skip, limit);

  return res.status(200).json(launches);
}

/*************  ✨ Codeium Command ⭐  *************/
/**
 * @function httpAddNewLaunch
 * @description Add a new launch.
 * @param {http.IncomingMessage} req - The request object.
 * @param {http.ServerResponse} res - The response object.
 * @returns {Promise<void>}
 */
/******  696a8a91-d9a2-4200-a5ff-a0e55d75bbde  *******/
async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({ error: "Missing required launch property" });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

/**
 * @function httpDeleteLaunch
 * @description Abort a launch.
 * @param {http.IncomingMessage} req - The request object.
 * @param {http.ServerResponse} res - The response object.
 * @returns {Promise<void>}
 */

async function httpDeleteLaunch(req, res) {
  const launchId = +req.params.id;
  const existsLaunch = await existsLaunchWithId(launchId);

  if (!existsLaunch) {
    return res.status(404).json({ error: "Launch not found" });
  }

  const aborted = await abortLaunchById(launchId);

  if (!aborted) {
    return res.status(400).json({ error: "Launch not aborted" });
  }

  return res.status(200).json({ ok: true });
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpDeleteLaunch };
