import React, {useEffect} from "react";
import axios from "axios";

const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);

const uuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

const jsonLocalStorage = {
    setItem: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key) => {
        return JSON.parse(localStorage.getItem(key));
    },
};

const fetchCat = async (text) => {
    const OPEN_API_DOMAIN = "https://cataas.com";
    const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
    const responseJson = await response.json();
    return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

const fetchCatWithAxios = async (text) => {
    const OPEN_API_DOMAIN = "https://cataas.com";
    const response = await axios.get(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
    const data = await response.data;
    return `${OPEN_API_DOMAIN}${data.url}`;
}

// component
const Title = (props) => {
    return (
        <h1>{props.children}</h1>
    )
}

function CatForm(props) {
    const [value, setValue] = React.useState('')
    const [errorMessage, setErrorMessage] = React.useState('')

    function handleInputChange(e) {
        const userValue = e.target.value;
        setErrorMessage('')
        if (includesHangul(userValue)) {
            setErrorMessage('No Korean')
        }
        setValue(userValue.toUpperCase())
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        if (value === '') {
            setErrorMessage('No Blank')
            return
        }
        props.updateMainCat(value)
        props.initHeart()
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <input type="text" name="name" placeholder="영어 대사를 입력해주세요" value={value}
                   onChange={handleInputChange}/>
            <button type="submit">생성</button>
            <p style={{color: 'red'}}>{errorMessage}</p>
        </form>
    )
}

const MainCard = (props) => {
    return (
        <div className="main-card">
            <img src={props.img} alt={props.alt}/>
            <button onClick={props.onHeartClick}>{props.heart}
            </button>
        </div>
    )
}

function CatItem(props) {
    return (
        <li>
            <img src={props.img}/>
        </li>
    )
}

function Favorites(props) {

    return (
        <ul className="favorites">
            {props.favorites.map(cat => <CatItem key={uuidv4()} img={cat}/>)}
        </ul>
    )
}

const App = () => {
    const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
    const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
    const CAT3 = "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";

    // title
    const [counter, setCounter] = React.useState(jsonLocalStorage.getItem("counter") || 1);

    // mainCard
    const [mainCat, setMainCat] = React.useState(jsonLocalStorage.getItem("mainCat") || CAT1);
    const [heart, setHeart] = React.useState(jsonLocalStorage.getItem("heart") || '♡')

    async function setInitialCat() {
        const firstCat = await fetchCatWithAxios('First cat');
        setMainCat(firstCat);
    }

    useEffect(() => {
        setInitialCat();
    }, []);

    function onHeartClick(e) {
        e.preventDefault()
        if (heart === "💖") {
            setHeart("♡")
            jsonLocalStorage.setItem("heart", "♡")
            favorites.pop();
            setFavorites(favorites)
            jsonLocalStorage.setItem("favorites", favorites)
            return
        }
        setHeart("💖")
        jsonLocalStorage.setItem("heart", "💖")
        const newFavorites = [...favorites, mainCat];
        setFavorites(newFavorites)
        jsonLocalStorage.setItem("favorites", newFavorites)
    }

    // favorites
    const [favorites, setFavorites] = React.useState(jsonLocalStorage.getItem("favorites") || []);

    // form
    async function updateMainCat(value) {
        const mainCat = await fetchCatWithAxios(value);
        const newCounter = counter + 1;
        setCounter(newCounter);
        jsonLocalStorage.setItem("counter", newCounter)
        setMainCat(mainCat)
        jsonLocalStorage.setItem("mainCat", mainCat)
    }

    function initHeart() {
        if (heart === "💖") {
            setHeart("♡")
            jsonLocalStorage.setItem("heart", "♡")
        }
    }

    return (
        <div>
            <Title>{counter}번째 고양이 가라사대</Title>
            <CatForm updateMainCat={updateMainCat}
                     initHeart={initHeart}/>
            <MainCard
                img={mainCat}
                alt="Cat"
                onHeartClick={onHeartClick}
                heart={heart}
            ></MainCard>
            <Favorites favorites={favorites}></Favorites>
        </div>
    )
}

export default App;