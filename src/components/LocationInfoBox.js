
const LocationInfobox = ({ info, onClick }) => {
  return (
    <div id="infobox" className="rounded-lg opacity-80 text-neutral-100 text-md w-[20vw] h-auto bg-zinc-800 absolute top-[80%] left-4 p-2">
        <h2>Event Location Info</h2>
        <button onClick={onClick} className="absolute bottom-[80%] right-4"><img src="/mdi--remove.svg" alt="Close Icon"/></button>
        <ul>
        <li>ID:<strong> { info.id }</strong></li>
        <li>Title:<strong> { info.title }</strong></li>
        <li>Coordinates:<strong> { info.coordinates }</strong></li>    
        </ul>
    </div>
  )
}

export default LocationInfobox