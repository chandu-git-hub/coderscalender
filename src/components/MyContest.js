import React, { useState, useEffect } from "react";
import localforage from "localforage";
import "./Subscribe.css";
import { Button } from "@material-ui/core";

export default function MyContest() {
  const [currentContest, setcurrentContest] = useState("ongoing");
  const [mycontest, setmycontest] = useState([]);
  const [temp_contest, settemp_contest] = useState([]);

  useEffect(() => {
    const GetData = () =>
      localforage.getItem("myContests", function (err, value) {
        if (err) console.log(err);
        setmycontest(ongoing(value));
        settemp_contest(value);

        console.log("DB MyContest :");
        console.log(value);
      });

    GetData();
  }, []);

  return (
    <div>
      <div className="Sections">
        <Button
          className="sections"
          onClick={() => {
            setmycontest(ongoing(temp_contest));
            setcurrentContest("ongoing");
          }}
          fontFamily="Robots"
          style={{
            textTransform: "none",
            backgroundColor: currentContest === "ongoing" ? "#fff" : "#343a40",
            color: currentContest === "ongoing" ? "#222" : "#fff",
            borderRadius: 0,
            outline: "none",
            display: "block",
          }}
        >
          Ongoing
        </Button>
        <Button
          // variant="contained"
          className="sections"
          onClick={() => {
            setmycontest(contests_in_24_hours(temp_contest));
            setcurrentContest("24hours");
          }}
          fontFamily="Helvetica Neue"
          style={{
            textTransform: "none",
            backgroundColor: currentContest === "24hours" ? "#fff" : "#343a40",
            color: currentContest === "24hours" ? "#222" : "#fff",
            borderRadius: 0,
            outline: "none",
            display: "block",
          }}
        >
          In 24 hours
        </Button>
        <Button
          // variant="contained"
          className="sections"
          onClick={() => {
            setmycontest(upcoming(temp_contest));
            setcurrentContest("upcoming");
          }}
          fontFamily="Helvetica Neue"
          style={{
            textTransform: "none",
            backgroundColor: currentContest === "upcoming" ? "#fff" : "#343a40",
            color: currentContest === "upcoming" ? "#222" : "#fff",
            borderRadius: 0,
            display: "block",
          }}
        >
          Upcoming
        </Button>
      </div>
      {mycontest?.length < 1 && (
        <div className="blank">
          {currentContest === "24hours"
            ? "No contests in 24 hours"
            : `No ${currentContest} Contests`}
        </div>
      )}
      {mycontest?.length > 0 &&
        mycontest.map((contest, key) => (
          <div key={key}>
            <div
              className="card text-center"
              style={{ backgroundColor: "white" }}
            >
              <div className="card-body">
                <div className="card-info">
                  <img
                    style={{
                      height: "60px",
                      width: "60px",
                    }}
                    src={getImage(contest.site)}
                    alt="{contest.site}"
                  />
                  <div>
                    <h6>{contest.name}</h6>

                    <h6 className="card-text">
                      <div>
                        Start:
                        {getDate(contest.start_time)}
                        <p>
                          End:
                          {getDate(contest.end_time)}
                        </p>
                      </div>
                    </h6>
                  </div>
                </div>
                <div className="buttons">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => openLink(contest.url)}
                  >
                    Go to Contest
                  </button>
                  {(currentContest === "24hours" ||
                    currentContest === "upcoming") && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm btn-circle"
                      onClick={() => openCalander(contest)}
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Add to calendar"
                    >
                      <i className="bi bi-calendar-event"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

// ============================ Helper =================================
function getDate(d) {
  console.log(d);
  var date_temp = new Date(d);
  console.log(date_temp);
  var date = date_temp.toLocaleString("en-US");
  var datearray = date.split("/");
  var newdate = datearray[1] + "/" + datearray[0] + "/" + datearray[2];
  return newdate.replace(",", "    ");
}

// Opens new tab with given uri
function openLink(uri) {
  chrome.tabs.create({ active: true, url: uri });
}

// Open Calander

function contests_in_24_hours(myContests_db) {
  //await getmyContests();
  var in_24_hours = [];
  for (var contest of myContests_db) {
    if (contest.in_24_hours === "Yes" && contest.status === "BEFORE")
      in_24_hours.push(contest);
  }
  return in_24_hours;
}
function ongoing(myContests_db) {
  //await getmyContests();
  var Ongoing = [];
  for (var contest of myContests_db) {
    if (contest.status === "CODING") Ongoing.push(contest);
  }
  // console.log(Ongoing);
  // console.log(mycontest);
  return Ongoing;
}
function upcoming(myContests_db) {
  //await getmyContests();

  var Upcoming = [];
  for (var contest of myContests_db) {
    if (contest.status === "BEFORE" && contest.in_24_hours === "No")
      Upcoming.push(contest);
  }

  // console.log(Upcoming);
  // console.log(mycontest);
  return Upcoming;
}

function openCalander(contest) {
  console.log("In Calander");
  function ISODateString(d) {
    var isoDate = d.toISOString();
    isoDate = isoDate.replaceAll(":", "");
    isoDate = isoDate.replaceAll("-", "");
    var retval = isoDate.split(".")[0];
    return retval + "Z";
  }

  var start = new Date(contest.start_time);
  var end = new Date(contest.end_time);
  // console.log(start.toISOString());

  var uri = `http://www.google.com/calendar/event?action=TEMPLATE&text=${encodeURIComponent(
    contest.name
  )}&dates=${ISODateString(start)}/${ISODateString(
    end
  )}&details=Your remainder is set by Kontests. Contest URL : ${contest.url}`;
  chrome.tabs.create({ active: true, url: uri });
}

// Db function
function getImage(site) {
  
  var uri = "";
  switch (site) {
    case "code_chef":
      uri =
        "https://i.pinimg.com/originals/c5/d9/fc/c5d9fc1e18bcf039f464c2ab6cfb3eb6.jpg";
      break;
    case "codeforces":
      uri =
        "https://i.pinimg.com/736x/b4/6e/54/b46e546a3ee4d410f961e81d4a8cae0f.jpg";
      break;
    case "leet_code":
      uri =
        "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png";
      break;
    case "at_coder":
      uri = "https://avatars.githubusercontent.com/u/7151918?s=200&v=4";
      break;
    case "hacker_rank":
      uri =
        "https://upload.wikimedia.org/wikipedia/commons/4/40/HackerRank_Icon-1000px.png";
      break;
    case "hacker_earth":
      uri =
        "https://yt3.ggpht.com/ytc/AAUvwngkLcuAWLtda6tQBsFi3tU9rnSSwsrK1Si7eYtx0A=s176-c-k-c0x00ffffff-no-rj";
      break;
    case "kick_start":
      uri =
        "https://images.theconversation.com/files/93616/original/image-20150902-6700-t2axrz.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1000&fit=clip";
      break;
    case "top_coder":
      uri =
        "https://images.ctfassets.net/b5f1djy59z3a/3MB1wM9Xuwca88AswIUwsK/dad472153bcb5f75ea1f3a193f25eee2/Topcoder_Logo_200px.png";
      break;
    default:
    // Do nothing
  }
  return uri;
}
