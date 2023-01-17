import React from 'react'

const ClosestDrone = (props) => {

  if (props.closest.length !== 0) {

        return (

            <>
                <h2>Closest distance confirmed to the nest</h2>
                <h4>Pilot name: {props.closest[0].pilot.firstName} {props.closest[0].pilot.lastName} </h4>
                <h4>Distance: {props.closest[0].closestDistance} m </h4>
            </>

        )

    }
    
}

export default ClosestDrone