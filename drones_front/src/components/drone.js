import React from 'react'

const Drone = (props) => {
    
    return (
        <tr>
        <td>{props.drone.pilot.firstName} {props.drone.pilot.LastName}</td>
        <td>{props.drone.pilot.phoneNumber}</td>
        <td>{props.drone.pilot.email}</td>
        <td>{props.drone.distance}</td>
        <td>{props.drone.time}</td>
         </tr>

   
    )

  

}

export default Drone