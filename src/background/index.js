import localforage from "localforage";
console.log("IN background");

var myContests = [];

var platforms = [
  {
    platform: "code_chef",
    isSubscribed: true,
  },
  {
    platform: "codeforces",
    isSubscribed: true,
  },
  {
    platform: "leet_code",
    isSubscribed: true,
  },
  {
    platform: "at_coder",
    isSubscribed: true,
  },
  {
    platform: "hacker_earth",
    isSubscribed: true,
  },
  {
    platform: "hacker_rank",
    isSubscribed: true,
  },
  {
    platform: "kick_start",
    isSubscribed: true,
  },
  {
    platform: "top_coder",
    isSubscribed: true,
  },
];

// Fetch Function
async function fetchAllMyContests() {
  // console.log("In fetch all my contests");
  myContests = [];
  var subscribe = {};

  for (var pl of platforms) {
    subscribe[pl.platform] = pl.isSubscribed;
  }

  var contests = await fetchContestDetails();

  for (var contest of contests) {
    switch (contest.site) {
      case "CodeForces":
        contest.site = "codeforces";
        break;
      case "HackerEarth":
        contest.site = "hacker_earth";
        break;
      case "TopCoder":
        contest.site = "top_coder";
        break;
      case "Kick Start":
        contest.site = "kick_start";
        break;
      case "LeetCode":
        contest.site = "leet_code";
        break;
      case "AtCoder":
        contest.site = "at_coder";
        break;
      case "HackerRank":
        contest.site = "hacker_rank";
        break;
      case "CodeChef":
        contest.site = "code_chef";
        break;
      default:
      // do nothing
    }

    if (subscribe[contest.site]) {
      myContests.push(contest);
    }
  }
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  // console.log("Msg recieed");
  if (request.data === "Update MyContests") {
    sendResponse({ data: "success" });
    await getPlatforms();
    await fetchAllMyContests();
    await setmyContests();
  }
});

chrome.runtime.onInstalled.addListener((details) => {
  // console.log("onInstalled....");
  startRequest();
});

// ========================================= DB ===================================================
async function setmyContests() {
  // console.log("In setmyContests");
  await localforage.setItem("myContests", myContests);
}
async function setPlatforms() {
  // console.log("In setPlatforms");
  await localforage.setItem("platforms", platforms);
}

async function getPlatforms() {
  // console.log("1. In getPlatforms");
  await localforage.getItem("platforms", function (err, value) {
    if (value === null) {
      // console.log("Err: No platforms array in DB");
      return;
    }
    platforms = value;
    // console.log(value);
  });
}

async function fetchContestDetails() {
  const res = await fetch(`https://www.kontests.net/api/v1/all`, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  if (!res.ok) {
    const message = "An error has occured";
    throw new Error(message);
  }

  const contestDetails = await res.json();
  return contestDetails;
}

// fetch data and save to local storage
async function startRequest() {
  // console.log("start HTTP Request...");
  // We need to get the array that user has stored previously if not then we use original one
  await getPlatforms();
  await fetchAllMyContests();
  await setmyContests();
  await setPlatforms();
}
