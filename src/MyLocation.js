/* global google */
import React from 'react'
import { Marker } from "react-google-maps"

console.log(google.maps.Symbol)

const icon = {
  path: google.maps.SymbolPath.CIRCLE,
  fillColor: '#4285f4',
  fillOpacity: 1,
  strokeColor: '#4285f4',
  strokeOpacity: 0.2,
  strokeWeight: 15,
  scale: 7,
}

const MyLocation = ({ position }) => {
  return (
    <Marker position={position} icon={icon} />
  )
}

export default MyLocation
