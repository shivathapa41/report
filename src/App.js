
import React, { useState } from "react";
import axios from "axios";
export default function App() {

  const [api, setApi] = useState()
  const [token, setToken] = useState()
  const [start, setStart] = useState();
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
        `http://192.168.86.10:81/api/projects-work-logs?start_date=${start}&end_date=${start}`
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
      <h5> Token</h5>
      <input type="text" value={token} onChange={(e) => setToken(e.target.value)}></input>
      <h5> Date</h5>
      <input type="text" value={start} onChange={(e) => setStart(e.target.value)}></input>
      <br />
      <button className="btn btn-primary" onClick={callApi} >Click</button>
      {api?.map((projects) => {
        return (
          <>
            <h4>{projects.title}</h4>
            <table class="table mb-5">
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
                        <td rowspan={task.worklogs.length + 1}>{task.title}</td>
                      </tr>
                      {task.worklogs.map((worklog) => {
                        return (
                          <tr>
                            <td rowspan="1">{worklog.date}</td>
                            <td rowspan="1" calculate={add(worklog.duration)}>
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
      <h1>Total Logged: {timeConvert(sum)}</h1>
    </>
  );
}



