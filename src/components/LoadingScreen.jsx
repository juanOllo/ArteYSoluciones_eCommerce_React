import './LoadingScreen.css';

function LoadingScreen() {
    return (
        <div id="loading-holder">
            {/* <p style={{margin: "0", fontFamily: "var(--ffamily01)"}}>Imprimiendo...</p> */}
            <div className={'loading-producto-yellow-star-01'}/>
            <div className={'loading-producto-yellow-star-02'}/>
            <div className={'loading-producto-green-star'}/>
        </div>
    );
}

export default LoadingScreen;