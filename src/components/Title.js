const Title = (props) => {
    const counter = props.counter;
    if (counter === 0) {
        return <h1>고양이 가라사대</h1>
    }

    return (
        <h1>{counter}번째 고양이 가라사대</h1>
    )
}

export default Title;