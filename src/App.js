import React, { useState } from "react";
import axios from "axios";
export default function App() {
  const today = new Date();
  const [api, setApi] = useState();
  const [token, setToken] = useState();
  const [startDate, setStartDate] = useState(
    today.toISOString().substring(0, 10)
  );
  const [endDate, setEndDate] = useState(today.toISOString().substring(0, 10));
  const [loading, setLoading] = useState();
  const [error, setError] = useState(null);
  const [sum, setSum] = useState(0);

  const callApi = (event) => {
    event.preventDefault();
    setLoading(true);
    if (!token) {
      setError("Token is required");
      return;
    }
    if (!startDate) {
      setError("Start date is required");
      return;
    }
    if (!endDate) {
      setError("End date is required");
      return;
    }
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    setTimeout(() => {
      axios
        .get(
          `http://192.168.86.10:81/api/projects-work-logs?start_date=${startDate}&end_date=${endDate}`,
          config
        )
        .then((res) => {
          setError(null);
          let filteredApi = res.data.data.map((projects) => {
            return {
              title: projects.title,
              tasks: projects.tasks.filter((task) => task.worklogs.length > 0),
            };
          });
          filteredApi = filteredApi.filter(
            (projects) => projects.tasks.length > 0
          );
          setApi(filteredApi);
          setSum(0);
          let a = 0;
          filteredApi?.forEach((projects) => {
            projects.tasks.forEach((task) => {
              task.worklogs?.forEach((worklog) => {
                a = a + worklog.duration;
                setSum(a);
              });
            });
          });
          setLoading(false);
        })
        .catch((err) => {
          setError("Error, Invalid Token");
        });
    }, 1000);
  };

  function timeConvert(n) {
    var num = n;
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return `${rhours !== 0 ? rhours + "hr" : ""} ${
      rminutes !== 0 ? rminutes + "min" : ""
    }`;
  }

  const handleStartDateChange = (e) => {
    const date = new Date(e.target.value);
    setStartDate(date.toISOString().substring(0, 10));
  };

  const handleEndDateChange = (e) => {
    const date = new Date(e.target.value);
    setEndDate(date.toISOString().substring(0, 10));
  };

  const getConvertedTime = (min) => {
    return timeConvert(min);
  };

  return (
    <>
      <div className="container">
        <div className="grid-content ">
          <div className="form-container">
            <form className="form" onSubmit={callApi}>
              <div className="form-group">
                <label>Token</label>
                <textarea
                  type="text"
                  rows={12}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}></textarea>
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}></input>
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}></input>
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              {error && <small className="error">{error}</small>}
            </form>
            <div className="total-hr-block">
              <h4>Total Hours Logged</h4>
              <h3>{getConvertedTime(sum)}</h3>
            </div>
          </div>
          <div className="project-content">
            {loading ? (
              <h2>Loading...</h2>
            ) : (
              <>
                {api?.map((projects, index) => {
                  return (
                    <div key={index}>
                      <h4 className="title">{projects.title}</h4>
                      <table className="table">
                        <thead className="thead-dark">
                          <tr>
                            <th scope="col">Tasks</th>
                            <th scope="col">Date</th>
                            <th scope="col">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.tasks.map((task) => {
                            return (
                              <>
                                <tr key={task.id}>
                                  <td rowSpan={task.worklogs.length + 1}>
                                    {task.code} : {task.title}
                                  </td>
                                </tr>
                                {task.worklogs.map((worklog) => {
                                  return (
                                    <tr key={worklog.id}>
                                      <td className="date" rowSpan="1">
                                        {worklog.date}
                                      </td>
                                      <td className="time" rowSpan="1">
                                        {getConvertedTime(worklog.duration)}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
