const Loader = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <img src="/loading.gif" alt="loading"/>
            <br />
            <h1 className="text-2xl font-sans">Loading maps...<br /> Please wait a second</h1>
        </div>
    )
}

export default Loader;