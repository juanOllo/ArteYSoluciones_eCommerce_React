const newQuestion = (e) => {
        // Aplica animacion de click al addToCarBtn
        const btn = e.target.classList.contains("btn") ? e.target : e.target.parentElement;
        // console.log("btn: ", btn);
        // btn.style.backgroundColor = "transparent";
        btn.style.animation = "none";
        btn.style.animation = "encargar-btn-ready-click-anim 0.1s ease-in-out";
        setTimeout(() => {
            btn.style.animation = "none";
        }, 100);
    }
const Questions = () => {

    

    return (
        <div className="questions-section">
            <h2 style={{margin: "0 auto"}}>Preguntas:</h2>
            <p style={{margin: "0 auto"}}>Tenes una duda sobre el producto?</p>
            <button onClick={newQuestion} className="new-question-btn btn">DEJÁNOS TU PREGUNTA</button>
            <div className="question-card">
                <div className="question">
                    <div className="question-user"></div>
                    <p className="question-text">
                        Esto es una pregunta o es una respuesta
                    </p>
                </div>
                <div className="answer">
                    <p className="answer-text">
                        Esto es una pregunta o es una respuesta
                    </p>
                    <div className="answer-user">
                        <img src={`${process.env.PUBLIC_URL}/assets/estrella_saludando.png`}/>

                    </div>
                </div>
            </div>
            <div className="question-card">
                <div className="question">
                    <div className="question-user"></div>
                    <p className="question-text">
                        Esto es una pregunta o es una respuesta
                    </p>
                </div>
                <div className="answer">
                    <p className="answer-text">
                        Esto es una pregunta o es una respuesta
                    </p>
                    <div className="answer-user">
                        <img src={`${process.env.PUBLIC_URL}/assets/estrella_saludando.png`}/>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Questions;