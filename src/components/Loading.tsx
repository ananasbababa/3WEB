type LoadingProps = {
  show:boolean
}

const Loading = ({show}:LoadingProps) =>{
    return (
        <div id="loading" className={(show==true?"visible":"invisible")}>
          <div className="spinner-grow" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="spinner-grow" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="spinner-grow" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
    )
}


export default Loading