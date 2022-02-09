const MainCard = (props) => {
    return (
        <div className="main-card">
            <img src={props.img} alt={props.alt}/>
            <button onClick={props.onHeartClick}>{props.heart}
            </button>
        </div>
    )
}

export default MainCard;