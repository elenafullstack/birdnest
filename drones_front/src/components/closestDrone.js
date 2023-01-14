import React from 'react'

const ClosestDrone = (props) => {
    if (props.drones.length >0) {
        return (
            <>
            <h2>Pilot closest to the nest in the last 10 minutes</h2>
            <h4>Pilot name: {props.drones[0].pilot.firstName} {props.drones[0].pilot.lastName} </h4>
            <h4>Distance: {props.drones[0].distance} </h4>
            </>
        )
    }
}

export default ClosestDrone