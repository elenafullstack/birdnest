
import React, { useState, useEffect} from 'react'
import droneService from './services/drones'
import Drone from './components/Drone'
import ClosestDrone from './components/closestDrone'
import Container from 'react-bootstrap/Container';

 



const App = () => {
  const [drones, setDrones] = useState([])


  
  useEffect(() => {
   setInterval(()=>{ droneService.getAll().then(drones =>
      setDrones(drones)
    )  },500)
  
    }, [])


    function sortBy(field) {
      return function(a, b) {
        return (a[field] > b[field]) - (a[field] < b[field])
      };
    }

    function convertUTCDateToLocalDate(date) {
      var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
  
      var offset = date.getTimezoneOffset() / 60;
      var hours = date.getHours();
  
      newDate.setHours(hours - offset);
  
      return newDate;   
  }



 



  return (

  <div class="container-fluid">
    <div class="container">
    <h1 class="page-header text-primary text-center mb-1 py-4 border-bottom display-4">Birdnest</h1>
    <p class="py-4">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Necessitatibus enim fugiat recusandae dicta blanditiis, modi nisi atque sit magnam vitae voluptatem ipsum iusto praesentium neque placeat voluptas earum. Laboriosam, at?
      Iure voluptatem nostrum, veniam quisquam magnam voluptates praesentium similique cumque quaerat odit ullam cum quia consectetur reprehenderit quidem distinctio sapiente reiciendis vel dignissimos inventore quasi eius incidunt. Quis, quod maxime!
      Temporibus, aspernatur? Perferendis a illo, earum deleniti quae natus perspiciatis molestias mollitia iste nam, nesciunt esse ex accusamus veniam quas eaque obcaecati. Alias laborum sed et autem, quidem eaque corrupti.</p>

      <div class="mb-5 text-center">
        <ClosestDrone drones={[...drones].sort(sortBy('distance'))}/>
      </div>

      <h1 class="text-center">All pilots in the NDZ zone information</h1>

        <div class="table-responsive">


          <table class="table table-bordered mt-4">
            <thead>
                <tr>
                  <th class="p-3">Pilot name</th>
                  <th class="p-3">Email</th>
                  <th class="p-3">Phone number</th>
                  <th class="p-3">Closest distance</th>
                  <th class="p-3">Last seen</th>
                </tr>
              </thead>
              <tbody class="">
                {drones.map(x=> <Drone key= {x.serialNumber} drone = {x}/>)}
              </tbody>
            
          </table>


        </div>
    
      </div>
    </div>
 
  )
  }

export default App
