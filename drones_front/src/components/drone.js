import React from 'react'


const Drone = (props) => {

    /*const day = props.drone.time.getDate();
    let month = props.drone.time.getMonth() + 1;
    let year = props.drone.time.getFullYear();
    var seconds = props.drone.time.getSeconds();
    var minutes = props.drone.time.getMinutes();
    var hour = props.drone.time.getHours();*/
    
    return (
        <tr>
        <td class="p-3">{props.drone.pilot.firstName} {props.drone.pilot.lastName}</td>
        <td class="p-3">{props.drone.pilot.email}</td>
        <td class="p-3">{props.drone.pilot.phoneNumber}</td>
        <td class="p-3">{props.drone.distance}</td>
       <td class="p-3">{props.drone.time}</td>
         </tr>

   
    )

  

}

export default Drone