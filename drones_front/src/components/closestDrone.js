import React from 'react'

const ClosestDrone = (props) => {
    if (props.drones.length >0) {
        return (
            <>
            <h2>Pilot closest to the nest in the last 10 minutes</h2>
            <h3>Pilot name: {props.drones[0].pilot.firstName} {props.drones[0].pilot.lastName} </h3>
            <h3>Distance: {props.drones[0].distance} </h3>
            </>
        )
    }
}

export default ClosestDrone