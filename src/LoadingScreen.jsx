import './LoadingScreen.css';

function LoadingScreen() {
    return (
        <div id="loading-holder">
            {/* <p style={{margin: "0", fontFamily: "var(--ffamily01)"}}>Imprimiendo...</p> */}
            <div className={'loading-producto-yellow-star-01'}></div>
            <div className={'loading-producto-yellow-star-02'}></div>
            <div className={'loading-producto-green-star'}></div>
        </div>
    );
}

export default LoadingScreen;