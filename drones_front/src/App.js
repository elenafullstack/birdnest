
import React, { useState, useEffect} from 'react'
import droneService from './services/drones'
import Drone from './components/Drone'


const App = () => {
  const [drones, setDrones] = useState([])

  
  useEffect(() => {
   setInterval(()=>{ droneService.getAll().then(drones =>
      setDrones(drones)
    )  },500)
  
    }, [])




  return (
  <div>
 

    {console.log(drones)}

    <h2>Pilot information</h2>

    <table>
        <tr>
          <th>Pilot Name</th>
          <th>Email</th>
          <th>Phone number</th>
          <th>Closest distance</th>
          <th>Last seen</th>
        </tr>
        {drones.map(x=> <Drone key= {x.serialNumber} drone = {x}/>)}
   
      </table>

  

  
   
  </div>
  
 
  )
  }

export default App
