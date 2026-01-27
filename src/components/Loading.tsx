const Loading : React.FC = () =>{
    return (
        <div id="loading">
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