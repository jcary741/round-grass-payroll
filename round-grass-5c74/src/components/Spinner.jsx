export function Spinner(){
    return <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="spinner-border" role="status">
            <span className="sr-only" aria-label="loading"></span>
        </div>
    </div>
}