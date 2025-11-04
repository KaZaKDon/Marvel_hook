import { useState, useEffect } from 'react';
import { charShape } from '../../utils/charShape';

import './randomChar.scss';
import MarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import mjolnir from '../../resources/img/mjolnir.png';
import abyss from '../../resources/img/abyss.jpg'; // заглушка на случай отсутствия изображения

const RandomChar = () => {
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onCharLoaded = (charData) => {
        try {
            const transformed = transformChar(charData);
            setChar(transformed);
            setLoading(false);
        } catch (e) {
            console.error('Marvel fetch error:', e);
            setError(true);
            setLoading(false);
        }
    };

    const onError = () => {
        setLoading(false);
        setError(true);
    };

    const updateChar = () => {
        setLoading(true);
        setError(false);
        const id = Math.floor(Math.random() * (20 - 1) + 1); // случайный ID Marvel
        marvelService.getCharacter(id)
            .then(onCharLoaded)
            .catch(onError);
    };

    const transformChar = (char) => {
        const isImageAvailable = char.thumbnail?.path && !char.thumbnail.path.includes('image_not_available');

        return {
            id: char.id,
            name: char.name || 'Имя отсутствует',
            description: char.description || 'Описание отсутствует',
            thumbnail: char.thumbnail
                ? `${char.thumbnail.path}.${char.thumbnail.extension}`
                : abyss,
            homepage: char.urls?.[0]?.url || '#',
            wiki: char.urls?.[1]?.url || '#',
            imageAvailable: !!isImageAvailable,
            comics: (char.comics?.items || []).map(item => ({ name: item.name })),
        };
    };

    const skeleton = !char && !loading && !error ? <Skeleton /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = char && !loading && !error ? <View char={char} /> : null;

    return (
        <div className="randomchar">
            {errorMessage}
            {spinner}
            {skeleton}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br />
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main" onClick={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
            </div>
        </div>
    );
};

const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, imageAvailable, comics } = char;

    const shortDescr = description.length > 150 ? description.slice(0, 150) + '...' : description;

    const imgStyle = {
        width: 200,
        height: 200,
        objectFit: imageAvailable ? 'cover' : 'contain'
    };

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt={name} style={imgStyle} />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">{shortDescr}</p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {comics.length > 0
                        ? comics.map((item, i) => (
                            <li key={i} className="char__comics-item">{item.name}</li>
                        ))
                        : 'Нет ни одного комикса с участием данного персонажа'}
                </ul>
            </div>
        </div>
    );
};

View.propTypes = {
    char: charShape.isRequired
};

export default RandomChar;