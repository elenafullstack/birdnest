import axios from 'axios'
const droneUrl = '/api/drones'
const closestUrl = '/api/closestDrone'

const getAll = () => {

  const request= axios.get(droneUrl)
  return request.then(response => response.data)

}

const getClosest = () => {

  const request= axios.get(closestUrl)
  return request.then(response => response.data)

}

export default {getAll, getClosest}