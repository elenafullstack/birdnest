import React from 'react'

const Drone = (props) => {

    return (

        <tr>
            <td class="p-3">{props.drone.pilot.firstName} {props.drone.pilot.lastName}</td>
            <td class="p-3">{props.drone.pilot.email}</td>
            <td class="p-3">{props.drone.pilot.phoneNumber}</td>
            <td class="p-3">{props.drone.closestDistance} m</td>
            <td class="p-3">{new Date(props.drone.timeEnter).toLocaleString()}</td>
            <td class="p-3">{new Date(props.drone.timeLast).toLocaleString()}</td>
        </tr>

    )

}

export default Drone