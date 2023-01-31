
import React, { useState } from "react";
import axios from "axios";
export default function App() {

  const [api, setApi] = useState()
  const [token, setToken] = useState()
  const [startDate, setStartDate] = useState('2023-01-04')
  const [endDate, setEndDate] = useState()
  const [loading, setLoading] = useState()

  const callApi = () => {
    setLoading(true)
    let config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    axios
      .get(
        `http://192.168.86.10:81/api/projects-work-logs?start_date=${startDate}&end_date=${startDate}`
        , config
      )
      .then((res) => {
        setLoading(false)
        let filteredApi = res.data.data.map((projects) => {
          return {
            title: projects.title,
            tasks: projects.tasks.filter((task) => task.worklogs.length > 0)
          };
        });
        filteredApi = filteredApi.filter((projects) => projects.tasks.length > 0);
        setApi(filteredApi)
      }).catch(err => {
        alert('Wrong token')
      });
  }

  let sum = 0;
  const add = (num) => {
    sum += num;
  };
  function timeConvert(n) {
    var num = n;
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + " hr " + rminutes + "min";
  }
  if (loading === 1) {
    return "<h1>ABC</h1>";
  }
  return (
    <>
      <div className="container">
        <div className="form-container">
          <div className="form-group">
          <label>Token</label>
          <textarea type="text" rows={6} value={token} onChange={(e) => setToken(e.target.value)}></textarea>
          </div>
          <div className="form-group">
          <label>Start Date</label>
          <input type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)}></input>
          </div>
          {/* <div className="form-group">
          <label>End Date</label>
          <input type="text" value={endDate} onChange={(e) => setEndDate(e.target.value)}></input>
          </div> */}
          <button className="btn btn-primary" onClick={callApi} >Click</button>
        </div>
      
        {api?.map((projects) => {
          return (
            <>
              <h4 className="title">{projects.title}</h4>
              <table class="table">
                <thead class="thead-dark">
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
                        <tr>
                          <td rowspan={task.worklogs.length + 1}>{task.code} : {task.title}</td>
                        </tr>
                        {task.worklogs.map((worklog) => {
                          return (
                            <tr>
                              <td className="date" rowspan="1">{worklog.date}</td>
                              <td className="time" rowspan="1" calculate={add(worklog.duration)}>
                                {worklog.duration / 60}
                              </td>
                            </tr>
                          );
                        })}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </>
          );
        })}

        <h3>Total Logged: {timeConvert(sum)}</h3>
      </div>
    </>
  );
}